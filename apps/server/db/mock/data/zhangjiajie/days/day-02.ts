import { DAY_IDS, getRoutePath, TRIP_ID } from '../constants'

export const MOCK_DAY_02 = {
  id: DAY_IDS[1],
  date: new Date('2025-10-20'),
  title: 'Контрасты Чанши: от древней мудрости к революционной истории',
  description: 'Этот день посвящен двум главным символам Чанши. Первая половина пройдет в интеллектуальной и умиротворенной атмосфере древней академии, где вы прикоснетесь к тысячелетней истории китайского образования. Вторая половина — это прогулка по огромному парковому острову, в центре которого доминирует монументальная фигура самого известного уроженца провинции.',
  tripId: TRIP_ID,
  meta: [
    { id: crypto.randomUUID(), icon: 'mdi:walk', color: '#BDB2FF', title: 'Маршрутный темп', content: 'Средний' },
    { id: crypto.randomUUID(), icon: 'mdi:currency-usd', color: '#A3D9A5', title: 'Финансовые затраты на день', content: '**Билеты на достопримечательности:** `~750 - 900` ₽.\n\n* *Что включено:* Посещение парка **Оранжевый остров** бесплатно, но платный электромобиль (20-40 юаней) настоятельно рекомендуется. Вход в **Академию Юэлу** стоит около 40-50 юаней.\n\n<br />\n\n**Местный транспорт:** `~300 - 500` ₽.\n\n* *Что включено:* Несколько поездок на метро.\n\n<br />\n\n**Итого за день:** от `1 050 ₽` до `1 400 ₽` (без учета питания).', subtitle: 'от 1 050 ₽ до 1 400 ₽' },
  ],
  activities: [
    { id: crypto.randomUUID(), startTime: '09:00', endTime: '09:30', title: 'Подъем и завтрак', sections: [{ id: crypto.randomUUID(), text: 'Попробуйте знаменитую хунаньскую рисовую лапшу (**米粉 / mǐfěn**) в одной из местных закусочных.', type: 'description' }], tag: 'food' as const, status: 'none' as const, rating: null, dayId: DAY_IDS[1] },
    { id: crypto.randomUUID(), startTime: '09:30', endTime: '10:30', title: 'Дорога к горе Юэлу', sections: [{ id: crypto.randomUUID(), text: 'На метро доберитесь до подножия горы Юэлу (**Yuelu Mountain / 岳麓山**). <a href="https://j.map.baidu.com/78/luc" target="_blank">Ссылка на Baidu Map</a>.', type: 'description' }, { id: crypto.randomUUID(), type: 'gallery', imageUrls: [getRoutePath('20250825162319.png'), getRoutePath('20250825162402.png'), getRoutePath('20250825163648.png'), getRoutePath('20250825163635.png')] }, { id: crypto.randomUUID(), text: 'Гора Юэлу — это культурное и духовное ядро Чанши. Хотя ее высота всего 300 метров, китайцы называют ее "人文名山" — "знаменитая гуманистическая гора", где природная красота служит обрамлением для тысячелетней истории. У ее подножия находится главная цель — **Академия Юэлу**, одна из четырех великих и древнейших академий Китая, непрерывно действующая с 976 года. Это колыбель хунаньской учености и важный центр конфуцианской мысли.', type: 'description', icon: 'mdi:information-outline', color: 'var(--bg-tertiary-color)', title: 'Гора Юэлу: Зеленое сердце и культурная душа Чанши', isAttached: true }], tag: 'transport' as const, status: 'none' as const, rating: null, dayId: DAY_IDS[1] },
    { id: crypto.randomUUID(), startTime: '10:30', endTime: '13:00', title: 'Посещение Академии Юэлу', sections: [{ id: crypto.randomUUID(), text: 'Погрузитесь в атмосферу одного из старейших учебных заведений Китая. Прогуляйтесь по его дворам, павильонам и библиотекам. <a href="https://j.map.baidu.com/6a/9pc" target="_blank">Ссылка на Baidu Map</a>.', type: 'description' }, { id: crypto.randomUUID(), type: 'gallery', imageUrls: [getRoutePath('20250825162444.png'), getRoutePath('20250825163028.png'), getRoutePath('20250825163109.png')] }, { id: crypto.randomUUID(), text: 'Основанная в 976 году, Академия Юэлу — единственное учебное заведение в мире, где преподавание не прерывалось более тысячи лет. Обратите внимание на девиз над входом в главный лекционный зал: **"实事求是" (Ши Ши Цю Ши) — "Искать истину в фактах"**. Этот принцип оказал огромное влияние на молодого Мао Цзэдуна, который здесь учился, и стал одним из ключевых в его дальнейшей деятельности.', type: 'description', icon: 'mdi:information-outline', color: 'var(--bg-tertiary-color)', title: 'Тысячелетняя колыбель мысли и духа', isAttached: true }], tag: 'attraction' as const, status: 'none' as const, rating: null, dayId: DAY_IDS[1] },
    { id: crypto.randomUUID(), startTime: '13:00', endTime: '14:30', title: 'Обед у подножия горы', sections: [{ id: crypto.randomUUID(), text: 'В районе Хунаньского университета расположено множество аутентичных и недорогих ресторанов.', type: 'description' }], tag: 'food' as const, status: 'none' as const, rating: null, dayId: DAY_IDS[1] },
    { id: crypto.randomUUID(), startTime: '14:30', endTime: '17:30', title: 'Исследование Оранжевого острова', sections: [{ id: crypto.randomUUID(), text: 'Спустившись с горы, сядьте на метро и проедьте одну остановку до острова (**Orange Isle / 橘子洲**). Дойдите до южной оконечности, чтобы увидеть грандиозный памятник молодому Мао Цзэдуну. Остров очень большой, воспользуйтесь электромобилями.', type: 'description' }, { id: crypto.randomUUID(), type: 'gallery', imageUrls: [getRoutePath('20250825163212.png'), getRoutePath('20250825163302.png'), getRoutePath('20250825163329.png')] }, { id: crypto.randomUUID(), text: 'Остров известен на весь Китай благодаря строке из стихотворения молодого Мао: "Одиноко стою холодной осенью, река Сян бежит на север, на мысе Оранжевого острова...". Гигантский памятник изображает не привычного вождя, а молодого, амбициозного интеллектуала с развевающимися волосами — символ нации на пороге великих перемен.', type: 'description', icon: 'mdi:information-outline', color: 'var(--bg-tertiary-color)', title: 'Поэзия революции в сердце реки', isAttached: true }], tag: 'attraction' as const, status: 'none' as const, rating: null, dayId: DAY_IDS[1] },
    { id: crypto.randomUUID(), startTime: '18:00', endTime: '19:00', title: 'Возвращение в отель и отдых', sections: [], tag: 'relax' as const, status: 'none' as const, rating: null, dayId: DAY_IDS[1] },
    {
      id: crypto.randomUUID(),
      startTime: '19:00',
      endTime: '22:00',
      title: 'Ужин и прогулка по улице Хуансин',
      sections: [{ id: crypto.randomUUID(), text: 'Изучение новых мест на пешеходной улице и поиск новых гастрономических впечатлений.', type: 'description' }],
      tag: 'food' as const,
      status: 'none' as const,
      rating: null,
      dayId: DAY_IDS[1],
    },
  ],
}
