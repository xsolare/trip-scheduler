import { protectedProcedure, publicProcedure } from '~/lib/trpc'
import {
  AuthOutputSchema,
  RefreshOutputSchema,
  RefreshTokenInputSchema,
  SignInInputSchema,
  SignUpInputSchema,
  UpdateUserInputSchema,
  UserSchema,
} from './user.schemas'
import { userService } from './user.service'

export const userProcedures = {
  /**
   * Процедура регистрации.
   */
  signUp: publicProcedure
    .input(SignUpInputSchema)
    .output(AuthOutputSchema)
    .mutation(async ({ input }) => {
      return userService.signUp(input)
    }),

  /**
   * Процедура входа в систему.
   */
  signIn: publicProcedure
    .input(SignInInputSchema)
    .output(AuthOutputSchema)
    .mutation(async ({ input }) => {
      return userService.signIn(input)
    }),

  /**
   * Процедура выхода из системы.
   */
  signOut: protectedProcedure
    .mutation(async ({ ctx }) => {
      return userService.signOut(ctx.user.id)
    }),

  /**
   * Процедура обновления токенов.
   */
  refresh: publicProcedure
    .input(RefreshTokenInputSchema)
    .output(RefreshOutputSchema)
    .mutation(async ({ input }) => {
      return userService.refresh(input.refreshToken)
    }),

  /**
   * Процедура для получения данных текущего пользователя.
   */
  me: protectedProcedure
    .output(UserSchema)
    .query(async ({ ctx }) => {
      return userService.getById(ctx.user.id)
    }),

  /**
   * Процедура для обновления данных текущего пользователя.
   */
  update: protectedProcedure
    .input(UpdateUserInputSchema)
    .output(UserSchema)
    .mutation(async ({ ctx, input }) => {
      return userService.update(ctx.user.id, input)
    }),
}
