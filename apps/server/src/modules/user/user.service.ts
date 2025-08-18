import type { z } from 'zod'
import type { SignInInputSchema, SignUpInputSchema, UpdateUserInputSchema } from './user.schemas'
import { authUtils } from '~/lib/auth.utils'
import { createTRPCError } from '~/lib/trpc'
import { userRepository } from '~/repositories/user.repository'

export const userService = {
  /**
   * Регистрирует нового пользователя.
   */
  async signUp(input: z.infer<typeof SignUpInputSchema>) {
    const existingUser = await userRepository.findByEmail(input.email)
    if (existingUser) {
      throw createTRPCError('CONFLICT', `Пользователь с таким email уже существует.`)
    }

    const hashedPassword = await authUtils.passwords.hash(input.password)
    const user = await userRepository.create({ ...input, password: hashedPassword })

    // После регистрации сразу генерируем токены для автоматического входа
    const token = await authUtils.generateTokens({ id: user.id, email: user.email })

    return { user, token }
  },

  /**
   * Аутентифицирует пользователя по email и паролю.
   */
  async signIn(input: z.infer<typeof SignInInputSchema>) {
    const user = await userRepository.findByEmail(input.email)

    if (!user || !user?.password) {
      throw createTRPCError('UNAUTHORIZED', 'Неверный email или пароль.')
    }

    const isPasswordValid = await authUtils.passwords.verify(input.password, user.password)
    if (!isPasswordValid) {
      throw createTRPCError('UNAUTHORIZED', 'Неверный email или пароль.')
    }

    const { password, ...userWithoutPassword } = user
    const token = await authUtils.generateTokens({ id: user.id, email: user.email })

    return { user: userWithoutPassword, token }
  },

  /**
   * Аннулирует все токены пользователя.
   */
  async signOut(userId: string) {
    await authUtils.invalidateTokens(userId)

    return { ok: true }
  },

  /**
   * Обновляет пару токенов, используя refresh-токен.
   */
  async refresh(refreshToken: string) {
    try {
      const token = await authUtils.refreshTokens(refreshToken)
      return { token }
    }
    catch {
      throw createTRPCError('UNAUTHORIZED', 'Невалидный или истекший токен обновления.')
    }
  },

  /**
   * Получает информацию о пользователе по его ID.
   */
  async getById(id: string) {
    const user = await userRepository.getById(id)
    if (!user) {
      throw createTRPCError('NOT_FOUND', `Пользователь не найден.`)
    }

    return user
  },

  /**
   * Обновляет информацию о пользователе.
   */
  async update(id: string, data: z.infer<typeof UpdateUserInputSchema>) {
    if (Object.keys(data).length === 0) {
      throw createTRPCError('BAD_REQUEST', 'Не предоставлено полей для обновления.')
    }
    const updatedUser = await userRepository.update(id, data)

    if (!updatedUser) {
      throw createTRPCError('INTERNAL_SERVER_ERROR', `Не удалось обновить пользователя.`)
    }

    return updatedUser
  },
}
