import { db } from 'db'
import { users } from 'db/schema'
import { eq, sql } from 'drizzle-orm'
import { createTRPCError } from '~/lib/trpc'
import { userRepository } from '~/repositories/user.repository'

export const quotaService = {
  /**
   * Проверяет, может ли пользователь создать новое путешествие.
   * @param userId - ID пользователя.
   */
  async checkTripCreationQuota(userId: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: { plan: true },
    })

    if (!user || !user.plan) {
      throw createTRPCError('INTERNAL_SERVER_ERROR', 'Не удалось получить информацию о тарифном плане пользователя.')
    }

    if (user.currentTripsCount >= user.plan.maxTrips) {
      throw createTRPCError('FORBIDDEN', `Вы достигли лимита в ${user.plan.maxTrips} путешествий на тарифе "${user.plan.name}".`)
    }
  },

  /**
   * Проверяет, достаточно ли у пользователя места для загрузки нового файла.
   * @param userId - ID пользователя.
   * @param fileSizeInBytes - Размер нового файла в байтах.
   */
  async checkStorageQuota(userId: string, fileSizeInBytes: number) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: { plan: true },
    })

    if (!user || !user.plan) {
      throw createTRPCError('INTERNAL_SERVER_ERROR', 'Не удалось получить информацию о тарифном плане пользователя.')
    }

    if (user.currentStorageBytes + fileSizeInBytes > user.plan.maxStorageBytes) {
      const remainingMb = Math.round((user.plan.maxStorageBytes - user.currentStorageBytes) / 1024 / 1024)
      throw createTRPCError('FORBIDDEN', `Недостаточно места. У вас осталось ${remainingMb > 0 ? remainingMb : 0} МБ.`)
    }
  },

  /**
   * Атомарно увеличивает счетчик созданных путешествий для пользователя.
   * @param userId - ID пользователя.
   */
  async incrementTripCount(userId: string) {
    await db.update(users)
      .set({ currentTripsCount: sql`${users.currentTripsCount} + 1` })
      .where(eq(users.id, userId))
  },

  /**
   * Атомарно уменьшает счетчик созданных путешествий для пользователя.
   * @param userId - ID пользователя.
   */
  async decrementTripCount(userId: string) {
    await db.update(users)
      .set({ currentTripsCount: sql`GREATEST(0, ${users.currentTripsCount} - 1)` })
      .where(eq(users.id, userId))
  },

  /**
   * Атомарно увеличивает счетчик использованного места.
   * @param userId - ID пользователя.
   * @param fileSizeInBytes - Размер добавленного файла в байтах.
   */
  async incrementStorageUsage(userId: string, fileSizeInBytes: number) {
    await db.update(users)
      .set({ currentStorageBytes: sql`${users.currentStorageBytes} + ${fileSizeInBytes}` })
      .where(eq(users.id, userId))
  },

  /**
   * Атомарно уменьшает счетчик использованного места.
   * @param userId - ID пользователя.
   * @param fileSizeInBytes - Размер удаленного файла в байтах.
   */
  async decrementStorageUsage(userId: string, fileSizeInBytes: number) {
    await db.update(users)
      .set({ currentStorageBytes: sql`GREATEST(0, ${users.currentStorageBytes} - ${fileSizeInBytes})` })
      .where(eq(users.id, userId))
  },

  /**
   * Получает текущее использование и лимиты пользователя.
   */
  async getUserUsage(userId: string) {
    const user = await userRepository.getByIdWithPlan(userId)
    if (!user || !user.plan) {
      throw createTRPCError('NOT_FOUND', 'Пользователь или его тарифный план не найдены.')
    }
    return user
  },
}
