import type { z } from 'zod'
import type { UpdateUserInputSchema } from '~/modules/user/user.schemas'
import { eq } from 'drizzle-orm'
import { db } from '~/../db'
import { users } from '~/../db/schema'

interface OAuthInput {
  provider: 'google' | 'github'
  providerId: string
  email: string | null
  name: string
  avatarUrl?: string
}

export const userRepository = {
  async findOrCreateFromOAuth({ provider, providerId, email, name, avatarUrl }: OAuthInput) {
    if (!email) {
      throw new Error('Для создания учетной записи требуется email.')
    }

    const providerColumn = provider === 'google' ? users.googleId : users.githubId

    // 1. Попытка найти пользователя по ID провайдера
    let user = await db.query.users.findFirst({
      where: eq(providerColumn, providerId),
    })

    if (user) {
      return user
    }

    // 2. Попытка найти пользователя по email для связывания аккаунтов
    user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (user) {
      // 3. Связывание аккаунта путем обновления ID провайдера
      const [updatedUser] = await db.update(users)
        .set({ [providerColumn.name]: providerId })
        .where(eq(users.id, user.id))
        .returning()
      return updatedUser
    }

    // 4. Создание нового пользователя
    const [newUser] = await db.insert(users)
      .values({
        email,
        name,
        avatarUrl,
        emailVerified: new Date(), // Email от OAuth-провайдера считается подтвержденным
        [providerColumn.name]: providerId,
      })
      .returning()

    return newUser
  },

  /**
   * Находит пользователя по его ID.
   * @param id - UUID пользователя.
   * @returns Объект пользователя или null, если не найден.
   */
  async getById(id: string) {
    return await db.query.users.findFirst({
      where: eq(users.id, id),
    })
  },

  /**
   * Обновляет данные пользователя.
   * @param id - UUID пользователя для обновления.
   * @param data - Данные для обновления (имя, URL аватара).
   * @returns Обновленный объект пользователя.
   */
  async update(id: string, data: z.infer<typeof UpdateUserInputSchema>) {
    const [updatedUser] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning()
    return updatedUser
  },
}
