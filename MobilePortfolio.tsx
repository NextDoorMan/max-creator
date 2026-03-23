import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { soundEffects, audioManager } from '../../utils/audioManager';
import { CachedImage } from '../CachedImage';
import { AudioToggle } from './AudioToggle';
import { MobileProjectModal } from './MobileProjectModal';
import MobileDialogue from './MobileDialogue';

interface MobilePortfolioProps {
  onBack: () => void;
}

type Genre = 'ALL' | 'ACTION' | 'ADVENTURE' | 'RPG' | 'SHOOTER' | 'ARCADE';

interface Project {
  id: number;
  title: string;
  subline?: string;
  genre: Genre;
  coverImg: string;
  glowColor: string;
  description: string;
  tags?: string[];
  videoUrl?: string;
  contentBlocks?: { type: 'text' | 'video' | 'header' | 'images' | 'infoboxes'; content: string | string[] }[];
}

interface DialogueState {
  text: string;
  heroId: string;
  isVisible: boolean;
}

const heroes: Record<string, { portrait: string }> = {
  mudborya: {
    portrait: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490572/%D0%9C%D1%83%D0%B4%D0%B1%D0%BE%D1%80%D1%8F_%D0%BF%D0%BE%D1%80%D1%82%D1%80%D0%B5%D1%82_yakafm.png'
  },
  smmario: {
    portrait: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490571/SMM%D0%B0%D1%80%D0%B8%D0%BE_%D0%BF%D0%BE%D1%80%D1%82%D1%80%D0%B5%D1%82_jfrqki.png'
  },
  brendinho: {
    portrait: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490571/%D0%91%D1%80%D0%B5%D0%BD%D0%B4%D0%B8%D0%BD%D1%8C%D0%BE_%D0%BF%D0%BE%D1%80%D1%82%D1%80%D0%B5%D1%82_b3cxqq.png'
  }
};

const projects: Project[] = [
  {
    id: 1,
    title: 'ЯСНО СОЛНЫШКО',
    subline: 'Сделай своё утро добрым',
    genre: 'ARCADE',
    coverImg: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1772372405/%D0%AF%D1%81%D0%BD%D0%BE_%D0%A1%D0%BE%D0%BB%D0%BD%D1%8B%D1%88%D0%BA%D0%BE_mobile_epq5lp.png',
    glowColor: '#FFE600',
    description: '',
    tags: ['ролики'],
    contentBlocks: [
      { type: 'header', content: 'УТРО ДОБРЫМ НЕ БЫВАЕТ?' },
      { type: 'text', content: 'Каша от «Ясно солнышко» помогла создать семейную идиллию утром, даже когда вокруг царит полный хаос.' },
      { type: 'video', content: 'https://vimeo.com/1164824372' },
      { type: 'text', content: 'Кран потек, тостер сгорел, собака порвала диван, окно разбил мяч, прилетевший с улицы, а стену сломали рабочие во время ремонта соседней квартиры.<br /><br />Но даже это не смогло испортить «доброе» утро.<br /><br />А уж что происходило на съемках...Но это уже другая история.' }
    ]
  },
  {
    id: 2,
    title: 'FLASH UP',
    subline: 'Для тех, кто готов сиять',
    genre: 'ACTION',
    coverImg: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1772372393/Flash_Up_mobile_l7aruj.png',
    glowColor: '#FF1493',
    tags: ['ролики', 'креативная стратегия'],
    contentBlocks: [
      { type: 'text', content: 'У каждого наступает тот самый момент, когда пора проявить себя на полную.<br /><br />И здесь нужна энергия, которая поможет зарядиться на новый уровень.' },
      { type: 'video', content: 'https://vimeo.com/1164824331' },
      { type: 'text', content: 'Зарядиться, чтобы сиять.' }
      ]
  },
  {
    id: 3,
    title: 'HOLSTEN',
    subline: 'Легенда о том самом рыцаре',
    genre: 'RPG',
    coverImg: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1772372393/Holsten_mobile_e8irrr.png',
    glowColor: '#00FF00',
    description: '',
    tags: ['ролики', 'BIG IDEA'],
    contentBlocks: [
      { type: 'infoboxes', content: JSON.stringify([
        { header: 'ЕСТЬ, ЧЕМ ГОРДИТЬСЯ', line: 'Holsten – это традиции пивоварения, восходящие к эпохе рыцарей!', color: 'yellow', increasedPadding: true },
        { header: 'КАК РАССКАЖЕМ?', line: 'Легендарному качеству – легендарная история.<br />С рыцарями, замками и немецким характером', color: 'pink', increasedPadding: true }
      ]) },
      { type: 'video', content: 'https://vimeo.com/1164824355' }
    ]
  },
  {
    id: 4,
    title: 'NERF PROКАЧКА',
    subline: 'Нерфинг выходит на улицы!',
    genre: 'SHOOTER',
    coverImg: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1772372393/NERF_mobile_tkynbx.png',
    glowColor: '#FF6600',
    description: '',
    tags: ['ролики', 'спецпроекты', 'нейминг'],
    contentBlocks: [
      { type: 'infoboxes', content: JSON.stringify([
        { header: 'КОНТЕКСТ', line: 'Оглушительный успех 1го сезона NERF-PROкачки и рост популярности нёрфинга – игр с бластерами NERF', color: 'pink' },
        { header: 'НОВОЕ ЯВЛЕНИЕ', line: 'Нёрфинг превращается в полноценный спорт и образ жизни', color: 'cyan' },
        { header: 'А ЗНАЧИТ...', line: 'Выход нёрфинга за пределы домашних игр – это вопрос времени', color: 'yellow' }
      ]) },
      { type: 'text', content: 'Чтобы нёрфинг вышел на улицы, в сети вышел второй сезон NERF-PROкачки.' },
      { type: 'video', content: 'https://vimeo.com/1164824167' },
      { type: 'infoboxes', content: JSON.stringify([
        { header: 'В ГЛАВНОЙ РОЛИ...', line: 'Новые герои!<br />PRO-нёрферы и куча бластеров NERF', color: 'green', increasedPadding: true },
        { header: 'О ЧЕМ СЕЗОН', line: 'О бластерах, конечно!<br />И о том, как круто нёрфить на глазах у всего двора', color: 'pink', increasedPadding: true }
      ]) },
      { type: 'video', content: 'https://vimeo.com/1165156369' },
      { type: 'infoboxes', content: JSON.stringify([
        { header: 'ФИШКА СЕЗОНА', line: 'Куча новых бластеров и дисциплин для уличного нёрфинга', color: 'yellow' },
        { header: 'ВОВЛЕЧЕНИЕ ЦА', line: 'Вступление в комьюнити.<br />Система прокачки навыков.<br />Новые ачивки.<br />Рейтинги и розыгрыши', color: 'cyan' },
        { header: 'НЁРФИНГ В МАССЫ!', line: 'Некогда обычная игра стала образом жизни целого поколения', color: 'pink' }
      ]) },
      { type: 'video', content: 'https://vimeo.com/1164824144' }
    ]
  },
  {
    id: 5,
    title: 'LAVINA',
    subline: 'Энергия, которая сносит преграды',
    genre: 'ACTION',
    coverImg: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1772372393/Lavina_mobile_jvg3ce.png',
    glowColor: '#D81B60',
    tags: ['ролики', 'BIG IDEA'],
    contentBlocks: [
      { type: 'video', content: 'https://vimeo.com/1164800579' },
      { type: 'text', content: 'Когда ты заряжен энергией Лавины, ты не бежишь от преград.<br /><br />Ты их сносишь.' }
      ]
  },
  {
    id: 6,
    title: 'ТРАНСФОРМЕРЫ: ПОРТАЛ',
    subline: 'Настоящий анимационный сериал',
    genre: 'RPG',
    coverImg: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1772372394/Transformers_mobile_f7wioo.png',
    glowColor: '#0070DD',
    description: '',
    tags: ['ролики', 'спецпроекты', 'digital'],
    contentBlocks: [
      { type: 'header', content: 'ЭПИЧНЫЙ. МУЛЬТИКАНАЛЬНЫЙ. АНИМАЦИОННЫЙ.' },
      { type: 'infoboxes', content: JSON.stringify([
        { header: 'ЗАЧЕМ?', line: 'Стимулировать аудиторию покупать и коллекционировать Трансформеров!', color: 'green', increasedPadding: true },
        { header: 'КАК?', line: 'Мега-проект от Hasbro Russia, в центре которого – анимированный комикс с увлекательной историей и кучей экшна', color: 'yellow', increasedPadding: true },
        { header: 'МАСШТАБ', line: '8 сюжетных роликов.<br />Продуктовые выпуски.<br />Демонстрация всей линейки.<br />Работа с аудиторией', color: 'blue', increasedPadding: true }
      ]) },
      { type: 'video', content: 'https://vimeo.com/1165179306' },
      { type: 'infoboxes', content: JSON.stringify([
        { header: 'ДЕЙСТВУЮЩИЕ ЛИЦА', line: 'Автоботы, десептиконы...и зрители! Любой мог принять участие в эпических событиях и влиять на ход истории', color: 'pink', increasedPadding: true },
        { header: 'ИДЕЯ', line: 'В мире Трансформеров каждый может быть героем. Каждый может быть больше, чем кажется', color: 'cyan', increasedPadding: true }
      ]) },
      { type: 'text', content: 'В проекте зрители встречаются с загадочным Наблюдателем, который проливает свет на сюжетные вопросы и информирует ЦА об особенностях линеек Трансформеров.' },
      { type: 'video', content: 'https://vimeo.com/1165179248' },
      { type: 'infoboxes', content: JSON.stringify([
        { header: 'РОЛЬ АУДИТОРИИ', line: 'Зрители – такие же герои вселенной Трансформеров: помощники, decision-мейкеры, рассказчики', color: 'yellow' },
        { header: 'ФИШКА ПРОЕКТА', line: 'Активности онлайн и офлайн, которые отразились на развитии сюжета и вдохновили ЦА на покупку игрушек', color: 'green' }
      ]) }
    ]
  },
  {
    id: 7,
    title: 'LITTLEST PET SHOP',
    subline: 'Маленькие герои о больших трендах',
    genre: 'ARCADE',
    coverImg: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1772372393/LPS_mobile_nux90b.png',
    glowColor: '#FF1493',
    description: '',
    tags: ['ролики', 'спецпроекты'],
    contentBlocks: [
      { type: 'text', content: 'Littlest Pet Shop — это культовые мини-игрушки зверей, с которыми можно собрать массу коллекций.<br /><br />А как вдохновить детей собрать их всех? Конечно, показать!' },
      { type: 'video', content: 'https://vimeo.com/1164824202' },
      { type: 'infoboxes', content: JSON.stringify([
        { header: 'ШОУ НАЧИНАЕТСЯ!', line: 'Встречайте: Littlest Pet Show – большой проект с маленькими героями', color: 'cyan', increasedPadding: true },
        { header: 'О ЧЕМ ПЕРЕДАЧА?', line: 'О самых важных трендах и о том, как в них включаться', color: 'pink', increasedPadding: true },
        { header: 'ФИШКА ПРОЕКТА', line: '8 выпусков, огромная масса игрушек LPS и призыв аудитории создавать собственные выпуски.', color: 'green', increasedPadding: true }
      ]) },
      { type: 'header', content: 'БОЛЬШЕ ПЕТОВ – БОЛЬШЕ СЮЖЕТОВ!' },
      { type: 'video', content: 'https://vimeo.com/1164824231' },
      { type: 'text', content: 'В шоу было всё: скандалы, интриги, расследования, и даже выступления пет-группы Pet Shop Band, исполнявшей хит за хитом.' },
      { type: 'video', content: 'https://vimeo.com/1165287577' },
      { type: 'text', content: '<div style="margin-top: 2rem;"><div style="font-size: 1.2rem; color: #00ff00; text-shadow: 0 0 20px rgba(0,255,0,0.8), 0 0 40px rgba(0,255,0,0.4); margin-bottom: 1.5rem; letter-spacing: 0.1em;">РЕЗУЛЬТАТЫ</div><div style="line-height: 2;">• Более 500 тыс. просмотров<br/>• Горы UGC<br/>• Премия Best Practice на портале Hasbro</div></div>' }
    ]
  },
  {
    id: 8,
    title: 'S7 PRIORITY',
    subline: 'Бизнес-комфорт на вершине Эльбруса',
    genre: 'ADVENTURE',
    coverImg: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1772372394/S7_Priority_cover_uybucg.png',
    glowColor: '#1EFF00',
    description: '',
    tags: ['BTL', 'digital'],
    contentBlocks: [
      { type: 'header', content: 'ГИГАНТСКИЕ КРЕСЛА НА ВЕРШИНЕ ЭЛЬБРУСА? ПОЧЕМУ НЕТ!' },
      { type: 'text', content: 'S7 — это авиабренд, чей комфорт и качество всегда остаются на высоте. Чтобы подчеркнуть это, компания начала устанавливать кресла бизнес-класса в необычных локациях.<br /><br />Например, на вершине Эльбруса.' },
      { type: 'video', content: 'https://vimeo.com/1164831653' },
      { type: 'text', content: 'Компания намерена располагать необычные авиасиденья в разных городах. Среди локаций ― отдельный зал кинотеатра «Москва» (вместе со свежими кинопремьерами и спецсервисом).' },
      { type: 'images', content: ['/assets/S7_top.png', '/assets/S7_chairs.jpg', '/assets/S7_cinema.jpg'] }
    ]
  },
  {
    id: 9,
    title: 'АРТЕК х АВИТО',
    subline: 'Приключения в джунглях технологий',
    genre: 'ADVENTURE',
    coverImg: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1772372394/%D0%90%D1%80%D1%82%D0%B5%D0%BA_mobile_gbgc8b.png',
    glowColor: '#00FFFF',
    description: '',
    tags: ['event', 'SMM'],
    contentBlocks: [
      { type: 'infoboxes', content: JSON.stringify([
        { header: 'ДЕНЬ ТЕХНОЛОГИЙ', line: 'Есть у артековцев славная традиция – праздновать День Технологий', color: 'cyan' },
        { header: 'ВОТ ТАК СОВПАДЕНИЕ!', line: 'В этом году День Технологий и День Рождения Артека выпали на один день!', color: 'yellow' },
        { header: 'АВИТО, ТВОЙ ВЫХОД', line: 'Большому празднику – большое приключение!', color: 'pink' }
      ]) },
      { type: 'header', content: 'ДЖУНГЛИ ЗОВУТ!' },
      { type: 'video', content: 'https://vimeo.com/1164831828' },
      { type: 'infoboxes', content: JSON.stringify([
        { header: 'ДЖУНГЛИ ТЕХНОЛОГИЙ', line: 'Квест-адвенчура от Авито в мир больших технологий', color: 'green', increasedPadding: true },
        { header: 'ТЕХНОСАФАРИ!', line: 'Исследователи Авито помогли ребятам узнать, как устроен мир ИИ и цифровых платформ', color: 'cyan', increasedPadding: true }
      ]) },
      { type: 'images', content: ['https://res.cloudinary.com/djihbhmzz/image/upload/v1771490409/%D0%90%D0%B2%D0%B8%D1%82%D0%BE_%D0%90%D1%80%D1%82%D0%B5%D0%BA_ib0viq.jpg', 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490409/%D0%90%D0%B2%D0%B8%D1%82%D0%BE_%D0%B0%D1%80%D1%82%D0%B5%D0%BA_3_hvgdwl.jpg', 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490408/%D0%90%D0%B2%D0%B8%D1%82%D0%BE_%D0%B0%D1%80%D1%82%D0%B5%D0%BA_4_nt0wd9.jpg'] },
      { type: 'infoboxes', content: JSON.stringify([
        { header: 'КАК ПРОШЛО', line: 'Тысячи артековцев погрузились в мир IT и сложных алгоритмов', color: 'pink' },
        { header: 'ЧТО БЫЛО', line: 'Куча заданий в формате игр и квестов с мощнейшим приключенческим вайбом', color: 'yellow' },
        { header: 'А ЧТО В ИТОГЕ', line: 'Успешное знакомство ЦА с технологиями Авито и ценностями бренда', color: 'green' }
      ]) }
    ]
  },
  { id: 10, title: 'ZATECKY GUS', subline: 'Собирай хорошечные кружки', genre: 'RPG', coverImg: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1772372394/ZG_mobile_nk0qu7.png', glowColor: '#FFE600', description: '', tags: ['ролики', 'промо-акции'], 
  contentBlocks: [
      { type: 'video', content: 'https://vimeo.com/1164824393?fl=pl&fe=cm' } ,
      { type: 'text', content: 'Есть в городе Жатец такая традиция – хорошечно отдыхать на площади Трех Кружек с пивом Жатецкий Гусь Безалкогольное.<br /><br />Так почему бы за это не выигрывать особенно хорошечные призы?' }
    ] } ,
  {
    id: 11,
    title: 'S7 РЕЙС',
    subline: 'Иркутск-Краснодар',
    genre: 'ACTION',
    coverImg: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1772372394/S7_flight_mobile_i0fvgf.png',
    glowColor: '#1EFF00',
    tags: ['наружная реклама'],
    contentBlocks: [
      { type: 'text', content: 'В рамках тендера на вход в пул подрядчиков предложили несколько вариантов наружки для рейса Иркутск – Краснодар' },
      { type: 'images', content: ['https://res.cloudinary.com/djihbhmzz/image/upload/v1771490268/S7_%D1%80%D0%B5%D0%B9%D1%81_2_1_mkkp3q.png', 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490269/s7_%D1%80%D0%B5%D0%B9%D1%81_new_teh76k.png', 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490269/s7_%D1%80%D0%B5%D0%B9%D1%81_3_cn2vny.png'] },
      { type: 'header', content: 'РЕЗУЛЬТАТ' },
      { type: 'text', content: 'Попадание в пул подрядчиков' }
    ]
  },
  {
    id: 12,
    title: '5 ОЗЕР',
    subline: 'Ролик для Германии',
    genre: 'ARCADE',
    coverImg: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1772392006/5lakes_mobile_1_mzxupo.png',
    glowColor: '#0070DD',
    tags: ['ролики', 'креативная стратегия'],
    contentBlocks: [
      { type: 'text', content: 'Специальный ролик, приуроченный к выходу легендарной водки на немецкий рынок.'},
      { type: 'video', content: 'https://vimeo.com/1164831424' },
      { type: 'text', content: 'В основу ролика лег прием игры образов, символов Сибири, зеркально отражающихся в нашей жизни: через звук, свет, ощущения.<br /><br />Те признаки, что скрыты глубоко в каждом из нас – осталось только разбудить их.'}
      ] 
  },
  {
    id: 13,
    title: 'ВТБ',
    subline: 'Продуктовые ролики',
    genre: 'RPG',
    coverImg: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1772469514/%D0%92%D0%A2%D0%91_Mobile_m6mry1.png',
    glowColor: '#0070DD',
    description: 'Cняли серию роликов о преимуществах продуктов ВТБ',
    tags: ['продуктовые ролики'],
    contentBlocks: [
      { type: 'video', content: 'https://vimeo.com/1164824292' },
      { type: 'video', content: 'https://vimeo.com/1164824312' }
    ]
  },
  {
    id: 14,
    title: 'БАЛТИКА 0%',
    subline: 'Ощути совершенство вкуса',
    genre: 'ARCADE',
    coverImg: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1772392006/baltika_mobile_1_y0t2dy.png',
    glowColor: '#0070DD',
    description: '',
    tags: ['ролики'],
    contentBlocks: [
      { type: 'video', content: 'https://vimeo.com/1164824267' },
      { type: 'text', content: 'Ощути совершенство вкуса' }
    ]
  },
  {
    id: 15,
    title: 'АВИТО: ВСЕ ПРОЗРАЧНО',
    subline: 'Когда бренду нечего скрывать',
    genre: 'RPG',
    coverImg: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1772372394/%D0%90%D0%B2%D0%B8%D1%82%D0%BE_mobile_azr8x5.png',
    glowColor: '#1EFF00',
    description: '',
    tags: ['BTL', 'digital'],
    contentBlocks: [
      { type: 'text', content: 'Иногда самые очевидные решения – самые эффективные.<br /><br />Рассказали о прозрачности и надежности Авито наглядно: запустили по городам грузовик, символизирующий безопасность доставки.' },
      { type: 'video', content: 'https://vimeo.com/1164831674' },
      { type: 'infoboxes', content: JSON.stringify([
        { header: 'ЧТО', line: 'Траки с прозрачным кузовом и товарами Авито', color: 'cyan', increasedPadding: true },
        { header: 'ГДЕ ЗАМЕЧЕНЫ', line: 'В Омске, Красноярске, Екб и других городах', color: 'yellow', increasedPadding: true },
        { header: 'ЭФФЕКТ', line: 'Активное обсуждение в соцсетях и освещение в местных СМИ', color: 'green', increasedPadding: true }
      ]) },
      { type: 'video', content: 'https://vimeo.com/1165285188' },
      { type: 'text', content: 'Коммуникация лишний раз напомнила: надежность – это когда нечего скрывать.' }
    ]
  },
  {
    id: 16,
    title: 'NUTRILITE',
    subline: 'Доверие от самого зернышка',
    genre: 'ADVENTURE',
    coverImg: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1772469512/Nutrilite_mobile_pmeox3.png',
    glowColor: '#8A2BE2',
    description: '',
    tags: ['SMM', 'спецпроекты', 'digital'],
    contentBlocks: [
      { type: 'text', content: 'Чистота, безопасность, эффективность – три столпа качества Nutrilite, о которых компания решила рассказать в большой кампании «Прослеживаемость».' },
      { type: 'video', content: 'https://vimeo.com/1164924649' },
      { type: 'video', content: 'https://vimeo.com/1164924639' },
      { type: 'text', content: 'В рамках кампании была разработана целая серия роликов, а также уникальный визуальный стиль и масса рекламных материалов.' },
      { type: 'video', content: 'https://vimeo.com/1164924629' }
    ]
  },
];

const MobilePortfolio = ({ onBack }: MobilePortfolioProps) => {
  const [selectedGenre, setSelectedGenre] = useState<Genre>('ALL');
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const [japaneseText, setJapaneseText] = useState('最高傑作');
  const [displayText, setDisplayText] = useState('最高傑作');
  const [isScrambling, setIsScrambling] = useState(false);
  const [showScrollDown, setShowScrollDown] = useState(true);
  const [scrollFadeOut, setScrollFadeOut] = useState(false);
  const [dialogue, setDialogue] = useState<DialogueState | null>(null);
  const [hasShownDialogueLoop, setHasShownDialogueLoop] = useState(false);
  const dialogueTimerRef = useRef<number | null>(null);
  const backgroundTimersRef = useRef<number[]>([]);
  const dialogueAudioRef = useRef<HTMLAudioElement | null>(null);

  const genres: Genre[] = ['ALL', 'ACTION', 'ADVENTURE', 'RPG', 'SHOOTER', 'ARCADE'];
  const japaneseWords = ['最高傑作', 'クリエイティブ', '未来', '電脳'];
  const scrambleChars = ['█', '▓', '▒', '░', '■', '□', '▪', '▫', '◆', '◇', '●', '○'];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsScrambling(true);
      const nextIndex = (japaneseWords.indexOf(japaneseText) + 1) % japaneseWords.length;
      const nextWord = japaneseWords[nextIndex];

      let scrambleCount = 0;
      const scrambleInterval = setInterval(() => {
        setDisplayText(nextWord.split('').map(() =>
          scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
        ).join(''));

        scrambleCount++;
        if (scrambleCount >= 3) {
          clearInterval(scrambleInterval);
          setDisplayText(nextWord);
          setJapaneseText(nextWord);
          setIsScrambling(false);
        }
      }, 60);
    }, 2500);

    return () => clearInterval(interval);
  }, [japaneseText]);

  useEffect(() => {
    if (!audioManager.getMuted()) {
      try {
        dialogueAudioRef.current = new Audio('https://res.cloudinary.com/djihbhmzz/video/upload/v1771488777/%D0%A0%D0%B5%D0%BF%D0%BB%D0%B8%D0%BA%D0%B0_%D0%B2_%D1%80%D0%B0%D0%BD%D0%BD%D0%B5%D1%80%D0%B5_nymdvj.mp3');
        dialogueAudioRef.current.volume = 1.0;
        dialogueAudioRef.current.load();
      } catch (err) {
        console.warn('Failed to preload dialogue sound:', err);
      }
    }

    return () => {
      if (dialogueAudioRef.current) {
        dialogueAudioRef.current.pause();
        dialogueAudioRef.current = null;
      }
    };
  }, []);

  const showDialogue = (text: string, heroId: string, duration: number = 4000) => {
    if (dialogueTimerRef.current) {
      clearTimeout(dialogueTimerRef.current);
    }

    setDialogue({ text, heroId, isVisible: true });

    if (!audioManager.getMuted() && dialogueAudioRef.current) {
      try {
        dialogueAudioRef.current.currentTime = 0;
        dialogueAudioRef.current.play().catch(err => console.warn('Failed to play dialogue sound:', err));
      } catch (err) {
        console.warn('Failed to play dialogue sound:', err);
      }
    }

    dialogueTimerRef.current = window.setTimeout(() => {
      setDialogue(null);
    }, duration);
  };

  useEffect(() => {
    if (!hasShownDialogueLoop && !openProject) {
      setHasShownDialogueLoop(true);

      const timer1 = window.setTimeout(() => {
        if (!openProject) {
          showDialogue('Почему у копира никто не спрашивает, как дела?', 'smmario', 4000);
        }
      }, 3000);

      const timer2 = window.setTimeout(() => {
        if (!openProject) {
          showDialogue('Потому что у него всё на лице НАПИСАНО! ХА-ХА-ХА', 'mudborya', 4000);
        }
      }, 9000);

      backgroundTimersRef.current = [timer1, timer2];
    }

    if (openProject) {
      const projectsWithDialogue = ['FLASH UP', 'NERF PROКАЧКА', 'LITTLEST PET SHOP', 'S7 PRIORITY', '5 ОЗЕР', 'ЯСНО СОЛНЫШКО'];
      const hasDialogue = projectsWithDialogue.includes(openProject.title);

      if (hasDialogue) {
        backgroundTimersRef.current.forEach(timer => clearTimeout(timer));
        backgroundTimersRef.current = [];

        if (dialogueTimerRef.current) {
          clearTimeout(dialogueTimerRef.current);
        }
        setDialogue(null);
      }
    }
  }, [hasShownDialogueLoop, openProject]);

  useEffect(() => {
    return () => {
      backgroundTimersRef.current.forEach(timer => clearTimeout(timer));
      if (dialogueTimerRef.current) {
        clearTimeout(dialogueTimerRef.current);
      }
    };
  }, []);

  const filteredProjects = selectedGenre === 'ALL'
    ? projects
    : projects.filter(p => p.genre === selectedGenre);

  useEffect(() => {
    if (selectedGenre === 'ALL') {
      setShowScrollDown(true);
      setScrollFadeOut(false);

      setTimeout(() => {
        setScrollFadeOut(true);
      }, 3000);

      setTimeout(() => {
        setShowScrollDown(false);
      }, 4000);
    } else {
      setShowScrollDown(false);
    }
  }, [selectedGenre]);

  const handleGenreClick = (genre: Genre) => {
    try {
      const audio = new Audio('https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0_oztdlq.mp3');
      audio.volume = audioManager.getMuted() ? 0 : 0.6;
      audio.play().catch(err => console.warn('Failed to play button sound:', err));
    } catch (err) {
      console.warn('Failed to create button sound:', err);
    }
    setSelectedGenre(genre);
  };

  const handleBackClick = () => {
    try {
      const audio = new Audio('https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0_oztdlq.mp3');
      audio.volume = audioManager.getMuted() ? 0 : 0.6;
      audio.play().catch(err => console.warn('Failed to play button sound:', err));
    } catch (err) {
      console.warn('Failed to create button sound:', err);
    }
    onBack();
  };

  return (
    <motion.div
      key={openProject ? 'hidden' : 'visible'}
      initial={{ opacity: openProject ? 1 : 0, x: openProject ? 0 : -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="mobile-starfield-background h-screen w-full relative overflow-y-scroll flex flex-col"
    >
      <div className="mobile-crt-overlay" />

      <div className="mobile-sticky-header px-4 py-2">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 mobile-white-pixel text-xs"
          >
            <ArrowLeft className="w-3 h-3" />
            НАЗАД
          </button>

          <h1 className="mobile-3d-text" style={{ fontSize: '1.455rem' }}>РАБОТЫ</h1>

          <div className="flex-shrink-0">
            <AudioToggle />
          </div>
        </div>
      </div>

      <div className="relative z-10 px-4 pt-20 pb-4 flex-1 flex flex-col">
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => handleGenreClick(genre)}
              className={`px-3 py-2 transition-all ${
                selectedGenre === genre ? 'mobile-genre-tag-active' : 'mobile-genre-tag'
              }`}
              style={{
                fontSize: '10px',
                fontWeight: '400 !important',
                textTransform: 'uppercase',
                imageRendering: 'pixelated',
                letterSpacing: '0.02em'
              }}
            >
              {genre}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 px-2 mb-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onTap={() => {
                try {
                  const audio = new Audio('https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0_oztdlq.mp3');
                  audio.volume = audioManager.getMuted() ? 0 : 0.6;
                  audio.play().catch(err => console.warn('Failed to play button sound:', err));
                } catch (err) {
                  console.warn('Failed to create button sound:', err);
                }
                setActiveProjectId(project.id);
                setTimeout(() => {
                  setActiveProjectId(null);
                  setOpenProject(project);
                }, 200);
              }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-2 cursor-pointer"
              style={{ touchAction: 'pan-y' }}
            >
              <motion.div
                className="w-full relative overflow-hidden"
                animate={{
                  scale: activeProjectId === project.id ? 0.95 : 1,
                }}
                transition={{ duration: 0.1, ease: 'easeOut' }}
                style={{
                  clipPath: 'polygon(0 4px, 4px 4px, 4px 0, calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px))',
                  imageRendering: 'pixelated'
                }}
              >
                <div
                  style={{
                    boxShadow: activeProjectId === project.id ? `0 0 16px ${project.glowColor}, 0 0 32px ${project.glowColor}, inset 0 0 20px ${project.glowColor}` : 'none',
                    transition: 'box-shadow 0.1s',
                  }}
                >
                  <CachedImage
                    src={project.coverImg}
                    alt={project.title}
                    className="w-full h-auto block"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
              </motion.div>
              <div className="text-center leading-tight px-1 flex flex-col items-center gap-1">
                <p
                  style={{
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: '400 !important',
                    textTransform: 'uppercase',
                    imageRendering: 'pixelated',
                    letterSpacing: '0.02em'
                  }}
                >
                  {project.title}
                </p>
                {project.subline && (
                  <p className="mobile-pixel-subline">
                    {project.subline}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {selectedGenre === 'ALL' && showScrollDown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`fixed left-0 right-0 flex justify-center items-center px-4 ${scrollFadeOut ? 'mobile-scroll-fade-out' : ''}`}
            style={{
              bottom: '20vh',
              zIndex: 20,
              pointerEvents: 'none'
            }}
          >
            <div
              className={`px-7 py-4 border-3 bg-black text-white ${!scrollFadeOut ? 'mobile-scroll-indicator' : ''}`}
              style={{
                border: '3px solid #FFFFFF',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '400 !important',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                imageRendering: 'pixelated',
                transform: 'scale(1.2)'
              }}
            >
              SCROLL DOWN
            </div>
          </motion.div>
        )}

        <div className="mt-auto relative">
          <div
            className="pb-6 px-4 text-white mobile-white-pixel-thin"
            style={{
              zIndex: 10,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'nowrap',
              fontSize: '9px',
              gap: '8px'
            }}
          >
            <span className="opacity-70" style={{ whiteSpace: 'nowrap' }}>STATUS: ACTIVE</span>
            <span className="opacity-70" style={{ whiteSpace: 'nowrap' }}>VER: 1.0.86</span>
            <span
              className={`transition-opacity duration-75 ${isScrambling ? 'opacity-60' : 'opacity-70'}`}
              style={{ whiteSpace: 'nowrap' }}
            >
              [{displayText}]
            </span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {openProject && (
          <MobileProjectModal
            key="project-modal"
            project={openProject}
            onClose={() => setOpenProject(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {dialogue?.isVisible && (
          <MobileDialogue
            key="dialogue"
            text={dialogue.text}
            heroPortrait={heroes[dialogue.heroId]?.portrait || ''}
            onComplete={() => setDialogue(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MobilePortfolio;
