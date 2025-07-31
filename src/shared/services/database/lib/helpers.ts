import { getDb } from '../connection'

async function logOperation(tableName: string, recordId: string, operation: 'CREATE' | 'UPDATE' | 'DELETE'): Promise<void> {
  const db = await getDb()

  await db.execute(
    'INSERT INTO sync_log (table_name, record_id, operation) VALUES ($1, $2, $3)',
    [tableName, recordId, operation],
  )
}

export { logOperation }
