/* eslint-disable no-console */
/* eslint-disable import/no-mutable-exports */
import type { IDatabaseClient } from './model/types'

function getEnvVar(name: string): string {
  return import.meta.env ? import.meta.env[name] : ''
}

let databaseServicePromise: Promise<IDatabaseClient>

const isApiMode = getEnvVar('VITE_APP_API_MODE')

switch (isApiMode) {
  case 'mock':
    console.log('DB Service: Web build is using MOCK client.')
    databaseServicePromise = import('./clients/mock.client').then(
      ({ MockDatabaseClient }) => new MockDatabaseClient().initDb(),
    )
    break

  case 'sql':
    console.log('DB Service: Using SqlDatabaseClient for Electron build.')

    databaseServicePromise = import('./clients/sql.client').then(
      ({ SqlDatabaseClient }) => new SqlDatabaseClient().initDb(),
    )
    break

  case 'trpc':
  default:
    console.log('DB Service: Web build is using TRPC client.')
    databaseServicePromise = import('./clients/trpc.client').then(
      ({ TRPCDatabaseClient }) => new TRPCDatabaseClient().initDb(),
    )
    break
}

export default databaseServicePromise
