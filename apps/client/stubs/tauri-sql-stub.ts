// Эмулируем экспорт класса Database, но с методами,
// которые либо ничего не делают, либо выбрасывают ошибку.
export default class Database {
  static async load(path: string) {
    console.warn(`[WEB-STUB] Database.load called for ${path}, but this is a web build. Returning a mock.`)
    return new Database()
  }

  async select(_query: string, _bindings?: unknown[]): Promise<any[]> {
    console.warn(`[WEB-STUB] DB.select called. Not available in web build.`)
    return Promise.resolve([])
  }

  async execute(_query: string, _bindings?: unknown[]): Promise<{ rowsAffected: number, lastInsertId: number }> {
    console.warn(`[WEB-STUB] DB.execute called. Not available in web build.`)
    return Promise.resolve({ rowsAffected: 0, lastInsertId: 0 })
  }
}
