import type { ITripSectionRepository } from '../../model/types'
import type { TripSection, TripSectionType } from '~/shared/types/models/trip'
import { v4 as uuidv4 } from 'uuid'

const mockSections: TripSection[] = []

export class TripSectionRepository implements ITripSectionRepository {
  async create(data: { tripId: string, type: TripSectionType, title: string, icon: string | null, content: any }): Promise<TripSection> {
    const newSection: TripSection = {
      ...data,
      id: uuidv4(),
      order: mockSections.filter(s => s.tripId === data.tripId).length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockSections.push(newSection)
    return Promise.resolve(newSection)
  }

  async update(data: { id: string, title?: string | undefined, icon?: string | null | undefined, content?: any }): Promise<TripSection> {
    const section = mockSections.find(s => s.id === data.id)
    if (!section)
      throw new Error('Section not found')
    Object.assign(section, data, { updatedAt: new Date().toISOString() })
    return Promise.resolve(section)
  }

  async delete(id: string): Promise<TripSection> {
    const index = mockSections.findIndex(s => s.id === id)
    if (index === -1)
      throw new Error('Section not found')
    const [deleted] = mockSections.splice(index, 1)
    return Promise.resolve(deleted)
  }
}
