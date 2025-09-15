import type { z } from 'zod'
import type { SignUpInputSchema, UpdateUserInputSchema } from '~/modules/user/user.schemas'
import { eq, sql } from 'drizzle-orm'
import { db } from '~/../db'
import { communityMembers, users } from '~/../db/schema'
import { authUtils } from '~/lib/auth.utils'
import { FREE_PLAN_ID } from '~/lib/constants'
import { createTRPCError } from '~/lib/trpc'

interface OAuthInput {
  provider: 'google' | 'github'
  providerId: string
  email: string | null
  name: string
  avatarUrl?: string
}

type UserForClient = Omit<typeof users.$inferSelect, 'password'> & { plan?: any, _count?: { communities: number } }

function excludePassword<T extends { password?: string | null }>(user: T): Omit<T, 'password'> {
  const { password, ...rest } = user
  return rest
}

export const userRepository = {
  /**
   * Находит пользователя по email. Возвращает полный объект, включая пароль,
   * для внутренних проверок.
   */
  async findByEmail(email: string) {
    return await db.query.users.findFirst({
      where: eq(users.email, email),
      with: { // ИЗМЕНЕНИЕ: Также добавляем план здесь
        plan: true,
      },
    })
  },

  /**
   * Создает нового пользователя через регистрацию по email/паролю.
   */
  async create(data: z.infer<typeof SignUpInputSchema> & { password?: string }): Promise<UserForClient> {
    const [newUser] = await db
      .insert(users)
      .values({
        name: data.name,
        email: data.email,
        password: data.password,
        planId: FREE_PLAN_ID, // Назначаем бесплатный план по умолчанию
      })
      .returning()

    return excludePassword(newUser)
  },

  /**
   * Находит существующего пользователя по данным от OAuth-провайдера или создает нового.
   * Связывает OAuth-профиль с существующим аккаунтом по email, если он найден.
   * Всегда возвращает объект пользователя без поля 'password'.
   */
  async findOrCreateFromOAuth({ provider, providerId, email, name, avatarUrl }: OAuthInput): Promise<UserForClient> {
    if (!email) {
      throw new Error('Для создания учетной записи требуется email от провайдера.')
    }

    const providerColumn = provider === 'google' ? users.googleId : users.githubId

    // 1. Попытка найти пользователя по ID провайдера.
    const userWithProviderId = await db.query.users.findFirst({
      where: eq(providerColumn, providerId),
      with: { plan: true },
    })

    if (userWithProviderId) {
      return excludePassword(userWithProviderId)
    }

    // 2. Если не найден, ищем по email, чтобы связать аккаунты.
    const userWithEmail = await db.query.users.findFirst({
      where: eq(users.email, email),
      with: { plan: true },
    })

    if (userWithEmail) {
      // Связываем аккаунты и возвращаем обновленного пользователя
      const [updatedUser] = await db.update(users)
        .set({ [providerColumn.name]: providerId, updatedAt: new Date() })
        .where(eq(users.id, userWithEmail.id))
        .returning()

      return { ...excludePassword(updatedUser), plan: userWithEmail.plan }
    }

    // 3. Если пользователь не найден, создаем нового.
    const [newUser] = await db.insert(users)
      .values({
        email,
        name,
        avatarUrl: avatarUrl || undefined,
        emailVerified: new Date(),
        [providerColumn.name]: providerId,
        planId: FREE_PLAN_ID,
      })
      .returning()

    // Возвращаем нового пользователя с планом
    return await this.getById(newUser.id) as UserForClient
  },

  /**
   * Находит пользователя по его ID вместе с тарифным планом.
   */
  async getById(id: string): Promise<UserForClient | null> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
      with: {
        plan: true,
      },
    })

    if (!user)
      return null

    const [communityCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(communityMembers)
      .where(eq(communityMembers.userId, id))

    return {
      ...excludePassword(user),
      _count: {
        communities: Number(communityCount.count),
      },
    }
  },

  /**
   * Обновляет данные пользователя.
   */
  async update(id: string, data: z.infer<typeof UpdateUserInputSchema>): Promise<UserForClient> {
    await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))

    return await this.getById(id) as UserForClient
  },

  /**
   * Обновляет статус пользователя.
   */
  async updateStatus(id: string, data: { statusText?: string | null, statusEmoji?: string | null }) {
    const [updatedUser] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning()

    if (!updatedUser)
      return null

    return await this.getById(updatedUser.id)
  },

  /**
   * Изменяет пароль пользователя после проверки текущего.
   */
  async changePassword(id: string, currentPassword: string, newPasswordHash: string) {
    const user = await db.query.users.findFirst({ where: eq(users.id, id) })
    if (!user || !user.password) {
      throw createTRPCError('UNAUTHORIZED', 'Неверный текущий пароль.')
    }
    const isPasswordValid = await authUtils.passwords.verify(currentPassword, user.password)
    if (!isPasswordValid) {
      throw createTRPCError('UNAUTHORIZED', 'Неверный текущий пароль.')
    }
    await db.update(users).set({ password: newPasswordHash }).where(eq(users.id, id))
    return true
  },

  /**
   * Удаляет пользователя после проверки пароля.
   */
  async delete(id: string, password: string) {
    const user = await db.query.users.findFirst({ where: eq(users.id, id) })
    if (!user || !user.password) {
      throw createTRPCError('UNAUTHORIZED', 'Неверный пароль.')
    }
    const isPasswordValid = await authUtils.passwords.verify(password, user.password)
    if (!isPasswordValid) {
      throw createTRPCError('UNAUTHORIZED', 'Неверный пароль.')
    }
    await db.delete(users).where(eq(users.id, id))
    return true
  },
}
