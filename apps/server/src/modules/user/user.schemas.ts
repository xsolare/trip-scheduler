import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().nullable(),
  avatarUrl: z.string().url().nullable(),
  role: z.enum(['user', 'admin']),
  createdAt: z.date(),
})

export const UpdateUserInputSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать не менее 2 символов.').optional(),
  avatarUrl: z.string().url('Некорректный URL аватара.').optional(),
}).partial()
