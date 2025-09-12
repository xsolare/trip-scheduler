import { MOCK_USER_ID_1 } from './00.user'

// =================================================================
// ==================== Путешествие 1: Чанша, Чжанцзяцзе, Чунцин =========
// =================================================================
const TRIP_ID = 'c0417422-b266-4242-91e8-f9a7d852a9fd'
const DAY_IDS = Array.from({ length: 15 }, () => crypto.randomUUID())

const getRoutePath = (filename: string) => `trips/${TRIP_ID}/route/${filename}`

const imageFilenames = [
  '20250825154758.png',
  '20250825155522.png',
  '20250824231248.png',
  // ... (здесь должны быть все остальные файлы изображений из вашего проекта)
]

const imageObjects = [...new Set(imageFilenames)].map(filename => ({
  id: crypto.randomUUID(),
  tripId: TRIP_ID,
  url: getRoutePath(filename),
  placement: 'route' as const,
}))

export const MOCK_DATA = [
  // =================================================================
  // ========== Путешествие: Горы Аватара и 8D-магия Чунцина ===========
  // =================================================================
  {
    id: TRIP_ID,
    title: 'Горы Аватара и 8D-магия Чунцина',
    userId: MOCK_USER_ID_1,
    imageUrl: getRoutePath('20250824231248.png'),
    description: 'Незабываемое путешествие по Китаю: от культурных сокровищ Чанши до неземных пейзажей Чжанцзяцзе, вдохновивших "Аватар". Погружение в сказочную атмосферу древнего города Фэнхуан и исследование футуристической 8D-реальности Чунцина.',
    startDate: new Date('2025-10-19'),
    endDate: new Date('2025-11-02'),
    cities: ['Чанша', 'Чжанцзяцзе', 'Фэнхуан', 'Чунцин'],
    status: 'planned' as const,
    budget: 250000,
    currency: 'RUB',
    tags: ['Китай', 'Чжанцзяцзе', 'Чунцин', 'Горы Аватара', 'природа', 'хайкинг', 'мегаполис', 'культура', 'история'],
    visibility: 'public' as const,
    participantIds: [MOCK_USER_ID_1],
    images: imageObjects,
    sections: [
      // Отели
      {
        id: crypto.randomUUID(),
        tripId: TRIP_ID,
        type: 'bookings' as const,
        title: 'Бронирования',
        icon: 'mdi:ticket-confirmation-outline',
        content: {
          bookings: [
            // 1. Бронирование в Чанше
            {
              id: 'b8c1b2a9-7c1c-4b5c-9c1c-1a2b3c4d5e6f',
              type: 'hotel',
              icon: 'mdi:hotel',
              title: 'FUNGEE S Hotel, Changsha',
              data: {
                hotelName: 'FUNGEE S Hotel, Wuyi Square, Huangxing Square Station, Changsha',
                address: 'No.265 Renmin West Road, Furong District, Changsha, Hunan, China',
                checkInDate: '2025-10-19',
                checkOutDate: '2025-10-22',
                phone: '+86-731-82233088-8888',
              },
            },
            // 2. Бронирование в Чжанцзяцзе
            {
              id: 'f2a3b4c5-d6e7-4f8a-9b0c-1d2e3f4a5b6c',
              type: 'hotel',
              icon: 'mdi:hotel',
              title: 'Vienna 3 Best Hotel, Zhangjiajie',
              data: {
                hotelName: 'Vienna 3 Best Hotel (Zhangjiajie Tianmenshan Cableway Station)',
                address: 'Yongding District, Zhangjiajie, Hunan, China',
                checkInDate: '2025-10-22',
                checkOutDate: '2025-10-26',
                phone: '+86-17774431215, +86-744-8296888',
              },
            },
            // 3. Бронирование в Фэнхуане
            {
              id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
              type: 'hotel',
              icon: 'mdi:hotel',
              title: 'Fenghuang Jinshuian River View Hotel',
              data: {
                hotelName: 'Fenghuang Jinshuian River View Hotel',
                address: 'No.59-2 Jinjiayuan Road, Fenghuang County, Hunan, China',
                checkInDate: '2025-10-26',
                checkOutDate: '2025-10-27',
                phone: '+86-13397632336',
              },
            },
            // 4. Бронирование в Чунцине
            {
              id: 'e6f7a8b9-c0d1-4e2f-b3c4-d5e6f7a8b9c0',
              type: 'hotel',
              icon: 'mdi:hotel',
              title: 'Homeinn Plus Hotel, Chongqing',
              data: {
                hotelName: 'Homeinn Plus Hotel (Chongqing Liziba Niujiaotuo Light Rail Station)',
                address: '114 Shangqingsi Road, Yuzhong District, Chongqing, China',
                checkInDate: '2025-10-27',
                checkOutDate: '2025-11-03',
                phone: '+86-23-63266888-9',
              },
            },

            // Авиаперелеты
            // Перелет ТУДА: Москва -> Чанша (с пересадкой в Чэнду)
            {
              id: 'a1b2c3d4-e5f6-4a7b-8c9d-1e2f3a4b5c6d',
              type: 'flight',
              icon: 'mdi:airplane',
              title: 'Перелет: Москва → Чанша',
              data: {
                bookingReference: '88YBQL',
                segments: [
                  {
                    departureCity: 'Москва',
                    arrivalCity: 'Чэнду',
                    departureAirport: 'SVO',
                    arrivalAirport: 'TFU',
                    departureDateTime: '2025-10-18T22:40:00',
                    arrivalDateTime: '2025-10-19T11:35:00',
                    flightNumber: '3U 3888',
                    airline: 'Sichuan Airlines',
                    aircraft: 'Airbus A350-900',
                    terminalDeparture: 'C',
                    terminalArrival: '1',
                  },
                  {
                    departureCity: 'Чэнду',
                    arrivalCity: 'Чанша',
                    departureAirport: 'TFU',
                    arrivalAirport: 'CSX',
                    departureDateTime: '2025-10-19T15:30:00',
                    arrivalDateTime: '2025-10-19T17:25:00',
                    flightNumber: '3U 6741',
                    airline: 'Sichuan Airlines',
                    aircraft: 'Airbus A320',
                    terminalDeparture: '2',
                    terminalArrival: '1',
                  },
                ],
                notes: 'Общий номер электронного билета: 876-2899402792. Пассажир: Ivan Kornilov.',
              },
            },
          ],
        },
        order: 1, // Порядок отображения секции в интерфейсе
      },
    ],
    memories: [],
    days: [
      // =================================================================
      // ==================== День 1: 19 октября, Чанша ===================
      // =================================================================
      {
        id: DAY_IDS[0],
        date: new Date('2025-10-19'),
        title: 'К огням мегаполиса Чанши',
        description: 'Завершение долгого пути и мгновенное, яркое погружение в жизнь китайского мегаполиса. Благодаря идеальному расположению отеля, вечер пройдет в эпицентре событий, вкусов и неоновых огней.',
        tripId: TRIP_ID,
        meta: [
          {
            id: crypto.randomUUID(),
            icon: 'mdi:walk',
            color: '#BDB2FF',
            title: 'Маршрутный темп',
            content: 'Средний',
          },
          {
            id: crypto.randomUUID(),
            icon: 'mdi:currency-usd',
            color: '#A3D9A5',
            title: 'Финансовые затраты на день',
            content: '**Трансфер из аэропорта:** `~100 - 1 200` ₽.\n\n* *Что включено:* Поездка на метро (около 7 юаней) или на такси (80-100 юаней).\n\n<br />\n\n**Итого за день:** от `100 ₽` до `1 200 ₽` (без учета проживания, перелетов и питания).\n',
            subtitle: 'от 100 ₽ до 1 200 ₽',
          },
        ],
        activities: [
          {
            id: '3f08874e-c746-45b0-8a87-e638b6a8b149',
            startTime: '17:25',
            endTime: '18:15',
            title: 'Прибытие в аэропорт и получение багажа',
            sections: [
              {
                id: '6e090d2b-3447-4029-b463-03e8f07bd5df',
                text: 'Прибытие в Международный аэропорт **Чанша-Хуанхуа (CSX)**. Вам останется только получить багаж, что значительно ускорит процесс. Следуйте по указателям "Выдача багажа / Baggage Claim" (行李提取), заберите свой чемодан и выходите в зал прилета.',
                type: 'description',
              },
              {
                id: '577cb0ca-f43c-41d3-b29c-a48271c0f502',
                text: 'В Китае действует правило: вы проходите все пограничные и таможенные формальности **только в первом городе прилета из-за границы**. Для вас этим городом является **Чэнду (TFU)**. По прибытии в Чаншу вы считаетесь внутренним пассажиром, поэтому вам нужно будет только забрать багаж и свободно выйти в город.',
                type: 'description',
                icon: 'mdi:information-outline',
                color: 'var(--bg-tertiary-color)',
                title: 'Прибытие в Чаншу: Финишная прямая внутри Китая',
                isAttached: true,
              },
            ],
            tag: 'transport' as const,
            status: 'none' as const,
            rating: null,
            dayId: DAY_IDS[0],
          },
          {
            id: 'eb147944-8133-4abf-8674-eece4be776f7',
            startTime: '18:15',
            endTime: '19:30',
            title: 'Трансфер в отель FunGee S',
            sections: [
              {
                id: 'e5c3e280-6b0f-48f5-8f1c-b97c9f2d2b5b',
                text: '**Способ 1 (Надежный и бюджетный): Метро.**\n1.  **Найдите станцию:** В аэропорту следуйте по указателям **"Metro" (地铁)**. \n2.  **Маршрут:** Сядьте на **Линию 6 (фиолетовую)** до станции **"Wenyichun Park" (文艺路公园)**. Сделайте пересадку на **Линию 1 (красную)** и проедьте две остановки до вашей станции — **"Huangxing Square" (黄兴广场)**.\n\n**Способ 2 (Комфортный): Такси.**\nНа выходе из зала прилета найдите официальную стоянку такси. Покажите водителю название отеля на китайском: **欢致酒店（长沙五一广场黄兴广场地铁站店）**. Поездка займет 40-50 минут.',
                type: 'description',
              },
            ],
            tag: 'transport' as const,
            status: 'none' as const,
            rating: null,
            dayId: DAY_IDS[0],
          },
          {
            id: 'aa97c1ec-4b57-44bb-ae24-6374deeb229c',
            startTime: '19:30',
            endTime: '20:00',
            title: 'Заселение в отель и отдых',
            sections: [
              {
                id: '6ba39e4c-88ce-4918-9638-833c2a05a977',
                text: 'Оставьте вещи, освежитесь после долгой дороги. Вы прибыли в самый центр ночной жизни.',
                type: 'description',
              },
            ],
            tag: 'relax' as const,
            status: 'none' as const,
            rating: null,
            dayId: DAY_IDS[0],
          },
          {
            id: '787a3595-fcf7-4894-861d-a3e9178f6ef8',
            startTime: '20:00',
            endTime: '22:00',
            title: 'Гастрономический вечер на Huangxing и Pozi Street',
            sections: [
              {
                id: '28a80a81-68b6-42fc-b77d-655a136f409d',
                text: 'Ваш отель расположен прямо на **пешеходной улице Хуансин (Huangxing Road Pedestrian Street / 黄兴路步行街)**. Просто выйдите на улицу и погрузитесь в бурлящую атмосферу. Обязательно сверните на прилегающую знаменитую гастрономическую улицу **Поцзыцзе (Pozi Street / 坡子街)**, чтобы попробовать местные деликатесы.',
                type: 'description',
              },
              {
                id: '93008722-c1ae-4a2d-a2c8-0eb5b0fe9ac8',
                type: 'gallery',
                imageUrls: [
                  getRoutePath('20250825154758.png'),
                  getRoutePath('20250825155522.png'),
                ],
              },
              {
                id: 'f41946ee-db0f-40a8-a70a-df3e2454db1d',
                text: '**Почему стоит посетить?**\nПешеходная улица Хуансин — это не просто главная торговая артерия, а настоящее сердце современного Чанши. Вечером она превращается в бурлящий поток огней, музыки и энергии.\n\n**Гастрономическая Мекка:**\nГлавная цель здесь — свернуть на прилегающую улицу **Поцзыцзе**, история которой насчитывает более 1200 лет. Именно Поцзыцзе считается кулинарным центром города.\n\n**Что обязательно попробовать?**\n*   **Вонючий тофу (чоу доуфу):** Легендарная закуска Чанши.\n*   **Острые речные раки (коу вэй ся):** Культовое блюдо.\n*   **Чай "Sexy Tea" (Cha Yan Yue Se):** Самый популярный и модный чайный бренд, родившийся в Чанше.',
                type: 'description',
                icon: 'mdi:information-outline',
                color: 'var(--bg-tertiary-color)',
                title: 'Пульс и вкус современного Чанши',
                isAttached: true,
              },
            ],
            tag: 'food' as const,
            status: 'none' as const,
            rating: null,
            dayId: DAY_IDS[0],
          },
        ],
      },
      // ... Здесь будут другие дни
    ],
  },
]
