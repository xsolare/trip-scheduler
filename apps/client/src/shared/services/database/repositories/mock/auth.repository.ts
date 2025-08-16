import type { IAuthRepository } from '../../model/types'
import type { SignInPayload, TokenPair, User } from '~/shared/types/models/auth'
import { throttle } from '../../lib/decorators'

// --- Моковые данные ---
const MOCK_USER: User = {
  id: 'mock-user-id-123',
  email: 'test@example.com',
  name: 'Mock User',
  avatarUrl: 'https://i.pravatar.cc/150',
  role: 'user',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  emailVerified: null,
  githubId: null,
  googleId: null,
}

const MOCK_TOKEN_PAIR: TokenPair = {
  accessToken: 'mock-access-token-string-jwt',
  refreshToken: 'mock-refresh-token-string-uuid',
}

/**
 * Мок-реализация репозитория аутентификации.
 * Имитирует задержку сети и возвращает заранее определенные данные.
 */
export class AuthRepository implements IAuthRepository {
  private isAuthenticated = false

  @throttle(1000)
  async signIn(payload: SignInPayload): Promise<{ user: User, token: TokenPair }> {
    if (payload.email === MOCK_USER.email && payload.password === 'password') {
      this.isAuthenticated = true
      return Promise.resolve({ user: MOCK_USER, token: MOCK_TOKEN_PAIR })
    }
    else {
      return Promise.reject(new Error('Неверные учетные данные'))
    }
  }

  @throttle(500)
  async signOut(): Promise<void> {
    this.isAuthenticated = false
    return Promise.resolve()
  }

  @throttle(800)
  async refresh(refreshToken: string): Promise<{ token: TokenPair }> {
    if (refreshToken === MOCK_TOKEN_PAIR.refreshToken) {
      const newTokens = {
        accessToken: `new-mock-access-token-${Date.now()}`,
        refreshToken: `new-mock-refresh-token-${Date.now()}`,
      }
      return Promise.resolve({ token: newTokens })
    }
    else {
      return Promise.reject(new Error('Невалидный токен обновления'))
    }
  }

  @throttle(500)
  async me(): Promise<User> {
    if (this.isAuthenticated) {
      return Promise.resolve(MOCK_USER)
    }
    else {
      return Promise.reject(new Error('Пользователь не аутентифицирован'))
    }
  }
}
