import { ActivitySectionType } from '~/shared/types/models/activity'
import { createActivity, createDay, createSection } from '../_factory'
import { tripChinaId } from './constants'

const day1 = createDay(
  tripChinaId,
  '2025-08-10',
  'Начало пути',
  'Наше китайское приключение начинается с прибытия в аэропорт Хунцяо. Вечерняя программа идеально подходит для первого знакомства с городом без лишней нагрузки: спокойная прогулка по современному парку и ужин у архитектурного шедевра "Тысяча Деревьев".',
  [
    createActivity('16:00-17:00', 'Прибытие в Аэропорт Хунцяо (SHA)', [createSection(ActivitySectionType.DESCRIPTION, 'Прибытие и трансфер в отель.')]),
    createActivity('17:00-18:15', 'Заселение в отель Yunhe Yebo Hotel', [
      createSection(ActivitySectionType.DESCRIPTION, 'Заселение, короткий отдых после перелета.'),
      createSection(ActivitySectionType.DESCRIPTION, 'Адрес: `2-5F, Area C, 1F, No.503 Wuning Road, Путуо, Шанхай`'),
    ]),
    createActivity('18:15-18:30', 'Путь к метро Caoyang Road', [
      createSection(
        ActivitySectionType.DESCRIPTION,
        'Прогулка до станции метро **Caoyang Road (曹杨路)** или **Fengqiao Rd. (枫桥路)**. \n\n*Совет*: Приобретите транспортную карту Shanghai Transportation Card для удобства передвижения по городу (доступна в AliPay).',
      ),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250216013656.png']),
    ]),
    createActivity('18:30-19:30', 'Прогулка по парку Suzhouhe Mengqing Garden', [
      createSection(
        ActivitySectionType.DESCRIPTION,
        '**Environmental Theme Park of Suzhouhe Mengqing Garden(苏州河梦清园环保主题公园)**\n\nЖивописный парк вдоль реки Сучжоу — идеальное место для акклиматизации. \n*Что посмотреть*: Красивый ландшафтный дизайн, пешеходные мостики, местные растения, виды на реку.',
      ),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250216013458.png', '/images/3/20250221130326.png']),
    ]),
    createActivity('19:30-22:00', 'Ужин в Tian\'an Thousand Trees', [
      createSection(
        ActivitySectionType.DESCRIPTION,
        'Посещение уникального архитектурного комплекса **Ocean Jewel · Tian\'an Thousand Trees (大洋晶典·天安千树)**, напоминающего "вертикальный лес". \n\n**Рекомендуемые заведения:**\n* *Element Fresh* — европейская кухня с легкими блюдами\n* *Haidilao (海底捞)* — знаменитый китайский хотпот (требуется бронирование)\n* *Costa Coffee* — для любителей кофе и легких закусок',
      ),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250216013213.png']),
    ]),
    createActivity('22:00-22:30', 'Возвращение в отель', [
      createSection(ActivitySectionType.DESCRIPTION, 'Поездка на метро обратно в отель для отдыха. \n\n**Важно:** Последние поезда метро отправляются примерно в 22:30-23:00!'),
    ]),
  ],
)

const day2 = createDay(
  tripChinaId,
  '2025-08-11',
  'Привет Шанхай (Waitan)',
  'Насыщенный день, который начнется с Народной площади, проведет через шумную торговую улицу Nanjing Road к знаменитой набережной Вайтан с ее колониальной архитектурой, а завершится посещением храмов и ночной прогулкой.',
  [
    createActivity('10:00-10:30', 'Народная площадь и People\'s Park', [
      createSection(ActivitySectionType.DESCRIPTION, 'Начало дня с прогулки по центральному парку города (**People\'s Park 上海人民公园**).'),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250217210256.png', '/images/3/20250217212046.png', '/images/3/20250217212501.png', '/images/3/20250217212416.png']),
    ]),
    createActivity('10:30-11:30', 'Прогулка по Nanjing Road Pedestrian Street', [
      createSection(ActivitySectionType.DESCRIPTION, 'Исследование главной торговой улицы Шанхая **(南京路步行街)**, проба местных закусок. Будьте готовы к толпам!'),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250217213525.png', '/images/3/20250217213134.png', '/images/3/20250217222310.png']),
    ]),
    createActivity('11:30-13:00', 'Набережная Вайтан и мост Waibaidu', [
      createSection(ActivitySectionType.DESCRIPTION, 'Прогулка вдоль набережной с видом на небоскребы Пудуна, фото у исторического моста **Waibaidu Bridge** и в парке **North Bund Green Land (北外滩滨江绿地)**.'),
      createSection(ActivitySectionType.GALLERY, [
        '/images/3/20250217214524.png',
        '/images/3/20250217214032.png',
        '/images/3/20250217214445.png',
        '/images/3/20250217223336.png',
        '/images/3/20250217223428.png',
        '/images/3/20250217223444.png',
      ]),
    ]),
    createActivity('13:30-15:00', 'Обед', [
      createSection(ActivitySectionType.DESCRIPTION, 'Обед в районе **Changshou Rd. (长寿路)**, например, в **Miss Fu in Chengdu (付小姐在成都)**.'),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250217230124.png', '/images/3/20250217225444.png', '/images/3/20250217230103.png']),
    ]),
    createActivity('15:00-16:00', 'Посещение храма Нефритового Будды', [
      createSection(ActivitySectionType.DESCRIPTION, 'Визит в один из самых известных действующих буддийских храмов Шанхая **(Jade Buddha Temple 玉佛禅寺)**. Работает до 16:30.'),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250217230859.png', '/images/3/20250217223609.png']),
    ]),
    createActivity('17:10-18:50', 'Храм и парк Цзинъань (Jing\'an)', [
      createSection(ActivitySectionType.DESCRIPTION, 'Осмотр древнего храма **Jing\'an Temple (静安寺)**, который дал название всему району, и прогулка по прилегающему парку.'),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250220190555.png', '/images/3/20250220190346.png', '/images/3/20250220190301.png']),
    ]),
    createActivity('19:00-20:30', 'Ночная Nanjing Road', [
      createSection(ActivitySectionType.DESCRIPTION, 'Возвращение на главную пешеходную улицу, чтобы увидеть ее в сиянии неоновых огней.'),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250217232059.png', '/images/3/20250217232335.png']),
    ]),
  ],
)

const day3 = createDay(
  tripChinaId,
  '2025-08-12',
  'Ура небоскребам (Pudong)',
  'День, посвященный футуристическому району Пудун. Подъем на один из самых высоких небоскребов мира, посещение огромного океанариума и парков, и, конечно, классический вид на ночной Пудун с набережной Вайтан.',
  [
    createActivity('10:00-11:00', 'Дорога в Пудун', [
      createSection(ActivitySectionType.DESCRIPTION, 'Поездка на метро до станции **Lujiazui (陆家嘴)**, финансового центра Шанхая.'),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250313233958.png', '/images/3/20250313234517.png', '/images/3/20250313233753.png']),
    ]),
    createActivity('11:00-12:30', 'Подъем на небоскреб', [
      createSection(
        ActivitySectionType.DESCRIPTION,
        '**Варианты:**\n\n*   **Shanghai Tower (上海中心):** Самый высокий вид (546 м). *Цена: 180 CNY*. [Билеты](https://us.trip.com/travel-guide/attraction/shanghai/shanghai-tower-24591219/?locale=en-XX&curr=CNY)\n*   **Oriental Pearl Tower (东方明珠):** Самая узнаваемая башня со стеклянным полом. *Цена: 160 CNY*. [Билеты](https://us.trip.com/travel-guide/attraction/shanghai/oriental-pearl-radio-and-television-tower-75627/?locale=en-US&curr=CNY)',
      ),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250313234400.png', '/images/3/20250313234435.png']),
    ]),
    createActivity('12:30-14:00', 'Обед в IFC Mall', [
      createSection(
        ActivitySectionType.DESCRIPTION,
        'Обед в одном из лучших торговых центров Пудуна **(国金中心商场)**. \n\n**Рекомендация:** Ресторан **Din Tai Fung (鼎泰丰)** на 3 этаже для дегустации знаменитых пельменей сяолунбао.',
      ),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250313234851.png']),
    ]),
    createActivity('14:30-16:00', 'Прогулка по Century Park', [
      createSection(ActivitySectionType.DESCRIPTION, 'Крупнейший городской парк Шанхая **(世纪公园)** с озерами и садами. Вход: 10 юаней.'),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250314004804.png', '/images/3/20250314004824.png', '/images/3/20250314004848.png']),
    ]),
    createActivity('16:30-20:00', 'Прогулка по району и ужин', [
      createSection(ActivitySectionType.DESCRIPTION, 'Свободное время для исследования района и ужин в **Super Brand Mall (正大广场)**. Попробуйте **Shanghai Min (小南国)** для аутентичной шанхайской кухни.'),
    ]),
    createActivity('20:30-21:30', 'Вечерняя прогулка по набережной The Bund', [
      createSection(ActivitySectionType.DESCRIPTION, 'Возвращение на другую сторону реки, чтобы насладиться культовым видом на освещенные небоскребы Пудуна. Лучшие фото получаются именно отсюда!'),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250314004632.png']),
    ]),
  ],
)

const day4 = createDay(
  tripChinaId,
  '2025-08-13',
  'Сады, Храмы и Чаи',
  'День погружения в традиционный Китай в самом сердце Шанхая. Мы исследуем классический сад Юй Юань, прогуляемся по отреставрированным кварталам Xintiandi и затеряемся в лабиринте узких улочек Tian Zi Fang.',
  [
    createActivity('10:00-13:00', 'Посещение сада Юй Юань (Yu Garden)', [
      createSection(
        ActivitySectionType.DESCRIPTION,
        'Исследование классического китайского сада династии Мин **(豫园)** с его прудами, павильонами и мостиками. \n\n**Обязательно к посещению:**\n* *Sansui Hall (三穗堂)*\n* *Wanhua Chamber (万花楼)*\n* *Dianchun Hall (点春堂)*',
      ),
      createSection(
        ActivitySectionType.DESCRIPTION,
        '**Бронирование:** Настоятельно рекомендуется бронировать билеты заранее, особенно в выходные, через Trip.com или Klook. Цена: ~30-40 CNY.',
      ),
      createSection(ActivitySectionType.GALLERY, [
        '/images/3/20250309004803.png',
        '/images/3/20250309004958.png',
        '/images/3/20250309005052.png',
        '/images/3/20250309005112.png',
        '/images/3/20250309005133.png',
      ]),
    ]),
    createActivity('13:00-14:00', 'Старый город и улица Fangbang', [
      createSection(ActivitySectionType.DESCRIPTION, 'Прогулка мимо Даосского храма городского божества **(上海城隍庙)** по старинной улочке **Fangbang Middle Road (方浜中路)**.'),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250309005739.png', '/images/3/20250309005903.png', '/images/3/20250309010228.png', '/images/3/20250309010246.png']),
    ]),
    createActivity('14:00-16:00', 'Прогулка и обед в Xintiandi', [
      createSection(ActivitySectionType.DESCRIPTION, 'Исследование пешеходного района **(新天地)** с домами "шикумен", где история встречается с современностью. Обед в одном из модных кафе.'),
      createSection(ActivitySectionType.GALLERY, [
        '/images/3/20250309171231.png',
        '/images/3/20250309163606.png',
        '/images/3/20250309163617.png',
        '/images/3/20250309171739.png',
        '/images/3/20250309171818.png',
      ]),
    ]),
    createActivity('16:30-19:00', 'Исследование района Tian Zi Fang', [
      createSection(
        ActivitySectionType.DESCRIPTION,
        'Погружение в лабиринт узких улочек **(田子坊)** бывшей французской концессии, наполненных художественными галереями, крафтовыми магазинами, кафе и чайными домами. \n\n*Ищите:* уникальные сувениры, уличную еду (например, жареные булочки *生煎包*) и многочисленных кошек!',
      ),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250223152330.png', '/images/3/20250309174226.png']),
    ]),
  ],
)

const day5 = createDay(
  tripChinaId,
  '2025-08-14',
  'Древний город (Zhujiajiao Water Town)',
  'Однодневная поездка в Чжуцзяцзяо, "шанхайскую Венецию". Мы будем гулять по старинным улочкам, пересекать каменные мосты, обедать с видом на каналы и наслаждаться аутентичной чайной церемонией.',
  [
    createActivity('09:30-11:30', 'Дорога в Zhujiajiao', [
      createSection(ActivitySectionType.DESCRIPTION, 'Поездка на метро (17 линия) до древнего города на воде **(朱家角)**.'),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250309174651.png']),
    ]),
    createActivity('11:30-13:00', 'Исследование North Street и моста Fangsheng', [
      createSection(ActivitySectionType.DESCRIPTION, 'Прогулка по главной улице **(北大街)** с магазинами и чайными домиками, подъем на самый известный мост **Fangsheng Bridge (放生桥)** для панорамных видов.'),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250309181742.png']),
    ]),
    createActivity('13:00-15:00', 'Прогулка по турзоне и обед', [
      createSection(ActivitySectionType.DESCRIPTION, 'Обед в одном из ресторанов с видом на воду в **Shanghai Zhujiajiao Ancient Town Tourist Zone (上海朱家角古镇旅游区)**.'),
      createSection(ActivitySectionType.GALLERY, [
        '/images/3/20250309175314.png',
        '/images/3/20250309181154.png',
        '/images/3/20250309182313.png',
        '/images/3/20250309175856.png',
        '/images/3/20250309180345.png',
      ]),
    ]),
    createActivity('15:00-16:30', 'Прогулка по секретным переулкам или посещение храма', [
      createSection(
        ActivitySectionType.DESCRIPTION,
        '**Вариант 1 (Переулки):** Откройте для себя **Yujia Lane (郁家弄)** с резными ручками XVIII века и мастерской гончара Mr. Chen.\n\n**Вариант 2 (Храм):** Посетите маленький действующий **Храм городского божества (城隍庙)** недалеко от моста Fangsheng.',
      ),
    ]),
    createActivity('16:30-18:00', 'Чайная церемония в Zhuxi Teahouse', [
      createSection(
        ActivitySectionType.DESCRIPTION,
        'Посещение аутентичного чайного дома **Zhuxi Teahouse (竹溪茶楼)** (Адрес: 92 Xihe Street). \nЗакажите набор «Четыре сезона» (80 RMB) и попробуйте закуску «лунный кролик».',
      ),
    ]),
    createActivity('18:00-19:30', 'Ужин и дегустация рисового вина', [
      createSection(
        ActivitySectionType.DESCRIPTION,
        'Ужин в ресторане **Shui Mian Lou (睡面楼)** со столиками над водой. \n\nПосле этого — дегустация местного рисового вина в лавке **Qian Niang Jiu Fang (前酿酒坊)**.',
      ),
    ]),
  ],
)

const day6 = createDay(
  tripChinaId,
  '2025-08-15',
  'Искусство и Архитектура',
  'Свободный день для отдыха, самостоятельного исследования или повторного посещения наиболее понравившихся мест. Отличная возможность отойти от плотного графика и насладиться городом в собственном темпе.',
  [createActivity('10:00-22:00', 'Свободный день', [createSection(ActivitySectionType.DESCRIPTION, 'Этот день оставлен свободным для того, чтобы вы могли повторить то, что понравилось больше всего, или исследовать что-то новое по своему усмотрению.')])],
)

const day7 = createDay(
  tripChinaId,
  '2025-08-16',
  'Гимн Спокойствию (Suzhou)',
  'Однодневная поездка на скоростном поезде в Сучжоу, "Восточную Венецию". День будет посвящен исследованию шедевров китайского садово-паркового искусства, внесенных в список ЮНЕСКО, и прогулкам по живописным улицам вдоль каналов.',
  [
    createActivity('09:20-10:20', 'Дорога до вокзала и поездка в Сучжоу', [
      createSection(ActivitySectionType.DESCRIPTION, 'Поездка на метро до вокзала **Hongqiao (虹桥火车站)** и 30-минутное путешествие на скоростном поезде.'),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250221144249.png']),
    ]),
    createActivity('11:20-13:00', 'Сад Скромного Чиновника', [
      createSection(ActivitySectionType.DESCRIPTION, 'Самый большой и знаменитый сад Сучжоу **(The Humble Administrator\'s Garden 拙政园)**. Вход: 70 CNY.'),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250221154010.png', '/images/3/20250221154201.png']),
    ]),
    createActivity('11:20-13:00', 'Альтернатива: Сад Львиного Леса', [
      createSection(ActivitySectionType.DESCRIPTION, 'Лабиринт из камней, напоминающих львов, в **Lion Grove Garden (狮子林)**. Вход: 40 CNY.'),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250221154416.png', '/images/3/20250221154551.png', '/images/3/20250221154742.png']),
    ]),
    createActivity('13:00-14:50', 'Прогулка и обед на Pingjiang Road', [
      createSection(ActivitySectionType.DESCRIPTION, 'Прогулка по мощеной исторической улице **Pingjiang Road** с чайными, мастерскими и сувенирными лавками. Обед в местной пельменной.'),
      createSection(ActivitySectionType.GALLERY, [
        '/images/3/20250221155358.png',
        '/images/3/20250221155028.png',
        '/images/3/20250221155103.png',
        '/images/3/20250221170009.png',
        '/images/3/20250221170416.png',
      ]),
    ]),
    createActivity('15:30-17:30', 'Tiger Hill Pagoda (Пагода на Тигрином холме)', [
      createSection(ActivitySectionType.DESCRIPTION, 'Посещение "китайской Пизанской башни" - древней наклонной пагоды **(云岩寺塔)** с богатой историей. \n\n[Видео обзор](https://youtu.be/V69OAJ2gE5E?si=iO74r6JVdQeTRT35)'),
      createSection(ActivitySectionType.GALLERY, [
        '/images/3/20250221164850.png',
        '/images/3/20250221164918.png',
        '/images/3/20250221164947.png',
        '/images/3/20250221171153.png',
        '/images/3/20250221161326.png',
        '/images/3/20250221161351.png',
      ]),
    ]),
    createActivity('17:30-19:42', 'Ужин и возвращение на вокзал', [
      createSection(ActivitySectionType.DESCRIPTION, 'Ужин перед отправлением обратно в Шанхай.'),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250221171445.png']),
    ]),
    createActivity('19:42-20:15', 'Скоростной поезд в Шанхай', [createSection(ActivitySectionType.DESCRIPTION, 'Возвращение в Шанхай.')]),
  ],
)

const day8 = createDay(
  tripChinaId,
  '2025-08-17',
  'Коммерческий мир',
  'День исследования района Сюйцзяхуэй, одного из крупнейших коммерческих центров Шанхая. Мы увидим впечатляющий неоготический собор, а затем переместимся на набережную West Bund — культурный коридор с множеством музеев современного искусства.',
  [
    createActivity('11:00-12:00', 'Собор Сюйцзяхуэй (Xujiahui Cathedral)', [
      createSection(ActivitySectionType.DESCRIPTION, 'Посещение впечатляющего католического собора **(徐家汇天主堂)** в неоготическом стиле.'),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250223220410.png', '/images/3/20250216165042.png']),
    ]),
    createActivity('12:00-12:30', 'Библиотека Xujiahui Origin', [
      createSection(ActivitySectionType.DESCRIPTION, 'Посещение расположенной рядом живописной библиотеки **Xujiahui Origin Scenic Spot (徐家汇源景区)**.'),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250223220711.png', '/images/3/20250223231212.png']),
    ]),
    createActivity('12:30-14:00', 'Обед и шопинг в Metro-City', [
      createSection(ActivitySectionType.DESCRIPTION, 'Обед и прогулка по одному из самых узнаваемых торговых центров района **(美罗城)** с огромным шаром на крыше.'),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250223231820.png', '/images/3/20250223161225.png', '/images/3/20250223232114.png']),
    ]),
    createActivity('14:00-16:30', 'Прогулка по набережной Xuhui Riverside', [
      createSection(
        ActivitySectionType.DESCRIPTION,
        'Исследование **West Bund (西岸)** — зоны с музеями современного искусства и арт-объектами:\n\n*   **Long Museum West Bund (龙美术馆西岸馆)**\n*   **Yuz Museum (余德耀美术馆)**\n*   **Tank Shanghai (油罐艺术中心)**',
      ),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250223233156.png', '/images/3/20250216022953.png']),
    ]),
    createActivity('16:50-18:40', 'World Expo Cultural Park', [
      createSection(ActivitySectionType.DESCRIPTION, 'Прогулка по огромному парку **(世博文化公园)**, созданному на месте проведения Expo 2010.'),
      createSection(ActivitySectionType.GALLERY, [
        '/images/3/20250223233629.png',
        '/images/3/20250223202038.png',
        '/images/3/20250223234549.png',
        '/images/3/20250223233825.png',
        '/images/3/20250223202226.png',
      ]),
    ]),
    createActivity('18:40-20:30', 'Ужин в The River Mall и вид на China Art Museum', [
      createSection(ActivitySectionType.DESCRIPTION, 'Ужин в ТЦ **The River Mall (世博源)** и наслаждение ночным видом на подсвеченный **Дворец искусств Китая (中华艺术宫)** (бывший павильон Китая).'),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250223235116.png', '/images/3/20250223202356.png', '/images/3/20250505090216.png', '/images/3/20250505090316.png']),
    ]),
  ],
)

const day9 = createDay(
  tripChinaId,
  '2025-08-18',
  'Культурный шок',
  'День отдыха и культурных развлечений. После свободного времени днем, вечер будет посвящен уникальному театрализованному представлению с ужином, а после — исследованию ночной жизни Шанхая в одном из популярных баров или клубов.',
  [
    createActivity('10:00-16:00', 'Свободное время', [createSection(ActivitySectionType.DESCRIPTION, 'Время для отдыха или самостоятельных прогулок.')]),
    createActivity('16:00-20:00', 'Представление в XUYAN Shanghai Signature Store', [
      createSection(
        ActivitySectionType.DESCRIPTION,
        'Погружение в китайскую культуру через театральное представление **(XUYAN)**, совмещенное с ужином и напитками. \n\n*Цена:* ~400 CNY. [Забронировать на Trip.com](https://us.trip.com/travel-guide/attraction/shanghai/xuyan-145736045/?locale=en-XX&curr=CNY)',
      ),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250311220840.png']),
    ]),
    createActivity('20:00-23:00', 'Посещение бара / клуба', [
      createSection(
        ActivitySectionType.DESCRIPTION,
        'Знакомство с ночной жизнью Шанхая. \n\n| Название | Примечания |\n| :--- | :--- |\n| **Dada** | Классика, недорогие напитки. |\n| **Celia by Pulse** | Техно и хаус до утра. |\n| **Bar Rogue** | Популярный клуб на набережной. |\n| **M1NT** | Премиум-клуб с панорамным видом и аквариумом с акулами. |\n\nБольше вариантов: [smartshanghai](https://www.smartshanghai.com/)',
      ),
    ]),
  ],
)

const day10 = createDay(
  tripChinaId,
  '2025-08-19',
  'Приход в чувства',
  'Свободный день для восстановления сил после насыщенной недели. Можно выспаться, неспешно прогуляться по городу, вернуться в любимые места или открыть для себя что-то совершенно новое, не придерживаясь плана.',
  [createActivity('10:00-22:00', 'Свободный день', [createSection(ActivitySectionType.DESCRIPTION, 'Этот день оставлен свободным для того, чтобы вы могли отдохнуть, восстановиться и подготовиться к следующему этапу путешествия.')])],
)

const day11 = createDay(
  tripChinaId,
  '2025-08-20',
  'Небесный Рай (Hangzhou)',
  'Однодневная поездка в Ханчжоу, который Марко Поло называл "самым прекрасным городом в мире". Мы совершим прогулку по живописному озеру Сиху, посетим знаменитый буддийский храм Линъинь и продегустируем один из лучших чаев Китая, Лунцзин, прямо на плантациях.',
  [
    createActivity('09:00-11:00', 'Дорога до вокзала и поездка в Ханчжоу', [
      createSection(ActivitySectionType.DESCRIPTION, 'Поездка на метро до вокзала **Hongqiao (虹桥火车站)** и путешествие на скоростном поезде (G-серия).'),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250314010452.png', '/images/3/20250314010555.png', '/images/3/20250314010608.png']),
    ]),
    createActivity('11:30-14:00', 'Прогулка по озеру Сиху (West Lake)', [
      createSection(ActivitySectionType.DESCRIPTION, 'Осмотр озера **(西湖)**, включенного в список Всемирного наследия ЮНЕСКО, и прогулка по дамбе **Су (苏堤)**.'),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250314011414.png', '/images/3/20250314011512.png']),
    ]),
    createActivity('14:30-15:30', 'Посещение храма Линъинь (Lingyin Temple)', [
      createSection(ActivitySectionType.DESCRIPTION, 'Визит в один из самых знаменитых буддийских храмов Китая **(灵隐寺)**, известный своими статуями, вырезанными в скалах. Вход: 45 CNY.'),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250314011957.png', '/images/3/20250314011847.png']),
    ]),
    createActivity('16:30-19:50', 'Посещение чайной деревни и ужин', [
      createSection(
        ActivitySectionType.DESCRIPTION,
        '**Вариант 1: Деревня Мэйцзяу (Meijiawu Tea Village 梅家坞)**\nБолее аутентичная атмосфера, панорамные виды на плантации. Ужин в фермерском ресторане (*农家乐*).\n\n**Вариант 2: Деревня Лунцзин (Longjing Tea Village 龙井村)**\nПрогулка по знаменитым плантациям, дегустация чая "Колодец Дракона" и ужин в ресторане, где готовят блюда с чаем.',
      ),
      createSection(ActivitySectionType.GALLERY, [
        '/images/3/Meijiawu Tea Plantation Path.png',
        '/images/3/Meijiawu Tea Plantation 1.jpg',
        '/images/3/Meijiawu Tea Plantation 2.jpg',
        '/images/3/20250314012046.png',
        '/images/3/20250314012322.png',
      ]),
    ]),
    createActivity('21:21-22:22', 'Возвращение в Шанхай', [createSection(ActivitySectionType.DESCRIPTION, 'Поездка на скоростном поезде обратно в Шанхай.')]),
  ],
)

const day12 = createDay(
  tripChinaId,
  '2025-08-21',
  'Побег',
  'День отъезда из Шанхая. После завтрака и сборов у нас будет немного свободного времени для последней прогулки перед отправлением в аэропорт Пудун для вылета в следующую точку нашего путешествия.',
  [
    createActivity('09:30-11:00', 'Завтрак и выселение из отеля', [
      createSection(ActivitySectionType.DESCRIPTION, 'Собираем вещи, выселяемся из отеля. Можно попросить оставить багаж на ресепшене, если планируете еще погулять.'),
    ]),
    createActivity('11:00-13:00', 'Прощальная прогулка', [createSection(ActivitySectionType.DESCRIPTION, 'Свободное время для покупки сувениров или прогулки.')]),
    createActivity('14:00-17:05', 'Дорога в аэропорт и вылет', [createSection(ActivitySectionType.DESCRIPTION, 'Прибытие в Аэропорт Пудун (PVG) за 3 часа до вылета, регистрация на рейс и вылет.')]),
  ],
)

const day13 = createDay(
  tripChinaId,
  '2025-08-22',
  'На распутье (Урумчи)',
  'После ночного прилета в Урумчи и короткого отдыха, мы отправимся в однодневную поездку к жемчужине Тянь-Шанских гор — Небесному озеру (Тяньчи). Нас ждут потрясающие виды высокогорного озера в окружении заснеженных пиков.',
  [
    createActivity('00:20-01:30', 'Прилет в Урумчи и заселение в отель', [
      createSection(ActivitySectionType.DESCRIPTION, 'Ночное прибытие, трансфер на такси и заселение в **Atour Hotel (乌鲁木齐北京南路中营工地铁站亚朵酒店)**. [Отель на карте](https://j.map.baidu.com/10/dMWg)'),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250506095740.png', '/images/3/0206a12000990mnse338F_W_1280_853_R5.webp', '/images/3/0206112000990n39g16CC_W_1280_853_R5.webp']),
    ]),
    createActivity('09:30-12:30', 'Поездка до Национального парка Тяньшань Тяньчи', [
      createSection(
        ActivitySectionType.DESCRIPTION,
        'Дорога до **Международного автовокзала Урумчи Гаоте (乌鲁木齐高铁国际汽车客运站)**. \n\nТам нужно купить билет на туристический автобус до **Тяньчи (天山天池)**. Поездка на автобусе займет около 1.5 часов.',
      ),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250506100018.png', '/images/3/202505031601413.png', '/images/3/unnamed.jpg']),
    ]),
    createActivity('12:30-17:00', 'Исследование Небесного озера (Тяньчи)', [
      createSection(
        ActivitySectionType.DESCRIPTION,
        'Поездка на шаттле до озера. \n\n**Возможные активности:**\n*   Прогулка по дорожкам\n*   Поездка на лодке (за доп. плату)\n*   Посещение даосского храма на берегу\n*   Обед в кафе на территории.',
      ),
      createSection(ActivitySectionType.GALLERY, ['/images/3/tianchi2.jpg', '/images/3/depositphotos_139790534-stock-photo-xinjiang-china-may-09-2015.webp']),
    ]),
    createActivity('17:00-19:00', 'Возвращение в Урумчи', [
      createSection(ActivitySectionType.DESCRIPTION, 'Поездка на автобусе обратно в город. \n\n**Важно:** Уточните время отправления последнего автобуса при покупке билета! Обычно последние рейсы около 17:30-18:30.'),
    ]),
    createActivity('19:00-21:30', 'Вечерняя прогулка и ужин', [
      createSection(ActivitySectionType.DESCRIPTION, 'Прогулка по парку **Liyu Mountain Park (鲤鱼山公园)** напротив отеля и ужин в одном из местных ресторанов.'),
      createSection(ActivitySectionType.GALLERY, ['/images/3/B62a46a9b9ffe8860d.jpeg']),
    ]),
  ],
)

const day14 = createDay(
  tripChinaId,
  '2025-08-23',
  'По базарам (Урумчи)',
  'Последний день нашего путешествия. Мы познакомимся с Урумчи: поднимемся на Красную гору для панорамного вида на город, прогуляемся по паркам и окунемся в атмосферу знаменитого Международного Большого Базара.',
  [
    createActivity('09:00-10:00', 'Завтрак и выселение', [
      createSection(ActivitySectionType.DESCRIPTION, 'Позавтракать, собрать вещи и оставить их на хранение в отеле. \n\n*Фраза для ресепшена:* "Можно оставить багаж?" (可以寄存行李吗? - Kěyǐ jìcún xínglǐ ma?).'),
    ]),
    createActivity('10:30-11:30', 'Парк "Красная гора" (Hongshan Park)', [
      createSection(ActivitySectionType.DESCRIPTION, 'Осмотр парка **(红山公园)** и подъем на пагоду для панорамного вида на город.'),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250226210917.png', '/images/3/20250226211046.png', '/images/3/20250226211112.png']),
    ]),
    createActivity('11:30-12:30', 'Народный парк (People\'s Park)', [
      createSection(ActivitySectionType.DESCRIPTION, 'Прогулка по зеленому оазису в центре города **(乌鲁木齐人民公园)**.'),
      createSection(ActivitySectionType.GALLERY, ['/images/3/20250226211533.png', '/images/3/20250226211619.png', '/images/3/20250226212040.png']),
    ]),
    createActivity('12:30-15:30', 'Обед и Большой Международный Базар', [
      createSection(
        ActivitySectionType.DESCRIPTION,
        'Обед по пути и исследование знаменитого **International Grand Bazaar (国际大巴扎)**. \n\nДо базара можно доехать на метро (станция **Erdaoqiao / 二道桥**). Осмотр архитектуры, мечети и сувенирных лавок.',
      ),
      createSection(ActivitySectionType.GALLERY, [
        '/images/3/20250226212249.png',
        '/images/3/20250226213252.png',
        '/images/3/20250226214429.png',
        '/images/3/20250226214848.png',
        '/images/3/20250226214829.png',
        '/images/3/20250226215018.png',
      ]),
    ]),
    createActivity('15:30-20:00', 'Возвращение за багажом и вылет', [
      createSection(
        ActivitySectionType.DESCRIPTION,
        '**План действий:**\n1.  На метро от Базара доехать до станции отеля (**Zhongyinggong / 中营工**).\n2.  Забрать багаж из отеля.\n3.  Заказать такси до аэропорта (URC) и вылететь домой.',
      ),
    ]),
  ],
)

export const MOCK_CHINA_DAYS = [
  day1,
  day2,
  day3,
  day4,
  day5,
  day6,
  day7,
  day8,
  day9,
  day10,
  day11,
  day12,
  day13,
  day14,
]
