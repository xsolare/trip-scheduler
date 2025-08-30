/* eslint-disable no-console */
/* eslint-disable import/no-mutable-exports */
import type { IDatabaseClient } from './model/types'

function getEnvVar(name: string): string {
  return import.meta.env ? import.meta.env[name] : ''
}

let databaseServicePromise: Promise<IDatabaseClient>

const isStandalone = !!(window as any)?.electronAPI

// --- ЛОGIКА ДЛЯ STANDALONE ---
if (isStandalone) {
  console.log('DB Service: Using SqlDatabaseClient for Electron build.')

  databaseServicePromise = import('./clients/sql.client').then(
    ({ SqlDatabaseClient }) => new SqlDatabaseClient().initDb(),
  )
}

// --- ЛОGIКА ДЛЯ WEB ---
const isMockMode = getEnvVar('VITE_APP_MOCK_MODE') === 'true'

if (isMockMode) {
  console.log('DB Service: Web build is using MOCK client.')
  databaseServicePromise = import('./clients/mock.client').then(
    ({ MockDatabaseClient }) => new MockDatabaseClient().initDb(),
  )
}
else {
  console.log('DB Service: Web build is using TRPC client.')
  databaseServicePromise = import('./clients/trpc.client').then(
    ({ TRPCDatabaseClient }) => new TRPCDatabaseClient().initDb(),
  )
}

export default databaseServicePromise
