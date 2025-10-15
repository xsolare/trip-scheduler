import type { Place, PlaceTag } from '~/shared/types/models/place';

export const mockTags: PlaceTag[] = [
  { id: 'tag-1', name: 'Архитектура', icon: 'mdi:bank' },
  { id: 'tag-2', name: 'История', icon: 'mdi:book-open-page-variant' },
  { id: 'tag-3', name: 'Природа', icon: 'mdi:sprout' },
  { id: 'tag-4', name: 'Еда', icon: 'mdi:food-fork-drink' },
];

export const mockPlaces: Place[] = [
  {
    id: 'place-1',
    name: 'Пещеры Дацзу',
    description: 'Серия древних буддийских пещерных храмов, объект Всемирного наследия ЮНЕСКО.',
    city: 'Chongqing',
    coordinates: { lat: 29.705, lon: 105.708 },
    tags: [mockTags[0], mockTags[1]],
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Dazu_Rock_Carvings-01.jpg/1280px-Dazu_Rock_Carvings-01.jpg',
    rating: 4.8,
  },
  {
    id: 'place-2',
    name: 'Крепость Дяоюйчэн',
    description: 'Историческая крепость, известная своей героической обороной против монгольских войск в XIII веке.',
    city: 'Chongqing',
    coordinates: { lat: 29.93, lon: 106.3 },
    tags: [mockTags[1]],
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Diaoyucheng_2018_01.jpg/1024px-Diaoyucheng_2018_01.jpg',
    rating: 4.6,
  },
  {
    id: 'place-3',
    name: 'Три природных моста',
    description: 'Впечатляющая серия естественных карстовых мостов через ущелье. Место съемок фильма "Трансформеры 4".',
    city: 'Chongqing',
    coordinates: { lat: 29.43, lon: 107.79 },
    tags: [mockTags[2]],
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Wulong_Karst-Three_Natural_Bridges-Tianlong_Bridge-2009-08-01.jpg/1280px-Wulong_Karst-Three_Natural_Bridges-Tianlong_Bridge-2009-08-01.jpg',
    rating: 4.9,
  },
];
