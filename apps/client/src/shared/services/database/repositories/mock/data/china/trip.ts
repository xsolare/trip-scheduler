import type { Trip } from '~/shared/types/models/trip'
import { TripStatus, TripVisibility } from '~/shared/types/models/trip'
import { tripChinaId } from './constants'

export const MOCK_CHINA_TRIP = {
  id: tripChinaId,
  title: 'Путешествие по Китаю',
  imageUrl: `/images/${tripChinaId}/tianchi2.jpg`,
  description: 'Двухнедельное приключение, охватывающее футуристический Шанхай, классические сады Сучжоу и Ханчжоу, и заканчивающееся в сердце древнего Шелкового пути — Урумчи.',
  startDate: '2025-08-10',
  endDate: '2025-08-23',
  cities: ['Шанхай', 'Сучжоу', 'Ханчжоу', 'Урумчи'],
  status: TripStatus.PLANNED,
  budget: 2000,
  currency: 'USD',
  participants: ['Евгений'],
  tags: ['Китай', 'Шанхай', 'Урумчи', 'культура', 'еда', 'приключения'],
  visibility: TripVisibility.PRIVATE,
} as Omit<Trip, 'days'>
