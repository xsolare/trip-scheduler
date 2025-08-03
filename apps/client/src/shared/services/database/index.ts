import { RealDatabaseClient } from './clients/real.client'
import { TRPCDatabaseClient } from './clients/trpc.client'

function getEnvVar(name: string): string {
  // @ts-expect-error nvm
  return import.meta.env ? import.meta.env[name] : ''
}

const isMockMode = getEnvVar('VITE_APP_MOCK_MODE') === 'true'
const isTRPCMode = getEnvVar('VITE_APP_TRPC_MODE') === 'true'

// eslint-disable-next-line import/no-mutable-exports
let databaseServicePromise: Promise<any>

if (isMockMode) {
  // eslint-disable-next-line antfu/no-top-level-await
  const { MockDatabaseClient } = await import('./clients/mock.client')
  databaseServicePromise = new MockDatabaseClient().initDb()
}
else if (isTRPCMode) {
  databaseServicePromise = new TRPCDatabaseClient().initDb()
}
else {
  databaseServicePromise = new RealDatabaseClient().initDb()
}

export default databaseServicePromise
