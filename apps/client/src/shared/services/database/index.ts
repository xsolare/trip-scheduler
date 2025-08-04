/* eslint-disable no-console */
/* eslint-disable import/no-mutable-exports */
import type { IDatabaseClient } from './model/types'

function getEnvVar(name: string): string {
  return import.meta.env ? import.meta.env[name] : ''
}

let databaseServicePromise: Promise<IDatabaseClient>

const isTauri = (window as any).__TAURI__ !== undefined

if (isTauri) {
  // --- ЛОГИКА ДЛЯ TAURI ---
  console.log('DB Service: Using RealDatabaseClient for Tauri build.')

  databaseServicePromise = import('./clients/real.client').then(
    ({ RealDatabaseClient }) => new RealDatabaseClient().initDb(),
  )
}
else {
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
}

export default databaseServicePromise
