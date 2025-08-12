import { protectedProcedure } from '~/lib/trpc'
import { UpdateUserInputSchema, UserSchema } from './user.schemas'
import { userService } from './user.service'

export const userProcedures = {
  /**
   * Процедура для получения данных текущего аутентифицированного пользователя.
   */
  me: protectedProcedure
    .output(UserSchema)
    .query(async ({ ctx }) => {
      // ID пользователя берется из контекста, который создается в `isAuthed` middleware.
      // Это гарантирует, что пользователь может запросить только свои данные.
      const user = await userService.getById(ctx.user.id)

      return user
    }),

  /**
   * Процедура для обновления данных текущего пользователя.
   */
  update: protectedProcedure
    .input(UpdateUserInputSchema)
    .output(UserSchema)
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await userService.update(ctx.user.id, input)

      return updatedUser
    }),
}
