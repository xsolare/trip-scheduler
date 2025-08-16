import type { z } from 'zod'
import type { SignUpInputSchema, UpdateUserInputSchema } from '~/modules/user/user.schemas'
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

type UserForClient = Omit<typeof users.$inferSelect, 'password'>

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
    // Это самый надежный способ найти пользователя, который уже входил через этот OAuth.
    let user = await db.query.users.findFirst({
      where: eq(providerColumn, providerId),
    })

    if (user) {
      // Пользователь найден. Возвращаем его данные, исключив пароль.
      return excludePassword(user)
    }

    // 2. Если не найден, ищем по email, чтобы связать аккаунты.
    // Это позволяет пользователю, который сначала зарегистрировался по паролю,
    // затем войти через Google/GitHub с тем же email.
    user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })

    if (user) {
      // Пользователь с таким email уже существует. Связываем аккаунты,
      // добавляя ID провайдера к его записи.
      const [updatedUser] = await db.update(users)
        .set({ [providerColumn.name]: providerId, updatedAt: new Date() })
        .where(eq(users.id, user.id))
        .returning()

      return excludePassword(updatedUser)
    }

    // 3. Если пользователь не найден ни по ID провайдера, ни по email — создаем нового.
    const [newUser] = await db.insert(users)
      .values({
        email,
        name,
        avatarUrl: avatarUrl || undefined,
        emailVerified: new Date(), // Email от OAuth-провайдера считаем подтвержденным
        [providerColumn.name]: providerId,
      })
      .returning()

    return excludePassword(newUser)
  },

  /**
   * Находит пользователя по его ID.
   */
  async getById(id: string): Promise<UserForClient | null> {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    })

    return user ? excludePassword(user) : null
  },

  /**
   * Обновляет данные пользователя.
   */
  async update(id: string, data: z.infer<typeof UpdateUserInputSchema>): Promise<UserForClient> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning()

    return excludePassword(updatedUser)
  },
}
