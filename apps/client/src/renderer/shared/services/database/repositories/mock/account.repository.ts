import type { IAccountRepository } from '../../model/types'
import type { Plan } from '~/shared/types/models/trip'

const ONE_GIGABYTE_IN_BYTES = 1024 * 1024 * 1024

// Mock-данные, соответствующие db/seed.ts
const MOCK_PLANS: Plan[] = [
  {
    id: 1,
    name: 'Базовый',
    maxTrips: 3,
    maxStorageBytes: ONE_GIGABYTE_IN_BYTES,
    isDeveloping: false,
    monthlyLlmCredits: 0,

  },
  {
    id: 2,
    name: 'Про',
    maxTrips: 50,
    maxStorageBytes: 20 * ONE_GIGABYTE_IN_BYTES,
    isDeveloping: false,
    monthlyLlmCredits: 0,

  },
  {
    id: 3,
    name: 'Командный',
    maxTrips: 999,
    maxStorageBytes: 100 * ONE_GIGABYTE_IN_BYTES,
    isDeveloping: true,
    monthlyLlmCredits: 0,

  },
]

export class AccountRepository implements IAccountRepository {
  async listPlans(): Promise<Plan[]> {
    return Promise.resolve(MOCK_PLANS)
  }
}
