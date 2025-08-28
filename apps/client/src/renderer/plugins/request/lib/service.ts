import type { DatabaseService } from '../models'
import { ref } from 'vue'

const databaseServiceInstance = ref<DatabaseService | null>(null)

export function setDatabaseService(service: DatabaseService) {
  databaseServiceInstance.value = service
}

export function getDatabaseService(): DatabaseService {
  const service = databaseServiceInstance.value
  if (!service) {
    throw new Error(
      'Database service has not been initialized. Did you install the request plugin with app.use(requestPlugin)?',
    )
  }
  return service
}
