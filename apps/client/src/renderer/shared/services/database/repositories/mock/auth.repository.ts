import type { IAuthRepository } from '../../model/types'
import type { SignInPayload, SignUpPayload, TokenPair, User } from '~/shared/types/models/auth'
import { throttle } from '../../lib/decorators'

// --- Моковые данные ---
const MOCK_USER = {
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
  statusEmoji: '🌴',
  statusText: 'В отпуске',
  currentStorageBytes: 0,
  currentTripsCount: 0,
} as User

const MOCK_TOKEN_PAIR: TokenPair = {
  accessToken: 'mock-access-token-string-jwt',
  refreshToken: 'mock-refresh-token-string-uuid',
}

let verificationPendingFor: SignUpPayload | null = null

/**
 * Мок-реализация репозитория аутентификации.
 * Имитирует задержку сети и возвращает заранее определенные данные.
 */
export class AuthRepository implements IAuthRepository {
  private isAuthenticated = false

  @throttle(1000)
  async signUp(payload: SignUpPayload): Promise<{ success: boolean, message: string }> {
    if (payload.email === MOCK_USER.email) {
      return Promise.reject(new Error('Пользователь с таким email уже существует.'))
    }
    verificationPendingFor = payload
    // eslint-disable-next-line no-console
    console.log('[Mock] Verification code for', payload.email, 'is 123456')
    return Promise.resolve({ success: true, message: 'Код подтверждения отправлен на вашу почту.' })
  }

  @throttle(1000)
  async verifyEmail(payload: { email: string, token: string }): Promise<{ user: User, token: TokenPair }> {
    if (verificationPendingFor && verificationPendingFor.email === payload.email && payload.token === '123456') {
      this.isAuthenticated = true
      const newUser = { ...MOCK_USER, email: payload.email, name: verificationPendingFor.name, emailVerified: new Date().toISOString() } as User
      verificationPendingFor = null
      return Promise.resolve({ user: newUser, token: MOCK_TOKEN_PAIR })
    }
    return Promise.reject(new Error('Неверный код подтверждения'))
  }

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

  @throttle(500)
  async updateStatus(data: { statusText?: string | null, statusEmoji?: string | null }): Promise<User> {
    if (this.isAuthenticated) {
      Object.assign(MOCK_USER, data)
      return Promise.resolve(MOCK_USER as User)
    }
    return Promise.reject(new Error('Пользователь не аутентифицирован'))
  }

  @throttle(500)
  async updateUser(data: { name?: string, avatarUrl?: string }): Promise<User> {
    if (this.isAuthenticated) {
      Object.assign(MOCK_USER, data)
      return Promise.resolve(MOCK_USER as User)
    }
    return Promise.reject(new Error('Пользователь не аутентифицирован'))
  }

  @throttle(1000)
  async uploadAvatar(file: File): Promise<User> {
    if (!this.isAuthenticated) {
      return Promise.reject(new Error('Пользователь не аутентифицирован'))
    }
    // eslint-disable-next-line no-console
    console.log(`[Mock] Uploading avatar: ${file.name}`)
    // Имитируем создание URL для нового аватара
    const newAvatarUrl = URL.createObjectURL(file)
    MOCK_USER.avatarUrl = newAvatarUrl
    return Promise.resolve(MOCK_USER as User)
  }
}
