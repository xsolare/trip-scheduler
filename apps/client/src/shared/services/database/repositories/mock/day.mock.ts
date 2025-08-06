import type { Day } from '~/shared/types/models/activity'
import { v4 as uuidv4 } from 'uuid'

// Моковые ID дней для связи с активностями
const day1HongKongId = uuidv4()
const day2HongKongId = uuidv4()
const day1JapanId = uuidv4()
const day2JapanId = uuidv4()

export const MOCK_DAYS = [
  // --- Дни для путешествия "Путешествие в Японию" (tripId: '1') ---
  {
    id: day1JapanId,
    tripId: '1',
    date: '2026-03-25',
    title: 'Прибытие в Токио и неон Синдзюку',
    description: 'Первые шаги по японской земле. Знакомство с одним из самых динамичных районов Токио.',
    activities: [
      {
        id: uuidv4(),
        dayId: day1JapanId,
        startTime: '15:00',
        endTime: '17:00',
        title: 'Прилет в Нариту и активация JR Pass',
        sections: [{ id: uuidv4(), type: 'description', text: 'Прибытие в аэропорт, обмен ваучера на Japan Rail Pass, покупка транспортной карты Suica.' }],
      },
      {
        id: uuidv4(),
        dayId: day1JapanId,
        startTime: '17:00',
        endTime: '18:30',
        title: 'Поездка на Narita Express и заселение',
        sections: [{ id: uuidv4(), type: 'description', text: 'Комфортабельный поезд доставит нас прямо на станцию Синдзюку. Заселение в отель.' }],
      },
      {
        id: uuidv4(),
        dayId: day1JapanId,
        startTime: '19:00',
        endTime: '20:00',
        title: 'Первый японский ужин: рамэн',
        sections: [{ id: uuidv4(), type: 'description', text: 'Ужин в аутентичной рамэнной, заказ через автомат.' }],
      },
      {
        id: uuidv4(),
        dayId: day1JapanId,
        startTime: '20:30',
        endTime: '22:00',
        title: 'Смотровая площадка Токийского столичного правительства',
        sections: [
          { id: uuidv4(), type: 'description', text: 'Бесплатная смотровая площадка на 45-м этаже с видом на ночной Синдзюку. В ясную погоду видна гора Фудзи.' },
          { id: uuidv4(), type: 'gallery', imageUrls: ['/images/sights/tokyo-gov-building-view.jpg'] },
        ],
      },
      {
        id: uuidv4(),
        dayId: day1JapanId,
        startTime: '22:00',
        endTime: '23:00',
        title: 'Прогулка по кварталу Омойдэ-ёкотё',
        sections: [{ id: uuidv4(), type: 'description', text: 'Знакомство с "Переулком воспоминаний" - лабиринтом крошечных баров и якитори-ресторанчиков.' }],
      },
    ],
  },
  {
    id: day2JapanId,
    tripId: '1',
    date: '2026-03-26',
    title: 'Молодежная культура и традиции: Харадзюку и Сибуя',
    description: 'День контрастов: от тихого святилища до самого оживленного перекрестка в мире.',
    activities: [
      {
        id: uuidv4(),
        dayId: day2JapanId,
        startTime: '09:30',
        endTime: '11:00',
        title: 'Храм Мэйдзи Дзингу',
        sections: [{ id: uuidv4(), type: 'description', text: 'Посещение синтоистского святилища, посвященного императору Мэйдзи и его супруге. Прогулка по лесу, который был создан из деревьев, пожертвованных со всей Японии.' }],
      },
      {
        id: uuidv4(),
        dayId: day2JapanId,
        startTime: '11:00',
        endTime: '12:30',
        title: 'Улица Такэсита в Харадзюку',
        sections: [
          { id: uuidv4(), type: 'description', text: 'Центр молодежной моды и культуры. Пробуем гигантскую сладкую вату и блинчики с начинками.' },
          { id: uuidv4(), type: 'gallery', imageUrls: ['/images/sights/takeshita-street.jpg'] },
        ],
      },
      {
        id: uuidv4(),
        dayId: day2JapanId,
        startTime: '13:00',
        endTime: '14:00',
        title: 'Обед: Кайсэн-дон',
        sections: [{ id: uuidv4(), type: 'description', text: 'Обед в районе Сибуя. Попробуем кайсэн-дон - чашу риса с разнообразными свежими морепродуктами.' }],
      },
      {
        id: uuidv4(),
        dayId: day2JapanId,
        startTime: '14:30',
        endTime: '15:00',
        title: 'Статуя Хатико',
        sections: [{ id: uuidv4(), type: 'description', text: 'Фотография у знаменитого памятника верной собаке, который является популярным местом встречи.' }],
      },
      {
        id: uuidv4(),
        dayId: day2JapanId,
        startTime: '15:00',
        endTime: '16:00',
        title: 'Перекресток Сибуя',
        sections: [
          { id: uuidv4(), type: 'description', text: 'Наблюдение за самым загруженным пешеходным переходом в мире из окна кофейни Starbucks на втором этаже. Пересечение перекрестка вместе с толпой.' },
          { id: uuidv4(), type: 'gallery', imageUrls: ['/images/sights/shibuya-crossing.jpg'] },
        ],
      },
      {
        id: uuidv4(),
        dayId: day2JapanId,
        startTime: '16:00',
        endTime: '18:00',
        title: 'Шопинг в Shibuya 109',
        sections: [{ id: uuidv4(), type: 'description', text: 'Исследование культового торгового центра, который является законодателем мод для молодых японок.' }],
      },
      {
        id: uuidv4(),
        dayId: day2JapanId,
        startTime: '19:00',
        endTime: '20:30',
        title: 'Ужин: суши на конвейере',
        sections: [{ id: uuidv4(), type: 'description', text: 'Веселый и вкусный ужин в ресторане "кайтэн-дзуси", где тарелочки с суши едут мимо столиков по ленте конвейера.' }],
      },
    ],
  },
  // --- Дни для путешествия "Неоновый Гонконг" (tripId: '2') ---
  {
    id: day1HongKongId,
    tripId: '2',
    date: '2025-09-10',
    title: 'Прибытие и Пик Виктория',
    description: 'Первый день в Гонконге: заселение в отель и знакомство с городом с высоты птичьего полета.',
    activities: [
      {
        id: uuidv4(),
        dayId: day1HongKongId,
        startTime: '14:00',
        endTime: '15:30',
        title: 'Прибытие и трансфер в отель',
        sections: [
          {
            id: uuidv4(),
            type: 'description',
            text: 'Прибытие в Международный аэропорт Гонконга (HKG), прохождение паспортного контроля и получение багажа. Трансфер в отель в районе Цим Ша Цуй на Airport Express.',
          },
        ],
      },
      {
        id: uuidv4(),
        dayId: day1HongKongId,
        startTime: '16:00',
        endTime: '17:00',
        title: 'Обед в кафе "Cha Chaan Teng"',
        sections: [
          {
            id: uuidv4(),
            type: 'description',
            text: 'Обед в традиционном гонконгском кафе. Попробуем знаменитый молочный чай, ананасовую булочку и тосты по-гонконгски.',
          },
          {
            id: uuidv4(),
            type: 'gallery',
            imageUrls: ['/images/food/hk-milk-tea.jpg', '/images/food/hk-pineapple-bun.jpg'],
          },
        ],
      },
      {
        id: uuidv4(),
        dayId: day1HongKongId,
        startTime: '17:30',
        endTime: '19:00',
        title: 'Подъем на Пик Виктория',
        sections: [
          {
            id: uuidv4(),
            type: 'description',
            text: 'Подъем на историческом трамвае Peak Tram на самую высокую точку острова Гонконг. С трамвая открываются потрясающие виды на небоскребы.',
          },
        ],
      },
      {
        id: uuidv4(),
        dayId: day1HongKongId,
        startTime: '19:00',
        endTime: '20:30',
        title: 'Смотровая площадка Sky Terrace 428',
        sections: [
          {
            id: uuidv4(),
            type: 'description',
            text: 'Наслаждение панорамным видом на город, бухту Виктория и полуостров Коулун с высоты 428 метров.',
          },
          {
            id: uuidv4(),
            type: 'gallery',
            imageUrls: ['/images/sights/hk-victoria-peak-day.jpg', '/images/sights/hk-victoria-peak-night.jpg'],
          },
        ],
      },
      {
        id: uuidv4(),
        dayId: day1HongKongId,
        startTime: '20:30',
        endTime: '21:30',
        title: 'Световое шоу "Симфония огней"',
        sections: [
          {
            id: uuidv4(),
            type: 'description',
            text: 'Спуск к набережной Цим Ша Цуй, чтобы посмотреть всемирно известное ежедневное световое и звуковое шоу, в котором участвуют более 40 зданий по обе стороны гавани.',
          },
        ],
      },
    ],
  },
  {
    id: day2HongKongId,
    tripId: '2',
    date: '2025-09-11',
    title: 'Контрасты Коулуна',
    description: 'Исследование полуострова Коулун: от древних храмов и тихих парков до шумных уличных рынков.',
    activities: [
      {
        id: uuidv4(),
        dayId: day2HongKongId,
        startTime: '10:00',
        endTime: '11:30',
        title: 'Монастырь Вонг Тай Син',
        sections: [{ id: uuidv4(), type: 'description', text: 'Посещение даосского храма, известного своими предсказаниями и яркой архитектурой.' }],
      },
      {
        id: uuidv4(),
        dayId: day2HongKongId,
        startTime: '12:00',
        endTime: '13:30',
        title: 'Прогулка по парку Коулун',
        sections: [{ id: uuidv4(), type: 'description', text: 'Оазис зелени в центре города. Наблюдение за фламинго и посещение сада "Лабиринт".' }],
      },
      {
        id: uuidv4(),
        dayId: day2HongKongId,
        startTime: '14:00',
        endTime: '15:30',
        title: 'Обед с димсамами',
        sections: [
          { id: uuidv4(), type: 'description', text: 'Обед в ресторане, который входит в гид Мишлен, специализирующемся на димсамах.' },
          { id: uuidv4(), type: 'gallery', imageUrls: ['/images/food/dim-sum.jpg'] },
        ],
      },
      {
        id: uuidv4(),
        dayId: day2HongKongId,
        startTime: '16:00',
        endTime: '18:00',
        title: 'Шопинг на Рынке Ледис-маркет',
        sections: [{ id: uuidv4(), type: 'description', text: 'Погружение в атмосферу уличной торговли на одном из самых известных рынков Гонконга.' }],
      },
      {
        id: uuidv4(),
        dayId: day2HongKongId,
        startTime: '18:30',
        endTime: '19:30',
        title: 'Исследование района Монг Кок',
        sections: [{ id: uuidv4(), type: 'description', text: 'Прогулка по одному из самых густонаселенных районов мира, знакомство с его неоновыми вывесками и оживленными улицами.' }],
      },
      {
        id: uuidv4(),
        dayId: day2HongKongId,
        startTime: '20:00',
        endTime: '21:30',
        title: 'Ужин на ночном рынке Темпл-стрит',
        sections: [{ id: uuidv4(), type: 'description', text: 'Ужин морепродуктами и другими уличными деликатесами прямо на рынке.' }],
      },
    ],
  },

] as Day[]
