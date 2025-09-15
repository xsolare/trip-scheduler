import type { ICommunityRepository } from '../../model/types'
import type { Community, CreateCommunityInput } from '~/shared/types/models/community'
import { v4 as uuidv4 } from 'uuid'
import { MOCK_USER_DATA } from './data/user'

const mockCommunities: Community[] = [
  {
    id: 'comm-1',
    name: 'Любители походов по Альпам',
    description: 'Обсуждаем лучшие маршруты, снаряжение и делимся впечатлениями о походах в Альпах.',
    privacyType: 'public',
    ownerId: MOCK_USER_DATA[0].id,
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: { id: MOCK_USER_DATA[0].id, name: MOCK_USER_DATA[0].name, avatarUrl: MOCK_USER_DATA[0].avatarUrl },
    _count: { members: 25 },
  },
  {
    id: 'comm-2',
    name: 'Гастро-тур по Италии',
    description: 'Для всех, кто любит итальянскую кухню! Делимся рецептами, находим лучшие рестораны и планируем вкусные поездки.',
    privacyType: 'public',
    ownerId: 'user-2',
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: { id: 'user-2', name: 'София', avatarUrl: 'https://i.pravatar.cc/150?u=sofia' },
    _count: { members: 152 },
  },
  {
    id: 'comm-3',
    name: 'Семейная поездка в Турцию 2026',
    description: 'Наше закрытое сообщество для планирования летнего отпуска.',
    privacyType: 'private',
    ownerId: MOCK_USER_DATA[0].id,
    createdAt: new Date(),
    updatedAt: new Date(),
    owner: { id: MOCK_USER_DATA[0].id, name: MOCK_USER_DATA[0].name, avatarUrl: MOCK_USER_DATA[0].avatarUrl },
    _count: { members: 5 },
  },
]

export class CommunityRepository implements ICommunityRepository {
  async create(data: CreateCommunityInput, ownerId: string): Promise<Community> {
    const newCommunity: Community = {
      id: uuidv4(),
      ...data,
      ownerId,
      createdAt: new Date(),
      updatedAt: new Date(),
      _count: { members: 1 },
      owner: { id: MOCK_USER_DATA[0].id, name: MOCK_USER_DATA[0].name, avatarUrl: MOCK_USER_DATA[0].avatarUrl },
    }
    mockCommunities.unshift(newCommunity)
    return newCommunity
  }

  async list(filters: { tab?: 'my' | 'public' }): Promise<Community[]> {
    if (filters.tab === 'my') {
      return mockCommunities.filter(c => c.ownerId === MOCK_USER_DATA[0].id || c.id === 'comm-3')
    }
    return mockCommunities.filter(c => c.privacyType === 'public')
  }

  async getById(id: string): Promise<Community | null> {
    return mockCommunities.find(c => c.id === id) || null
  }
}
