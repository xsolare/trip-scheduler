import type { IAccountRepository } from '../../model/types'
import type { Plan } from '~/shared/types/models/trip'

// В Electron-версии данные о планах могут быть захардкожены или загружаться из конфига,
// так как они не меняются динамически.
const SQL_PLANS: Plan[] = [
  { id: 1, name: 'Базовый', maxTrips: 3, maxStorageBytes: 1 * 1024 * 1024 * 1024, isDeveloping: false },
  { id: 2, name: 'Про', maxTrips: 50, maxStorageBytes: 20 * 1024 * 1024 * 1024, isDeveloping: false },
  { id: 3, name: 'Командный', maxTrips: 999, maxStorageBytes: 100 * 1024 * 1024 * 1024, isDeveloping: true },
]

export class AccountRepository implements IAccountRepository {
  async listPlans(): Promise<Plan[]> {
    // В SQL-версии для Electron мы можем просто вернуть статический список.
    // Если бы планы хранились в SQLite, здесь был бы запрос.
    return Promise.resolve(SQL_PLANS)
  }
}
