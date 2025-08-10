export interface Memory {
  id: string
  tripId: string
  timestamp: string | null // ISO-8601, null if unsorted
  comment: string | null
  imageId: string | null
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

/**
 * Тип данных для создания нового воспоминания.
 * Используется в API-запросах.
 */
export interface CreateMemoryInput {
  tripId: string
  timestamp?: string | null
  comment?: string | null
  imageId?: string | null
}

/**
 * Тип данных для обновления существующего воспоминания.
 * Используется в API-запросах.
 */
export interface UpdateMemoryInput {
  id: string
  timestamp?: string | null
  comment?: string | null
}
