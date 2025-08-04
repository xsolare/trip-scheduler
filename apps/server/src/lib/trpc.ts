import { initTRPC, TRPCError } from '@trpc/server'

const t = initTRPC
  .context<object>()
  .create({
    errorFormatter({ shape, error }) {
      return {
        ...shape,
        data: {
          ...shape.data,
          code: error.code,
          httpStatus: shape.data.httpStatus,
        },
      }
    },
  })

// Переиспользуемый middleware для валидации
export const middleware = t.middleware
export const router = t.router
export const mergeRouters = t.mergeRouters
export const publicProcedure = t.procedure

// Вспомогательная функция для создания tRPC ошибок
export function createTRPCError(code: 'NOT_FOUND' | 'BAD_REQUEST' | 'INTERNAL_SERVER_ERROR', message: string) {
  throw new TRPCError({
    code,
    message,
  })
}

export { t }
