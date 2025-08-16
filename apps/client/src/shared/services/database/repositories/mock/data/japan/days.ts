import { EActivitySectionType } from '~/shared/types/models/activity'
import { createActivity, createDay, createSection } from '../_factory'
import { tripJapanId } from './constants'

const day1 = createDay(
  tripJapanId,
  '2026-03-25',
  'Прибытие в Токио и неон Синдзюку',
  'Первые шаги по японской земле. Знакомство с одним из самых динамичных районов Токио.',
  [
    createActivity('15:00-17:00', 'Прилет в Нариту и активация JR Pass', [
      createSection(EActivitySectionType.DESCRIPTION, 'Прибытие в аэропорт, обмен ваучера на Japan Rail Pass, покупка транспортной карты Suica.'),
    ]),
    createActivity('17:00-18:30', 'Поездка на Narita Express и заселение', [
      createSection(EActivitySectionType.DESCRIPTION, 'Комфортабельный поезд доставит нас прямо на станцию Синдзюку. Заселение в отель.'),
    ]),
    createActivity('19:00-20:00', 'Первый японский ужин: рамэн', [
      createSection(EActivitySectionType.DESCRIPTION, 'Ужин в аутентичной рамэнной, заказ через автомат.'),
    ]),
    createActivity('20:30-22:00', 'Смотровая площадка Токийского столичного правительства', [
      createSection(EActivitySectionType.DESCRIPTION, 'Бесплатная смотровая площадка на 45-м этаже с видом на ночной Синдзюку. В ясную погоду видна гора Фудзи.'),
      createSection(EActivitySectionType.GALLERY, ['/images/sights/tokyo-gov-building-view.jpg']),
    ]),
    createActivity('22:00-23:00', 'Прогулка по кварталу Омойдэ-ёкотё', [
      createSection(EActivitySectionType.DESCRIPTION, 'Знакомство с "Переулком воспоминаний" - лабиринтом крошечных баров и якитори-ресторанчиков.'),
    ]),
  ],
)

const day2 = createDay(
  tripJapanId,
  '2026-03-26',
  'Молодежная культура и традиции: Харадзюку и Сибуя',
  'День контрастов: от тихого святилища до самого оживленного перекрестка в мире.',
  [
    createActivity('09:30-11:00', 'Храм Мэйдзи Дзингу', [
      createSection(EActivitySectionType.DESCRIPTION, 'Посещение синтоистского святилища, посвященного императору Мэйдзи и его супруге. Прогулка по лесу, который был создан из деревьев, пожертвованных со всей Японии.'),
    ]),
    createActivity('11:00-12:30', 'Улица Такэсита в Харадзюку', [
      createSection(EActivitySectionType.DESCRIPTION, 'Центр молодежной моды и культуры. Пробуем гигантскую сладкую вату и блинчики с начинками.'),
      createSection(EActivitySectionType.GALLERY, ['/images/sights/takeshita-street.jpg']),
    ]),
    createActivity('13:00-14:00', 'Обед: Кайсэн-дон', [
      createSection(EActivitySectionType.DESCRIPTION, 'Обед в районе Сибуя. Попробуем кайсэн-дон - чашу риса с разнообразными свежими морепродуктами.'),
    ]),
    createActivity('14:30-15:00', 'Статуя Хатико', [
      createSection(EActivitySectionType.DESCRIPTION, 'Фотография у знаменитого памятника верной собаке, который является популярным местом встречи.'),
    ]),
    createActivity('15:00-16:00', 'Перекресток Сибуя', [
      createSection(EActivitySectionType.DESCRIPTION, 'Наблюдение за самым загруженным пешеходным переходом в мире из окна кофейни Starbucks на втором этаже. Пересечение перекрестка вместе с толпой.'),
      createSection(EActivitySectionType.GALLERY, ['/images/sights/shibuya-crossing.jpg']),
    ]),
    createActivity('16:00-18:00', 'Шопинг в Shibuya 109', [
      createSection(EActivitySectionType.DESCRIPTION, 'Исследование культового торгового центра, который является законодателем мод для молодых японок.'),
    ]),
    createActivity('19:00-20:30', 'Ужин: суши на конвейере', [
      createSection(EActivitySectionType.DESCRIPTION, 'Веселый и вкусный ужин в ресторане "кайтэн-дзуси", где тарелочки с суши едут мимо столиков по ленте конвейера.'),
    ]),
  ],
)

export const MOCK_JAPAN_DAYS = [day1, day2]
