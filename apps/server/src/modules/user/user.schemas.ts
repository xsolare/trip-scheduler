import { createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { users } from '~/../db/schema'

// --- Входящие данные (Input) ---

export const SignUpInputSchema = z.object({
  name: z.string().min(1, 'Имя не может быть пустым'),
  email: z.string().email('Некорректный формат email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
})

export const SignInInputSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const RefreshTokenInputSchema = z.object({
  refreshToken: z.string(),
})

export const UpdateUserInputSchema = z.object({
  name: z.string().min(1).optional(),
  avatarUrl: z.string().url().optional(),
}).strict()

// --- Исходящие данные (Output) ---

// Безопасная схема пользователя (без пароля) для отправки на клиент
export const UserSchema = createSelectSchema(users).omit({ password: true })

// Схема для пары токенов
export const TokenPairSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})

// Схема для ответа при успешном входе или обновлении токена
export const AuthOutputSchema = z.object({
  user: UserSchema,
  token: TokenPairSchema,
})

// Схема для ответа при обновлении токена
export const RefreshOutputSchema = z.object({
  token: TokenPairSchema,
})
