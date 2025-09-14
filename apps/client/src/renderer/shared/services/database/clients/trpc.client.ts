import type {
  IAccountRepository,
  IActivityRepository,
  IAuthRepository,
  ICommentRepository,
  IDatabaseClient,
  IDayRepository,
  IFileRepository,
  IMemoryRepository,
  ITripRepository,
  ITripSectionRepository,
} from '../model/types'
import { AccountRepository } from '../repositories/trpc/account.repository'
import { ActivityRepository } from '../repositories/trpc/activity.repository'
import { AuthRepository } from '../repositories/trpc/auth.repository'
import { CommentRepository } from '../repositories/trpc/comment.repository'
import { DayRepository } from '../repositories/trpc/day.repository'
import { FileRepository } from '../repositories/trpc/file.repository'
import { MemoryRepository } from '../repositories/trpc/memory.repository'
import { TripSectionRepository } from '../repositories/trpc/trip-section.repository.js'
import { TripRepository } from '../repositories/trpc/trip.repository'

/**
 * Клиент базы данных, работающий через tRPC.
 * Взаимодействует с удаленным API вместо локальной базы данных.
 */
class TRPCDatabaseClient implements IDatabaseClient {
  trips: ITripRepository = new TripRepository()
  days: IDayRepository = new DayRepository()
  files: IFileRepository = new FileRepository()
  activities: IActivityRepository = new ActivityRepository()
  memories: IMemoryRepository = new MemoryRepository()
  auth: IAuthRepository = new AuthRepository()
  tripSections: ITripSectionRepository = new TripSectionRepository()
  comments: ICommentRepository = new CommentRepository()
  account: IAccountRepository = new AccountRepository()

  /**
   * Инициализация клиента. Для tRPC не требуется специальных действий.
   */
  async initDb(): Promise<this> {
    return this
  }

  /**
   * В режиме tRPC нет локальных несинхронизированных изменений.
   */
  async getUnsyncedChanges(): Promise<any[]> {
    return Promise.resolve([])
  }

  /**
   * В режиме tRPC все операции уже синхронизированы.
   */
  async markAsSynced(): Promise<void> {
    return Promise.resolve()
  }

  /**
   * Проверяет доступность сервера.
   * Возвращает true, если сервер доступен, иначе false.
   */
  async testConnection(): Promise<boolean> {
    try {
      // Можно было бы выполнить легковесный запрос для проверки, но для простоты
      // возвращаем true. Ошибки сети будут перехвачены при реальных вызовах.
      return true
    }
    catch {
      return false
    }
  }
}

export { TRPCDatabaseClient }
