export type RequestStatus = 'idle' | 'pending' | 'success' | 'error'

export interface IRequestState {
  statuses: Map<string, RequestStatus>
  errors: Map<string, unknown | null>
}

export const useRequestStore = defineStore('request', {
  state: (): IRequestState => ({
    statuses: new Map(),
    errors: new Map(),
  }),
  actions: {
    setStatus(key: string, status: RequestStatus) {
      this.statuses.set(key, status)
    },
    setError(key: string, error: unknown | null) {
      if (error) {
        this.errors.set(key, error)
      }
      else {
        this.errors.delete(key)
      }
    },
    reset(key: string) {
      this.statuses.set(key, 'idle')
      this.errors.delete(key)
    },
  },
})
