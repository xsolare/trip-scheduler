import type { z } from 'zod'
import type { UpdateUserInputSchema } from './user.schemas'
import { createTRPCError } from '~/lib/trpc'
import { userRepository } from '~/repositories/user.repository'

export const userService = {
  /**
   * Получает информацию о пользователе по его ID.
   * Важно: этот метод удаляет поле `password` из объекта перед возвратом.
   * @param id - UUID пользователя.
   * @returns Безопасный объект пользователя без пароля.
   */
  async getById(id: string) {
    const user = await userRepository.getById(id)
    if (!user) {
      throw createTRPCError('NOT_FOUND', `Пользователь с ID ${id} не найден.`)
    }

    const { password, ...safeUser } = user

    return safeUser
  },

  /**
   * Обновляет информацию о пользователе (например, имя или аватар).
   * @param id - UUID пользователя, чьи данные обновляются.
   * @param data - Объект с полями для обновления.
   * @returns Обновленный безопасный объект пользователя.
   */
  async update(id: string, data: z.infer<typeof UpdateUserInputSchema>) {
    if (Object.keys(data).length === 0) {
      throw createTRPCError('BAD_REQUEST', 'Не предоставлено полей для обновления.')
    }

    const updatedUser = await userRepository.update(id, data)

    if (!updatedUser) {
      throw createTRPCError('NOT_FOUND', `Не удалось обновить пользователя с ID ${id}.`)
    }

    const { password, ...safeUser } = updatedUser

    return safeUser
  },
}
