import type { ICommunityRepository } from '../../model/types'
import type { Community, CreateCommunityInput, ListCommunitiesInput } from '~/shared/types/models/community'

const logWarning = (method: string) => console.warn(`SqlCommunityRepository.${method} is not implemented yet.`)

// Placeholder implementation for SQL client
export class CommunityRepository implements ICommunityRepository {
  async create(data: CreateCommunityInput, _ownerId: string): Promise<Community> {
    logWarning('create')
    // This is a mock response, a real implementation would use this.db
    return {
      id: `sql-comm-${Date.now()}`,
      ...data,
      ownerId: _ownerId,
      createdAt: new Date(),
      updatedAt: new Date(),
      _count: { members: 1 },
      owner: { id: _ownerId, name: 'SQL User', avatarUrl: null },
    }
  }

  async list(_filters: ListCommunitiesInput): Promise<Community[]> {
    logWarning('list')
    return []
  }

  async getById(id: string): Promise<Community | null> {
    logWarning(`getById ${id}`)
    return null
  }
}
