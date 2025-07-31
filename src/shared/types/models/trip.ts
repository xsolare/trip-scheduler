export interface Trip {
  id: string
  title: string
  imageUrl?: string
  days: number
  startDate: string
  endDate: string
  cities: string[]

  /**
   * Краткое описание или заметка о путешествии.
   * @example 'Романтическое путешествие по Италии'
   */
  description?: string

  /**
   * Статус плана путешествия, чтобы понимать его текущее состояние.
   * @example 'planned', 'in-progress', 'completed', 'draft'
   */
  status?: 'draft' | 'planned' | 'in-progress' | 'completed'

  /**
   * Общий предполагаемый бюджет поездки.
   */
  budget?: number

  /**
   * Валюта бюджета.
   * @example 'RUB', 'USD', 'EUR'
   */
  currency?: string

  /**
   * Список участников путешествия.
   * @example ['Иван', 'Мария']
   */
  participants?: string[]

  /**
   * Теги для категоризации и быстрого поиска.
   * @example ['горы', 'море', 'гастротур']
   */
  tags?: string[]

  /**
   * Уровень приватности, если в будущем планируется делиться планами.
   */
  visibility?: 'private' | 'public' | 'shared'

  /**
   * Уровень сложности или насыщенности поездки.
   * Помогает понять, насколько активным и требовательным будет путешествие.
   * @example 'easy' // Расслабленный отдых, 'hard' // Насыщенный поход в горы
   */
  difficulty?: 'easy' | 'medium' | 'hard'

  /**
   * Рекомендуемый или фактический сезон для данного путешествия.
   * Полезно для фильтрации и планирования.
   */
  season?: 'spring' | 'summer' | 'autumn' | 'winter'

  /**
   * Дата и время создания записи о путешествии в формате ISO.
   * Устанавливается один раз при создании.
   * @example '2025-07-31T10:00:00.000Z'
   */
  createdAt?: string

  /**
   * Дата и время последнего обновления записи.
   * Обновляется при каждом изменении плана.
   * @example '2025-08-01T12:30:00.000Z'
   */
  updatedAt?: string
}
