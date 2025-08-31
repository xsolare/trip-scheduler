import type { DayMetaInfo } from '~/shared/types/models/activity'

export type DayMetaBadgePreset = Partial<Omit<DayMetaInfo, 'id'>> & {
  templateName: string
  templateDescription?: string
  templateCategory?: string
}

export const badgePresets: DayMetaBadgePreset[] = [
  {
    templateName: 'Маршрутный темп',
    templateDescription: 'Обозначить общий темп передвижения в течение дня.',
    templateCategory: 'Общее',
    title: 'Маршрутный темп:',
    subtitle: '<низкий/средний/высокий>',
    icon: 'mdi:walk',
    color: '#BDB2FF',
    content: `
**Низкий:** Расслабленные прогулки, много времени на остановки и фотографии.

<br />

**Средний:** Стандартный туристический темп, баланс между передвижением и осмотром.

<br />

**Высокий:** Быстрое передвижение, фокус на достижении ключевых точек.`,
  },
  {
    templateName: 'Финансовые затраты',
    templateDescription: 'Универсальный шаблон для учета расходов за день.',
    templateCategory: 'Финансы',
    title: 'Финансовые затраты на день',
    subtitle: '~... ₽',
    icon: 'mdi:currency-usd',
    color: '#A3D9A5',
    content: `
**Категория 1 (напр. Транспорт):** \`~... - ...\` ₽.
  *   *Что включено:* ...

<br />

**Категория 2 (напр. Билеты):** \`~... - ...\` ₽.
  *   *Что включено:* ...

<br />

**Категория 3 (напр. Питание):** \`~... - ...\` ₽.
  *   *Что включено:* ...

<br />

**Итого за день:** от \`... ₽\` до \`... ₽\` (без учета проживания и питания).`,
  },
  {
    templateName: 'Бронь отеля',
    templateDescription: 'Информация о бронировании жилья.',
    templateCategory: 'Проживание',
    title: 'Проживание',
    subtitle: 'Название отеля',
    icon: 'mdi:bed',
    color: '#A0C4FF',
    content: `
*   **Название:** 
*   **Адрес:** 
*   **Номер брони:** 
*   **Даты:** с ... по ...
*   **Контакты:** 
*   **Примечания:** `,
  },
  {
    templateName: 'Авиабилеты',
    templateDescription: 'Информация о перелете.',
    templateCategory: 'Транспорт',
    title: 'Авиаперелет',
    subtitle: 'Город вылета - Город прилета',
    icon: 'mdi:airplane',
    color: '#9BF6FF',
    content: `
*   **Авиакомпания:** 
*   **Номер рейса:** 
*   **Вылет:** ... (время), ... (аэропорт)
*   **Прилет:** ... (время), ... (аэропорт)
*   **Номер брони:** 
*   **Примечания:** `,
  },
]
