import type { IDatabaseClient, IDayRepository, ITripRepository } from '../model/types'
import type { Day } from '~/shared/types/models/activity'
import type { Trip } from '~/shared/types/models/trip'
import { trpc } from '~/shared/services/trpc/client'

class TRPCDatabaseClient implements IDatabaseClient {
  trips: ITripRepository = {
    getAll: async () => {
      return await trpc.trip.list.query()
    },
    getById: async (id: string) => {
      return await trpc.trip.byId.query(id)
    },
  }

  days: IDayRepository = {
    getByTripId: async (tripId: string) => {
      // Пока заглушка, позже реализуем соответствующие процедуры
      return []
    },
  }

  async initDb(): Promise<this> {
    return this
  }

  async getUnsyncedChanges(): Promise<any[]> {
    return Promise.resolve([])
  }

  async markAsSynced(): Promise<void> {
    return Promise.resolve()
  }

  async testConnection(): Promise<boolean> {
    try {
      await trpc.trip.list.query()
      return true
    }
    catch {
      return false
    }
  }
}

export { TRPCDatabaseClient }
