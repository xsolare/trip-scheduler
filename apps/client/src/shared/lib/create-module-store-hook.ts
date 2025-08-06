/**
 * Фабрика для создания типизированного хука `useStore` для конкретного модуля.
 * Этот хук позволяет централизованно управлять сторами модуля.
 *
 * @param moduleStores - Объект, где ключи - это псевдонимы, а значения - функции-создатели сторов (use...Store).
 * @returns - Хук `useStore`, который можно использовать внутри компонентов модуля.
 */
export function createModuleStoreHook<T extends Record<string, () => any>>(
  moduleStores: T,
) {
  // Определяем перегрузки для нашего будущего хука, чтобы он был строго типизирован
  function useStore<K extends keyof T>(key: K): Readonly<ReturnType<T[K]>>
  function useStore<K extends keyof T>(keys: K[]): Readonly<{ [P in K]: ReturnType<T[P]> }>

  /**
   * Хук для доступа к сторам модуля.
   * @param keyOrKeys - Один ключ или массив ключей сторов для получения.
   */
  function useStore<K extends keyof T>(keyOrKeys: K | K[]) {
    // Если передан массив ключей, возвращаем объект со всеми запрошенными сторами
    if (Array.isArray(keyOrKeys)) {
      const stores = Object.fromEntries(
        keyOrKeys.map(key => [key, moduleStores[key]()]),
      ) as { [P in K]: ReturnType<T[P]> }
      return Object.freeze(stores) // Используем Object.freeze для имитации Readonly
    }

    // Если передан один ключ, возвращаем только один стор
    const store = moduleStores[keyOrKeys]()
    return Object.freeze(store) // Используем Object.freeze для имитации Readonly
  }

  return useStore
}
