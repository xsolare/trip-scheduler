import type { IAuthState, SignInPayload, TokenPair, User } from '../types/models/auth'
import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { useRequest, useRequestStatus } from '~/plugins/request'

const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'auth_refresh_token'

export enum EAuthRequestKeys {
  ME = 'auth:me',
  REFRESH = 'auth:refresh',
  SIGN_IN = 'auth:sign-in',
  SIGN_OUT = 'auth:sign-out',
}

// --- Хранилище ---

export const useAuthStore = defineStore('auth', {
  state: (): IAuthState => {
    const accessToken = useStorage<string | null>(TOKEN_KEY, null)
    const refreshToken = useStorage<string | null>(REFRESH_TOKEN_KEY, null)

    return {
      user: null,
      tokenPair:
        accessToken.value && refreshToken.value
          ? { accessToken: accessToken.value, refreshToken: refreshToken.value }
          : null,
    }
  },

  getters: {
    isLoading: () => useRequestStatus(Object.values(EAuthRequestKeys)).value,
    isAuthenticated: state => !!state.user,
  },

  actions: {
    /**
     * Получает информацию о текущем пользователе с сервера через tRPC.
     */
    async me() {
      return useRequest<User>({
        key: EAuthRequestKeys.ME,
        fn: db => db.auth.me(),
        onSuccess: (data) => {
          this.user = data
        },
        onError: (error) => {
          this.clearAuth()
          throw error
        },
      })
    },

    /**
     * Обновляет токен доступа, используя токен обновления из состояния.
     */
    async refresh() {
      const refreshToken = this.tokenPair?.refreshToken
      if (!refreshToken) {
        return Promise.reject(new Error('Refresh token is not available.'))
      }

      return useRequest({
        key: EAuthRequestKeys.REFRESH,
        fn: db => db.auth.refresh(refreshToken),
        onSuccess: (data) => {
          this.saveTokens(data.token)
        },
        onError: (error) => {
          this.clearAuth()
          throw error
        },
      })
    },

    /**
     * Авторизует пользователя по email и паролю через tRPC.
     */
    async signIn(payload: SignInPayload) {
      return useRequest({
        key: EAuthRequestKeys.SIGN_IN,
        fn: db => db.auth.signIn(payload),
        onSuccess: (data) => {
          this.user = data.user
          this.saveTokens(data.token)
        },
        onError: (error) => {
          this.clearAuth()
          throw error
        },
      })
    },

    /**
     * Выход пользователя из системы через tRPC.
     */
    async signOut() {
      return useRequest<void>({
        key: EAuthRequestKeys.SIGN_OUT,
        fn: db => db.auth.signOut(),
        onSuccess: () => {
          this.clearAuth()
        },
        onError: (error) => {
          this.clearAuth()
          throw error
        },
      })
    },

    /**
     * Сохраняет пару токенов в состояние и в localStorage.
     */
    saveTokens(tokens: TokenPair) {
      this.tokenPair = tokens
      useStorage(TOKEN_KEY, '').value = tokens.accessToken
      useStorage(REFRESH_TOKEN_KEY, '').value = tokens.refreshToken
    },

    /**
     * Очищает токены из состояния и из localStorage.
     */
    clearTokens() {
      this.tokenPair = null
      useStorage(TOKEN_KEY, null).value = null
      useStorage(REFRESH_TOKEN_KEY, null).value = null
    },

    /**
     * Полностью очищает данные аутентификации.
     */
    clearAuth() {
      this.user = null
      this.clearTokens()
    },
  },
})
