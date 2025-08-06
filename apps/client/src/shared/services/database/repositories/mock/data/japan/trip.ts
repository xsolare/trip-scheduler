import { Trip } from "~/shared/types/models/trip"
import { tripJapanId } from "./constants"

export const MOCK_JAPAN_TRIP = {
  id: tripJapanId,
  title: 'Путешествие в Японию',
  imageUrl: '/images/mock.jpg',
  description: 'Весеннее путешествие в страну восходящего солнца во время цветения сакуры.',
  startDate: '2026-03-25',
  endDate: '2026-04-08',
  cities: ['Токио', 'Киото', 'Осака'],
  status: 'draft',
  budget: 3500,
  currency: 'USD',
  participants: ['Анна', 'Дмитрий'],
  tags: ['Япония', 'сакура', 'весна', 'культура'],
  visibility: 'private',
} as Omit<Trip, 'days'>
