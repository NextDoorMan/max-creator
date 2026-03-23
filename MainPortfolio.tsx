import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { RotateCcw, Gamepad2, Save, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import { soundEffects, audioManager } from '../utils/audioManager';
import { audioEngine } from '../utils/webAudioEngine';
import MuteButton from './MuteButton';
import TypewriterText from './TypewriterText';
import DialogueBox from './DialogueBox';
import { heroes } from './HeroSelection';
import ResumeModal from './ResumeModal';
import AboutModal from './AboutModal';
import ContactsModal from './ContactsModal';
import { CachedImage } from './CachedImage';
import { InfoBox } from './InfoBox';
import GlitchText from './GlitchText';

interface MainPortfolioProps {
  heroId: string;
  runnerScore: number;
  onPlayAgain?: () => void;
}

type ViewMode = 'gallery' | 'desktop';
type Genre = 'ALL' | 'ACTION' | 'ADVENTURE' | 'RPG' | 'SHOOTER' | 'ARCADE';

interface Project {
  id: number;
  title: string;
  subline?: string;
  genre: Genre;
  description: string;
  galleryImg?: string;
  iconImg: string;
  hasGallery: boolean;
  tags?: string[];
  videoUrl?: string;
  contentBlocks?: { type: 'text' | 'video' | 'header' | 'images' | 'infoboxes'; content: string | string[] }[];
  instantText?: boolean;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'FLASH UP',
    subline: 'Для тех, кто готов сиять',
    genre: 'ACTION',
    description: 'У каждого наступает тот самый момент, когда нужно проявить себя на полную. И здесь нужна энергия, которая поможет зарядиться на новый уровень.<br />Зарядиться, чтобы сиять.',
    galleryImg: '/assets/gallery/Flash_UP_cover.png',
    iconImg: '/assets/icons/Flash_Up.png',
    hasGallery: true,
    tags: ['ролики', 'креативная стратегия'],
    videoUrl: 'https://vimeo.com/1164824331'
  },
  {
    id: 2,
    title: 'HOLSTEN',
    subline: 'Легенда о том самом рыцаре',
    genre: 'RPG',
    description: '',
    galleryImg: '/assets/gallery/Holsten_cover.png',
    iconImg: '/assets/icons/Holsten.png',
    hasGallery: true,
    tags: ['ролики', 'BIG IDEA'],
    instantText: true,
    contentBlocks: [
      { type: 'infoboxes', content: JSON.stringify([
        { header: 'ЕСТЬ, ЧЕМ ГОРДИТЬСЯ', line: 'Holsten – это традиции пивоварения, восходящие к эпохе рыцарей!', color: 'yellow', increasedPadding: true },
        { header: 'КАК РАССКАЖЕМ?', line: 'Легендарному качеству – легендарная история.<br />С рыцарями, замками и немецким характером', color: 'pink', increasedPadding: true }
      ]) },
      { type: 'video', content: 'https://vimeo.com/1164824355' }
    ]
  },
  {
    id: 3,
    title: 'NERF PROКАЧКА',
    subline: 'Нерфинг выходит на улицы!',
    genre: 'SHOOTER',
    description: '',
    galleryImg: '/assets/gallery/NERF_cover.png',
    iconImg: '/assets/icons/NERF.png',
    hasGallery: true,
    tags: ['ролики', 'спецпроекты', 'нейминг'],
    instantText: true,
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
    id: 4,
    title: 'LITTLEST PET SHOP',
    subline: 'Маленькие герои о больших трендах',
    genre: 'ARCADE',
    description: '',
    galleryImg: '/assets/gallery/LPS_cover.png',
    iconImg: '/assets/icons/Littlest_Pet_Shop.png',
    hasGallery: true,
    tags: ['ролики', 'спецпроекты'],
    instantText: true,
    contentBlocks: [
      { type: 'text', content: 'Littlest Pet Shop — это культовые мини-игрушки зверей, с которыми можно собрать массу коллекций. А как вдохновить детей собрать их всех? Конечно, показать!' },
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
    id: 5,
    title: 'ZATECKY GUS',
    subline: 'Хорошечный отдых на Площади Трех Кружек',
    genre: 'RPG',
    description: 'Есть в городе Жатец такая традиция – хорошечно отдыхать на площади Трех Кружек с пивом Жатецкий Гусь Безалкогольное. Так почему бы за это не выигрывать особенно хорошечные призы?',
    galleryImg: '/assets/gallery/Zatecky_Gus_cover.png',
    iconImg: '/assets/icons/Zatecky_Gus.png',
    hasGallery: true,
    tags: ['ролики', 'промо-акции'],
    videoUrl: 'https://vimeo.com/1164824393'
  },
  {
    id: 6,
    title: 'ЯСНО СОЛНЫШКО',
    subline: 'Сделай своё утро добрым',
    genre: 'ARCADE',
    description: '',
    galleryImg: '/assets/gallery/Ясно_солнышко_cover.png',
    iconImg: '/assets/icons/Ясно_Солнышко.png',
    hasGallery: true,
    tags: ['ролики'],
    instantText: true,
    contentBlocks: [
      { type: 'header', content: 'УТРО ДОБРЫМ НЕ БЫВАЕТ?' },
      { type: 'text', content: 'Каша от «Ясно солнышко» помогла создать семейную идиллию утром, даже когда вокруг царит полный хаос.' },
      { type: 'video', content: 'https://vimeo.com/1164824372' },
      { type: 'text', content: 'Кран потек, тостер сгорел, собака порвала диван, окно разбил мяч, прилетевший с улицы, а стену напротив нечаянно сломали рабочие во время ремонта соседней квартиры. Но даже это не смогло испортить «доброе» утро.<br /><br />А уж что происходило на съемках...Но это уже другая история.' }
    ]
  },
  {
    id: 7,
    title: 'LAVINA',
    subline: 'Энергия, которая сносит преграды',
    genre: 'ACTION',
    description: 'Когда ты заряжен энергией Лавины, ты не боишься преград. Ты их сносишь.',
    galleryImg: '/assets/gallery/Lavina_cover.png',
    iconImg: '/assets/icons/Lavina.png',
    hasGallery: true,
    tags: ['ролики', 'BIG IDEA'],
    videoUrl: 'https://vimeo.com/1164800579'
  },
  {
    id: 8,
    title: 'S7 PRIORITY',
    subline: 'Бизнес-комфорт на вершине Эльбруса',
    genre: 'ADVENTURE',
    description: '',
    galleryImg: '/assets/gallery/S7_Priority_cover.png',
    iconImg: '/assets/icons/S7_Priority.png',
    hasGallery: true,
    tags: ['BTL', 'digital'],
    instantText: true,
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
    title: 'ТРАНСФОРМЕРЫ: ПОРТАЛ',
    subline: 'Настоящий анимационный сериал',
    genre: 'RPG',
    description: '',
    galleryImg: '/assets/gallery/Transformers_cover.png',
    iconImg: '/assets/icons/Transformers.png',
    hasGallery: true,
    tags: ['ролики', 'спецпроекты', 'digital'],
    instantText: true,
    contentBlocks: [
      { type: 'header', content: 'ЭПИЧНЫЙ. МУЛЬТИКАНАЛЬНЫЙ. АНИМАЦИОННЫЙ.' },
      { type: 'infoboxes', content: JSON.stringify([
        { header: 'ЗАЧЕМ?', line: 'Стимулировать аудиторию покупать и коллекционировать Трансформеров!', color: 'green', increasedPadding: true },
        { header: 'КАК?', line: 'Мега-проект от Hasbro Russia, в центре которого – анимированный комикс с увлекательной историей и кучей экшна', color: 'yellow', increasedPadding: true },
        { header: 'МАСШТАБ', line: '8 сюжетных роликов.<br />Продуктовые выпуски.<br />Демонстрация всей линейки.<br />Работа с аудиторией', color: 'cyan', increasedPadding: true }
      ]) },
      { type: 'video', content: 'https://vimeo.com/1165179306' },
      { type: 'infoboxes', content: JSON.stringify([
        { header: 'ДЕЙСТВУЮЩИЕ ЛИЦА', line: 'Автоботы, десептиконы...и зрители! Любой мог принять участие в эпических событиях и влиять на ход истории', color: 'pink', increasedPadding: true },
        { header: 'ИДЕЯ', line: 'В мире Трансформеров каждый может быть героем. Каждый может быть больше, чем кажется', color: 'cyan', increasedPadding: true }
      ]) },
      { type: 'text', content: 'В проекте зрители встречаются с загадочным Наблюдателем, который проливает свет на сюжетные вопросы и информирует ЦА об особенностях линеек Трансформеров.' },
      { type: 'video', content: 'https://vimeo.com/1165179248' },
      { type: 'infoboxes', content: JSON.stringify([
        { header: 'РОЛЬ АУДИТОРИИ', line: 'Зрители – такие же герои вселенной Трансформеров: помощники, decision-мейкеры, рассказчики', color: 'yellow', increasedPadding: true },
        { header: 'ФИШКА ПРОЕКТА', line: 'Активности онлайн и офлайн, которые отразились на развитии сюжета и вдохновили ЦА на покупку игрушек', color: 'green', increasedPadding: true }
      ]) }
    ]
  },
  {
    id: 10,
    title: 'Авито: Всё Прозрачно',
    genre: 'RPG',
    description: '',
    iconImg: '/assets/icons/Avito.png',
    hasGallery: false,
    tags: ['BTL', 'digital'],
    instantText: true,
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
    id: 11,
    title: 'Балтика Безалкогольное',
    genre: 'ARCADE',
    description: '',
    iconImg: '/Балтика.png',
    hasGallery: false,
    tags: ['ролики'],
    instantText: true,
    contentBlocks: [
      { type: 'video', content: 'https://vimeo.com/1164824267' },
      { type: 'text', content: 'Ощути совершенство вкуса' }
    ]
  },
  {
    id: 12,
    title: 'ВТБ',
    genre: 'RPG',
    description: '',
    iconImg: '/assets/icons/ВТБ.png',
    hasGallery: false,
    tags: ['продуктовые ролики'],
    instantText: true,
    contentBlocks: [
      { type: 'text', content: 'Cняли серию роликов о преимуществах продуктов ВТБ' },
      { type: 'video', content: 'https://vimeo.com/1164824292' },
      { type: 'video', content: 'https://vimeo.com/1164824312' }
    ]
  },
  {
    id: 13,
    title: 'Nutrilite: Прослеживаемость',
    genre: 'ADVENTURE',
    description: '',
    iconImg: '/assets/icons/Nutrilite.png',
    hasGallery: false,
    tags: ['SMM', 'спецпроекты', 'digital'],
    instantText: true,
    contentBlocks: [
      { type: 'text', content: 'Чистота, безопасность, эффективность – три столпа качества Nutrilite, о которых компания решила рассказать в большой кампании «Прослеживаемость».' },
      { type: 'video', content: 'https://vimeo.com/1164924649' },
      { type: 'video', content: 'https://vimeo.com/1164924639' },
      { type: 'text', content: 'В рамках кампании была разработана целая серия роликов, а также уникальный визуальный стиль и масса рекламных материалов.' },
      { type: 'video', content: 'https://vimeo.com/1164924629' }
    ]
  },
  {
    id: 14,
    title: 'S7: Иркутск — Краснодар',
    genre: 'ACTION',
    description: '',
    iconImg: '/assets/icons/S7_Flight.png',
    hasGallery: false,
    tags: ['наружная реклама'],
    instantText: true,
    contentBlocks: [
      { type: 'text', content: 'В рамках тендера на вход в пул подрядчиков предложили несколько вариантов наружки для рейса Иркутск – Краснодар' },
      { type: 'images', content: ['https://res.cloudinary.com/djihbhmzz/image/upload/v1771490268/S7_%D1%80%D0%B5%D0%B9%D1%81_2_1_mkkp3q.png', 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490269/s7_%D1%80%D0%B5%D0%B9%D1%81_new_teh76k.png', 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490269/s7_%D1%80%D0%B5%D0%B9%D1%81_3_cn2vny.png'] },
      { type: 'header', content: 'РЕЗУЛЬТАТ' },
      { type: 'text', content: 'Попадание в пул подрядчиков' }
    ]
  },
  {
    id: 15,
    title: 'Пять Озер',
    genre: 'ARCADE',
    description: '',
    iconImg: '/assets/icons/5lakes.png',
    hasGallery: false,
    tags: ['ролики', 'креативная стратегия'],
    instantText: true,
    contentBlocks: [
      { type: 'text', content: 'Специальный ролик, приуроченный к выходу легендарной водки на немецкий рынок.' },
      { type: 'video', content: 'https://vimeo.com/1164831424' },
      { type: 'text', content: 'В основу ролика лег прием игры образов, символов Сибири, зеркально отражающихся в нашей жизни: через звук, свет, ощущения. Те признаки, что скрыты глубоко в каждом из нас – осталось только разбудить их.' }
    ]
  },
  {
    id: 16,
    title: 'АРТЕК x АВИТО',
    subline: 'Приключения в джунглях технологий с Авито',
    genre: 'ADVENTURE',
    description: '',
    galleryImg: '/assets/gallery/Артек_cover.png',
    iconImg: '/assets/icons/Артек.png',
    hasGallery: true,
    tags: ['event', 'SMM'],
    instantText: true,
    contentBlocks: [
      { type: 'infoboxes', content: JSON.stringify([
        { header: 'ДЕНЬ ТЕХНОЛОГИЙ', line: 'Есть у артековцев славная традиция – праздновать День Технологий', color: 'cyan' },
        { header: 'ВОТ ТАК СОВПАДЕНИЕ!', line: 'В этом году День Технологий и День Рождения Артека выпали на один день!', color: 'yellow' },
        { header: 'АВИТО, ТВОЙ ВЫХОД', line: 'Большому празднику – большое приключение!', color: 'pink' }
      ]) },
      { type: 'header', content: 'ДЖУНГЛИ ЗОВУТ' },
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
];

interface DialogueState {
  text: string;
  heroId: string;
  isVisible: boolean;
}

const japaneseWords = ['カクシン', 'わざ', '伝説', 'ターゲット', 'おもしろい'];

const getRandomProjectNumber = () => {
  return Math.floor(Math.random() * 9000000000) + 1000000000;
};

const getRandomIndicators = () => {
  const levels = Array.from({ length: 10 }, (_, i) => (i + 1) * 10);
  const stages = Array.from({ length: 10 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  return {
    level: levels[Math.floor(Math.random() * levels.length)],
    stage: stages[Math.floor(Math.random() * stages.length)],
    xp: Math.random() > 0.3 ? 'MAX' : `${Math.floor(Math.random() * 9000) + 1000}`
  };
};

export default function MainPortfolio({ heroId, runnerScore, onPlayAgain }: MainPortfolioProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('gallery');
  const [selectedGenre, setSelectedGenre] = useState<Genre>('ALL');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [dialogue, setDialogue] = useState<DialogueState | null>(null);
  const [hasShownGalleryDialogue, setHasShownGalleryDialogue] = useState(false);
  const [hasShownDesktopLoop, setHasShownDesktopLoop] = useState(false);
  const [desktopActiveTime, setDesktopActiveTime] = useState(0);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [projectIndicators, setProjectIndicators] = useState<{level: number, stage: string, xp: string} | null>(null);
  const [projectNumber, setProjectNumber] = useState<number>(0);

  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const galleryTimerRef = useRef<NodeJS.Timeout | null>(null);
  const desktopTimerRef = useRef<NodeJS.Timeout | null>(null);

  const genres: Genre[] = ['ALL', 'ACTION', 'ADVENTURE', 'RPG', 'SHOOTER', 'ARCADE'];

  const filteredProjects = projects.filter(project => {
    const matchesGenre = selectedGenre === 'ALL' || project.genre === selectedGenre;
    const matchesView = viewMode === 'desktop' || project.hasGallery;
    return matchesGenre && matchesView;
  });

  const desktopProjects = projects.filter(p => viewMode === 'desktop');

  const handleModeToggle = () => {
    soundEffects.play('button');
    setViewMode(prev => prev === 'gallery' ? 'desktop' : 'gallery');
    setSelectedGenre('ALL');
  };

  const showDialogue = async (text: string, heroIdToShow: string, duration: number = 4000) => {
    await audioEngine.resume();
    await audioManager.resume();
    setDialogue({ text, heroId: heroIdToShow, isVisible: true });
    soundEffects.play('dialogue');

    const timer = setTimeout(() => {
      setDialogue(null);
    }, duration);

    timersRef.current.push(timer);
  };

  const handleProjectClick = async (project: Project) => {
    await audioEngine.resume();
    await audioManager.resume();
    soundEffects.play('button');
    setSelectedProject(project);
    setProjectIndicators(getRandomIndicators());
    setProjectNumber(getRandomProjectNumber());
  };

  useEffect(() => {
    if (viewMode === 'gallery' && !selectedProject && !hasShownGalleryDialogue) {
      if (galleryTimerRef.current) {
        clearTimeout(galleryTimerRef.current);
      }

      galleryTimerRef.current = setTimeout(() => {
        showDialogue('А на рабочем столе еще больше проектов! ГАВ!', 'mudborya', 4000);

        const brendinhoTimer = setTimeout(() => {
          showDialogue('И резюме с контактами тоже там', 'brendinho', 4000);
        }, 6000);

        timersRef.current.push(brendinhoTimer);
        setHasShownGalleryDialogue(true);
      }, 10000);
    }

    return () => {
      if (galleryTimerRef.current) {
        clearTimeout(galleryTimerRef.current);
      }
    };
  }, [viewMode, selectedProject, hasShownGalleryDialogue]);

  useEffect(() => {
    if (!selectedProject) return;

    if (selectedProject.title === 'FLASH UP') {
      const timer = setTimeout(() => {
        showDialogue('Сиять? Это по моей части', 'brendinho');
      }, 3000);
      timersRef.current.push(timer);
    } else if (selectedProject.title === 'NERF PROКАЧКА') {
      const timer = setTimeout(() => {
        showDialogue('Посмотрим, у кого бластер больше?', 'smmario');
      }, 2000);
      timersRef.current.push(timer);
    } else if (selectedProject.title === 'LITTLEST PET SHOP') {
      const timer = setTimeout(() => {
        showDialogue('О, моё любимое шоу! Я там хлопушку держал', 'mudborya');
      }, 3000);
      timersRef.current.push(timer);
    } else if (selectedProject.title === 'S7 PRIORITY') {
      const timer = setTimeout(() => {
        showDialogue('Выше только моя самооценка', 'brendinho');
      }, 3000);
      timersRef.current.push(timer);
    } else if (selectedProject.title === 'Пять Озер') {
      const timer = setTimeout(() => {
        showDialogue('Ммм, что-то на немецком? I like that', 'smmario');
      }, 3000);
      timersRef.current.push(timer);
    } else if (selectedProject.title === 'ЯСНО СОЛНЫШКО') {
      const timer = setTimeout(() => {
        showDialogue('Настоящий креатор ест комменты на завтрак!', 'mudborya');
      }, 3000);
      timersRef.current.push(timer);
    }
  }, [selectedProject]);

  useEffect(() => {
    if (viewMode === 'desktop' && !selectedProject && !hasShownDesktopLoop) {
      desktopTimerRef.current = setInterval(() => {
        setDesktopActiveTime(prev => {
          const newTime = prev + 1;

          if (newTime === 10 && !hasShownDesktopLoop) {
            setHasShownDesktopLoop(true);

            setTimeout(() => {
              showDialogue('Почему у копира никто не спрашивает, как дела?', 'smmario', 4000);
            }, 0);

            setTimeout(() => {
              showDialogue('Потому что у него всё на лице написано! ХА-ХА-ХА', 'mudborya', 4000);
            }, 6000);
          }

          return newTime;
        });
      }, 1000);
    } else {
      if (desktopTimerRef.current) {
        clearInterval(desktopTimerRef.current);
        desktopTimerRef.current = null;
      }
    }

    return () => {
      if (desktopTimerRef.current) {
        clearInterval(desktopTimerRef.current);
        desktopTimerRef.current = null;
      }
    };
  }, [viewMode, selectedProject, hasShownDesktopLoop]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(timer => clearTimeout(timer));
      if (galleryTimerRef.current) {
        clearTimeout(galleryTimerRef.current);
      }
      if (desktopTimerRef.current) {
        clearInterval(desktopTimerRef.current);
      }
    };
  }, []);

  const currentHero = heroes.find(h => h.id === (dialogue?.heroId || heroId));

  useEffect(() => {
    const initAudio = async () => {
      await audioEngine.init();
      await audioEngine.resume();
      soundEffects.setWebAudioEngine(audioEngine);
      await soundEffects.preloadDesktopSounds();
    };

    initAudio();
  }, []);

  return (
    <>
      <MuteButton />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen text-white relative"
        style={{ backgroundColor: 'transparent' }}
      >
        <div className="relative w-full min-h-screen">
          <header
            className="border-b-2 border-pink-500 backdrop-blur-sm grid-overlay small-screen-header arcade-grid-background"
            style={{
              paddingTop: '0.875rem',
              paddingBottom: '0.875rem',
              paddingLeft: '1rem',
              paddingRight: '1rem'
            }}
          >
            <div className="max-w-6xl mx-auto flex flex-wrap justify-center items-center gap-6 md:gap-8 small-screen-header-content">
              <div className="flex items-center">
                <motion.span
                  className="text-xl md:text-2xl neon-green font-bold pixel-corners border-4 border-green-500 bg-black bg-opacity-80 px-4 md:px-6 py-2 md:py-3 small-screen-score"
                  style={{
                    imageRendering: 'pixelated',
                    letterSpacing: '0.1em'
                  }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ВАШ СЧЕТ: {runnerScore.toString().padStart(6, '0')}
                </motion.span>
              </div>

              <div className="flex items-center gap-2 bg-black bg-opacity-60 border-4 border-gray-600 px-3 py-2 small-screen-toggle" style={{ imageRendering: 'pixelated' }}>
                <button
                  onClick={async () => {
                    await audioEngine.resume();
                    await audioManager.resume();
                    soundEffects.play('button');
                    setViewMode('gallery');
                  }}
                  className={`px-6 py-3 text-base font-bold uppercase tracking-wider transition-all duration-150 pixel-corners border-4 ${
                    viewMode === 'gallery'
                      ? 'border-cyan-400 bg-cyan-950 text-cyan-300'
                      : 'border-gray-700 bg-gray-900 text-gray-500'
                  }`}
                  style={{
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: '0.85rem',
                    boxShadow: viewMode === 'gallery'
                      ? '0 0 25px rgba(0, 255, 255, 0.9), 0 0 45px rgba(0, 255, 255, 0.5), inset 0 0 15px rgba(0, 255, 255, 0.3)'
                      : 'none',
                    textShadow: viewMode === 'gallery'
                      ? '0 0 15px rgba(0, 255, 255, 1), 0 0 30px rgba(0, 255, 255, 0.7)'
                      : 'none'
                  }}
                >
                  ГАЛЕРЕЯ
                </button>
                <button
                  onClick={async () => {
                    await audioEngine.resume();
                    await audioManager.resume();
                    soundEffects.play('button');
                    setViewMode('desktop');
                  }}
                  className={`px-6 py-3 text-base font-bold uppercase tracking-wider transition-all duration-150 pixel-corners border-4 ${
                    viewMode === 'desktop'
                      ? 'border-pink-400 bg-pink-950 text-pink-300'
                      : 'border-gray-700 bg-gray-900 text-gray-500'
                  }`}
                  style={{
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: '0.85rem',
                    boxShadow: viewMode === 'desktop'
                      ? '0 0 25px rgba(255, 20, 147, 0.9), 0 0 45px rgba(255, 20, 147, 0.5), inset 0 0 15px rgba(255, 20, 147, 0.3)'
                      : 'none',
                    textShadow: viewMode === 'desktop'
                      ? '0 0 15px rgba(255, 20, 147, 1), 0 0 30px rgba(255, 20, 147, 0.7)'
                      : 'none'
                  }}
                >
                  DESKTOP
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={async () => {
                  await audioEngine.resume();
                  await audioManager.resume();
                  soundEffects.play('button');
                  if (onPlayAgain) onPlayAgain();
                }}
                className="flex items-center gap-3 px-6 py-3 pixel-corners border-4 border-green-500 bg-black bg-opacity-80 hover:bg-green-950 transition-all duration-150 font-bold uppercase small-screen-newgame"
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: '0.85rem',
                  boxShadow: '0 0 20px rgba(0, 255, 0, 0.7), 0 0 40px rgba(0, 255, 0, 0.4), inset 0 0 12px rgba(0, 255, 0, 0.2)',
                  color: '#00ff00',
                  textShadow: '0 0 12px rgba(0, 255, 0, 1), 0 0 25px rgba(0, 255, 0, 0.6)',
                  imageRendering: 'pixelated'
                }}
              >
                <RotateCcw className="w-5 h-5 small-screen-icon" />
                NEW GAME
              </motion.button>
            </div>
          </header>

          <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 small-screen-main" style={{ overflow: 'visible' }}>
            {viewMode === 'gallery' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 small-screen-gallery"
                style={{ overflow: 'visible' }}
              >
                <div className="flex flex-wrap gap-2 justify-center bg-transparent p-4 border-2 border-gray-700 small-screen-filters" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      onClick={async () => {
                        await audioEngine.resume();
                        await audioManager.resume();
                        soundEffects.play('button');
                        setSelectedGenre(genre);
                        setCarouselIndex(0);
                      }}
                      className={`px-4 py-2 text-xs uppercase tracking-wider transition-all duration-300 pixel-corners ${
                        selectedGenre === genre
                          ? 'border-2 border-pink-500 neon-pink bg-pink-950'
                          : 'border-2 border-gray-600 text-gray-400 hover:text-white hover:border-white'
                      }`}
                    >
                      [ {genre} ]
                    </button>
                  ))}
                </div>

                <div className="relative w-full" style={{ overflow: 'visible' }}>
                  {filteredProjects.length > 3 && (
                    <>
                      <button
                        onClick={async () => {
                          await audioEngine.resume();
                          await audioManager.resume();
                          soundEffects.play('button');
                          setCarouselIndex(Math.max(0, carouselIndex - 1));
                        }}
                        disabled={carouselIndex === 0}
                        className="absolute -left-4 w-16 h-16 flex items-center justify-center pixel-corners border-4 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                        style={{
                          top: 'calc(50% - 20px)',
                          transform: 'translateY(-50%)',
                          zIndex: 50,
                          backgroundColor: 'rgba(0, 0, 0, 0.9)',
                          borderColor: carouselIndex === 0 ? '#666' : '#ff1493',
                          boxShadow: carouselIndex === 0 ? 'none' : '0 0 30px rgba(255, 20, 147, 0.8), inset 0 0 20px rgba(255, 20, 147, 0.3)',
                          imageRendering: 'pixelated'
                        }}
                      >
                        <ChevronLeft
                          className="w-10 h-10"
                          style={{
                            color: carouselIndex === 0 ? '#666' : '#ff1493',
                            filter: carouselIndex === 0 ? 'none' : 'drop-shadow(0 0 15px rgba(255, 20, 147, 1))',
                            strokeWidth: 3
                          }}
                        />
                      </button>

                      <button
                        onClick={async () => {
                          await audioEngine.resume();
                          await audioManager.resume();
                          soundEffects.play('button');
                          setCarouselIndex(Math.min(filteredProjects.length - 3, carouselIndex + 1));
                        }}
                        disabled={carouselIndex >= filteredProjects.length - 3}
                        className="absolute -right-4 w-16 h-16 flex items-center justify-center pixel-corners border-4 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                        style={{
                          top: 'calc(50% - 20px)',
                          transform: 'translateY(-50%)',
                          zIndex: 50,
                          backgroundColor: 'rgba(0, 0, 0, 0.9)',
                          borderColor: carouselIndex >= filteredProjects.length - 3 ? '#666' : '#00ffff',
                          boxShadow: carouselIndex >= filteredProjects.length - 3 ? 'none' : '0 0 30px rgba(0, 255, 255, 0.8), inset 0 0 20px rgba(0, 255, 255, 0.3)',
                          imageRendering: 'pixelated'
                        }}
                      >
                        <ChevronRight
                          className="w-10 h-10"
                          style={{
                            color: carouselIndex >= filteredProjects.length - 3 ? '#666' : '#00ffff',
                            filter: carouselIndex >= filteredProjects.length - 3 ? 'none' : 'drop-shadow(0 0 15px rgba(0, 255, 255, 1))',
                            strokeWidth: 3
                          }}
                        />
                      </button>
                    </>
                  )}

                  <div
                    className="w-full flex justify-center"
                    style={{
                      overflow: 'visible',
                      padding: filteredProjects.length > 3 ? '0 5rem' : '0'
                    }}
                  >
                    {filteredProjects.length <= 3 ? (
                      <div
                        className="flex gap-8 justify-center items-start"
                        style={{ overflow: 'visible', paddingTop: '3rem', paddingBottom: '5rem' }}
                      >
                        {filteredProjects.map((project, index) => (
                          <motion.div
                            key={project.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              delay: index * 0.1,
                              type: 'spring',
                              stiffness: 200,
                              damping: 20
                            }}
                            style={{
                              width: filteredProjects.length === 1 ? '40%' : filteredProjects.length === 2 ? '35%' : '30%',
                              minWidth: '280px',
                              overflow: 'visible'
                            }}
                          >
                            <motion.div
                              whileHover={{ y: -5 }}
                              onClick={() => handleProjectClick(project)}
                              className="cursor-pointer group flex flex-col items-center"
                              style={{ overflow: 'visible' }}
                            >
                              <div
                                className="relative w-full transition-all duration-300 pixel-corners"
                                style={{
                                  overflow: 'hidden',
                                  backgroundColor: '#000',
                                  border: '3px solid #00f0ff',
                                  boxShadow: '0 0 15px rgba(0, 240, 255, 0.6)'
                                }}
                              >
                                <CachedImage
                                  src={project.galleryImg}
                                  alt={project.title}
                                  className="w-full h-auto group-hover:brightness-110 transition-all duration-300"
                                  style={{
                                    imageRendering: 'pixelated',
                                    objectFit: 'contain',
                                    display: 'block'
                                  }}
                                />
                              </div>
                              <div
                                className="mt-6 text-center w-full"
                                style={{
                                  overflow: 'visible',
                                  position: 'relative',
                                  zIndex: 20,
                                  minHeight: '120px'
                                }}
                              >
                                <h3
                                  className="font-bold uppercase"
                                  style={{
                                    fontFamily: "'Press Start 2P', cursive",
                                    fontSize: '1.35rem',
                                    letterSpacing: '0.05em',
                                    lineHeight: '1.5',
                                    color: 'rgba(255, 255, 255, 0.84)',
                                    textShadow: '0 0 7px rgba(255, 0, 0, 0.5), 0 0 14px rgba(255, 0, 0, 0.3)'
                                  }}
                                >
                                  {project.title}
                                </h3>
                                {project.subline && (
                                  <p
                                    className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{
                                      fontFamily: "'Press Start 2P', cursive",
                                      fontSize: '0.65rem',
                                      letterSpacing: '0.03em',
                                      lineHeight: '1.4',
                                      color: '#FFFFFF',
                                      textShadow: '0 0 5px rgba(255, 255, 255, 0.3)'
                                    }}
                                  >
                                    {project.subline}
                                  </p>
                                )}
                              </div>
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="w-full" style={{ overflow: 'visible', paddingBottom: '5rem' }}>
                        <motion.div
                          animate={{
                            x: `calc(-${carouselIndex * (100 / 3)}%)`
                          }}
                          transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30
                          }}
                          className="flex"
                          style={{ overflow: 'visible' }}
                        >
                          {filteredProjects.map((project, index) => {
                            const isInActiveTrio = index >= carouselIndex && index < carouselIndex + 3;
                            return (
                              <motion.div
                                key={project.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{
                                  delay: index * 0.05,
                                  type: 'spring',
                                  stiffness: 200,
                                  damping: 20
                                }}
                                className="flex-shrink-0 flex justify-center items-start px-4"
                                style={{
                                  width: `${100 / 3}%`,
                                  overflow: 'visible',
                                  paddingTop: '3rem',
                                  paddingBottom: '5rem',
                                  opacity: isInActiveTrio ? 1 : 0.4,
                                  filter: isInActiveTrio ? 'brightness(1)' : 'brightness(0.5) grayscale(0.3)',
                                  transition: 'opacity 0.3s ease-in-out, filter 0.3s ease-in-out',
                                  zIndex: isInActiveTrio ? 10 : 1
                                }}
                              >
                                <motion.div
                                  whileHover={{ y: -5 }}
                                  onClick={() => handleProjectClick(project)}
                                  className="cursor-pointer group w-full flex flex-col items-center"
                                  style={{ maxWidth: '360px', overflow: 'visible' }}
                                >
                                  <div
                                    className="relative w-full transition-all duration-300 pixel-corners"
                                    style={{
                                      overflow: 'hidden',
                                      backgroundColor: '#000',
                                      border: '3px solid #00f0ff',
                                      boxShadow: '0 0 15px rgba(0, 240, 255, 0.6)'
                                    }}
                                  >
                                    <CachedImage
                                      src={project.galleryImg}
                                      alt={project.title}
                                      className="w-full h-auto group-hover:brightness-110 transition-all duration-300"
                                      style={{
                                        imageRendering: 'pixelated',
                                        objectFit: 'contain',
                                        display: 'block'
                                      }}
                                    />
                                  </div>
                                  <div
                                    className="mt-6 text-center transition-opacity duration-300 w-full"
                                    style={{
                                      opacity: isInActiveTrio ? 1 : 0,
                                      overflow: 'visible',
                                      position: 'relative',
                                      zIndex: 20,
                                      minHeight: '120px'
                                    }}
                                  >
                                    <h3
                                      className="font-bold uppercase"
                                      style={{
                                        fontFamily: "'Press Start 2P', cursive",
                                        fontSize: '1.35rem',
                                        letterSpacing: '0.05em',
                                        lineHeight: '1.5',
                                        color: 'rgba(255, 255, 255, 0.84)',
                                        textShadow: '0 0 7px rgba(255, 0, 0, 0.5), 0 0 14px rgba(255, 0, 0, 0.3)'
                                      }}
                                    >
                                      {project.title}
                                    </h3>
                                    {project.subline && (
                                      <p
                                        className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{
                                          fontFamily: "'Press Start 2P', cursive",
                                          fontSize: '0.65rem',
                                          letterSpacing: '0.03em',
                                          lineHeight: '1.4',
                                          color: '#FFFFFF',
                                          textShadow: '0 0 5px rgba(255, 255, 255, 0.3)'
                                        }}
                                      >
                                        {project.subline}
                                      </p>
                                    )}
                                  </div>
                                </motion.div>
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {viewMode === 'desktop' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative"
                style={{
                  padding: '0',
                  minHeight: '600px'
                }}
              >
                <div
                  className="pixel-corners"
                  style={{
                    backgroundColor: '#2a0e35',
                    borderWidth: '2.5px',
                    borderStyle: 'solid',
                    borderColor: '#00FFFF',
                    boxShadow: '0 0 25px rgba(0, 255, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.25)',
                    width: '90%',
                    margin: '0 auto',
                    padding: '3rem',
                    paddingTop: '2rem',
                    position: 'relative',
                    overflow: 'visible',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }}
                >
                  <div
                    className="desktop-icons-container"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '2rem 2rem',
                      paddingRight: '180px',
                      overflow: 'visible',
                      width: '100%'
                    }}
                  >
                  {desktopProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 * index }}
                      whileHover={{ scale: 1.1 }}
                      onClick={() => handleProjectClick(project)}
                      className="flex flex-col items-center gap-3 cursor-pointer group"
                      style={{ width: '120px' }}
                    >
                      <div
                        className="w-24 h-24 flex items-center justify-center transition-all duration-200"
                        style={{
                          imageRendering: 'pixelated',
                          filter: 'drop-shadow(0 0 0px rgba(0, 255, 255, 0))',
                        }}
                      >
                        <CachedImage
                          src={project.iconImg}
                          alt={project.title}
                          className="max-w-full max-h-full group-hover:brightness-110"
                          style={{
                            imageRendering: 'pixelated',
                            objectFit: 'contain',
                            transform: project.title === 'Авито: Всё Прозрачно' ? 'scale(0.9)' : 'scale(1)',
                            filter: 'drop-shadow(0 0 0px rgba(0, 255, 255, 0))',
                            transition: 'filter 0.2s ease-in-out'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.filter = 'drop-shadow(0 0 12px rgba(0, 255, 255, 0.8))';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.filter = 'drop-shadow(0 0 0px rgba(0, 255, 255, 0))';
                          }}
                        />
                      </div>
                      <span
                        className="text-white text-center leading-tight"
                        style={{
                          fontFamily: 'monospace',
                          fontSize: project.title === 'Nutrilite: Прослеживаемость' ? '0.75rem' : '0.86rem',
                          maxWidth: '120px',
                          wordWrap: 'break-word',
                          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
                        }}
                      >
                        {project.title}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div
                  className="absolute top-0 right-0 flex flex-col gap-8 items-center"
                  style={{
                    padding: '2.5rem 2rem'
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={async () => {
                      await audioEngine.resume();
                      await audioManager.resume();
                      soundEffects.play('button');
                      setIsAboutOpen(true);
                    }}
                    className="flex flex-col items-center gap-3 cursor-pointer group"
                    style={{ width: '120px' }}
                  >
                    <div
                      className="flex items-center justify-center transition-all duration-200 group-hover:brightness-110"
                      style={{
                        width: '124.8px',
                        height: '124.8px',
                        filter: 'drop-shadow(0 0 0px rgba(0, 255, 255, 0))',
                        transition: 'filter 0.2s ease-in-out'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter = 'drop-shadow(0 0 12px rgba(0, 255, 255, 0.8))';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = 'drop-shadow(0 0 0px rgba(0, 255, 255, 0))';
                      }}
                    >
                      <img
                        src="https://res.cloudinary.com/djihbhmzz/image/upload/v1771490810/about_icon_fi3b5s.png"
                        alt="ABOUT"
                        className="w-full h-full"
                        style={{
                          imageRendering: 'pixelated',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                    <span
                      className="text-white text-center leading-tight"
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
                      }}
                    >
                      ABOUT
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={async () => {
                      await audioEngine.resume();
                      await audioManager.resume();
                      soundEffects.play('button');
                      setIsResumeOpen(true);
                    }}
                    className="flex flex-col items-center gap-3 cursor-pointer group"
                    style={{ width: '120px' }}
                  >
                    <div
                      className="flex items-center justify-center transition-all duration-200 group-hover:brightness-110"
                      style={{
                        width: '124.8px',
                        height: '124.8px',
                        filter: 'drop-shadow(0 0 0px rgba(0, 255, 255, 0))',
                        transition: 'filter 0.2s ease-in-out'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter = 'drop-shadow(0 0 12px rgba(0, 255, 255, 0.8))';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = 'drop-shadow(0 0 0px rgba(0, 255, 255, 0))';
                      }}
                    >
                      <img
                        src="https://res.cloudinary.com/djihbhmzz/image/upload/v1771490813/resume_icon_sdpmqk.png"
                        alt="РЕЗЮМЕ"
                        className="w-full h-full"
                        style={{
                          imageRendering: 'pixelated',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                    <span
                      className="text-white text-center leading-tight"
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
                      }}
                    >
                      РЕЗЮМЕ
                    </span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={async () => {
                      await audioEngine.resume();
                      await audioManager.resume();
                      soundEffects.play('button');
                      setIsContactsOpen(true);
                    }}
                    className="flex flex-col items-center gap-3 cursor-pointer group"
                    style={{ width: '120px' }}
                  >
                    <div
                      className="flex items-center justify-center transition-all duration-200 group-hover:brightness-110"
                      style={{
                        width: '124.8px',
                        height: '124.8px',
                        filter: 'drop-shadow(0 0 0px rgba(0, 255, 255, 0))',
                        transition: 'filter 0.2s ease-in-out'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter = 'drop-shadow(0 0 12px rgba(0, 255, 255, 0.8))';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = 'drop-shadow(0 0 0px rgba(0, 255, 255, 0))';
                      }}
                    >
                      <img
                        src="https://res.cloudinary.com/djihbhmzz/image/upload/v1771490810/contacts_icon_pgy4ei.png"
                        alt="СВЯЗАТЬСЯ"
                        className="w-full h-full"
                        style={{
                          imageRendering: 'pixelated',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                    <span
                      className="text-white text-center leading-tight"
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
                      }}
                    >
                      СВЯЗАТЬСЯ
                    </span>
                  </motion.div>
                </div>
                </div>
              </motion.div>
            )}
          </main>
        </div>

        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 backdrop-blur-md z-50 overflow-y-auto grid-overlay arcade-grid-background"
              style={{
                paddingTop: '2rem',
                paddingBottom: '2rem'
              }}
            >
              <div className="min-h-full flex items-start justify-center p-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: 50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 50 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  onClick={(e) => e.stopPropagation()}
                  className="pixel-corners border-4 border-pink-500 bg-gradient-to-br from-gray-900 to-black p-8 max-w-4xl w-full space-y-6"
                  style={{ marginTop: '0', marginBottom: '2rem' }}
                >
                  <div className="border-b-2 border-pink-500 pb-4 relative">
                    <h3
                      className="text-3xl md:text-4xl font-bold uppercase tracking-wide"
                      style={{
                        color: '#fff',
                        textShadow: '0 0 20px rgba(255,20,147,0.8), 0 0 40px rgba(255,20,147,0.4)',
                        fontFamily: "'Press Start 2P', cursive",
                        lineHeight: '1.4',
                        whiteSpace: selectedProject.title.includes('Прослеживаемость') ? 'normal' : 'nowrap',
                        overflow: 'visible'
                      }}
                    >
                      {selectedProject.title}
                    </h3>

                    <div className="flex items-start justify-between gap-4 mt-4">
                      {/* Left side: Tags */}
                      <div className="flex flex-wrap gap-2 flex-1">
                        <motion.span
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.15 }}
                          className="inline-block px-3 py-1 text-xs uppercase tracking-wider border-2 pixel-corners"
                          style={{
                            backgroundColor: '#4a4a4a',
                            borderColor: '#888888',
                            color: '#f5f5f5',
                            textShadow: '0 0 8px rgba(192, 192, 192, 0.6), 0 0 16px rgba(192, 192, 192, 0.3)',
                            boxShadow: '0 0 10px rgba(192, 192, 192, 0.4), inset 0 0 10px rgba(192, 192, 192, 0.2)'
                          }}
                        >
                          {selectedProject.genre}
                        </motion.span>
                        {selectedProject.tags && selectedProject.tags.map((tag, index) => {
                          const tagColors = [
                            { border: 'border-cyan-400', class: 'neon-cyan' },
                            { border: 'border-pink-400', class: 'neon-pink' },
                            { border: 'border-green-400', class: 'neon-green' },
                            { border: 'border-purple-400', class: 'neon-purple' },
                            { border: 'border-yellow-400', class: 'neon-yellow' },
                          ];
                          const colorScheme = tagColors[index % tagColors.length];

                          return (
                            <motion.span
                              key={index}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.2 + index * 0.05 }}
                              className={`inline-block px-3 py-1 text-xs uppercase tracking-wider border-2 ${colorScheme.border} ${colorScheme.class} pixel-corners`}
                            >
                              {tag}
                            </motion.span>
                          );
                        })}
                      </div>

                      {/* Right side: Indicators flush right */}
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <div className="flex items-center justify-end gap-2.5" style={{ whiteSpace: 'nowrap' }}>
                          <div
                            style={{
                              fontFamily: "'Courier New', monospace",
                              fontSize: '0.81rem',
                              color: '#ff1493',
                              textShadow: '0 0 10px rgba(255, 20, 147, 0.8)',
                              letterSpacing: '0.05em',
                              fontWeight: 'bold'
                            }}
                          >
                            PROJECT #{projectNumber}
                          </div>
                          <div
                            style={{
                              fontFamily: "'Courier New', monospace",
                              fontSize: '0.81rem',
                              color: '#ff1493',
                              textShadow: '0 0 10px rgba(255, 20, 147, 0.8)',
                              letterSpacing: '0.05em',
                              fontWeight: 'bold'
                            }}
                          >
                            <GlitchText words={japaneseWords} color="#ff1493" fontSize="0.81rem" />
                          </div>
                        </div>
                        {projectIndicators && (
                          <div className="flex items-center justify-end gap-2.5" style={{ whiteSpace: 'nowrap' }}>
                            <div
                              style={{
                                fontFamily: "'Courier New', monospace",
                                fontSize: '0.81rem',
                                color: '#ff1493',
                                textShadow: '0 0 10px rgba(255, 20, 147, 0.8)',
                                letterSpacing: '0.05em',
                                fontWeight: 'bold'
                              }}
                            >
                              LVL: {projectIndicators.level}
                            </div>
                            <div
                              style={{
                                fontFamily: "'Courier New', monospace",
                                fontSize: '0.81rem',
                                color: '#ff1493',
                                textShadow: '0 0 10px rgba(255, 20, 147, 0.8)',
                                letterSpacing: '0.05em',
                                fontWeight: 'bold'
                              }}
                            >
                              XP: {projectIndicators.xp}
                            </div>
                            <div
                              style={{
                                fontFamily: "'Courier New', monospace",
                                fontSize: '0.81rem',
                                color: '#ff1493',
                                textShadow: '0 0 10px rgba(255, 20, 147, 0.8)',
                                letterSpacing: '0.05em',
                                fontWeight: 'bold'
                              }}
                            >
                              STAGE: {projectIndicators.stage}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedProject.contentBlocks ? (
                    <div className="space-y-6">
                      {selectedProject.contentBlocks.map((block, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 + index * 0.2 }}
                        >
                          {block.type === 'text' ? (
                            <p
                              className="leading-relaxed"
                              style={{
                                fontFamily: "'Press Start 2P', cursive",
                                color: '#FFFFFF',
                                fontSize: '0.875rem',
                                lineHeight: '1.6',
                                letterSpacing: '0.02em'
                              }}
                              dangerouslySetInnerHTML={{ __html: typeof block.content === 'string' ? block.content : '' }}
                            />
                          ) : block.type === 'video' ? (
                            <div className="aspect-video w-full bg-black border-4 border-gray-700 relative overflow-hidden">
                              <iframe
                                src={`https://player.vimeo.com/video/${typeof block.content === 'string' ? block.content.split('/').pop() : ''}?title=0&byline=0&portrait=0`}
                                className="absolute inset-0 w-full h-full"
                                frameBorder="0"
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            </div>
                          ) : block.type === 'header' ? (
                            <h4
                              className={`font-bold uppercase ${selectedProject.title.includes('Иркутск') ? 'text-left' : 'text-center'}`}
                              style={{
                                fontFamily: "'Press Start 2P', cursive",
                                fontSize: '1.2rem',
                                color: '#00ff00',
                                textShadow: '0 0 20px rgba(0,255,0,0.8), 0 0 40px rgba(0,255,0,0.4)',
                                letterSpacing: '0.1em',
                                lineHeight: '1.6',
                                marginTop: '2rem',
                                marginBottom: '1.5rem'
                              }}
                            >
                              {typeof block.content === 'string' ? block.content : ''}
                            </h4>
                          ) : block.type === 'images' ? (
                            <div
                              className={selectedProject.title.includes('Иркутск')
                                ? "flex flex-wrap justify-center gap-6 items-stretch"
                                : "grid grid-cols-3 gap-4"
                              }
                            >
                              {Array.isArray(block.content) && block.content.map((imgSrc, imgIndex) => (
                                <div
                                  key={imgIndex}
                                  className={`border-4 border-gray-700 bg-black flex items-center justify-center ${
                                    selectedProject.title.includes('Иркутск')
                                      ? 'flex-shrink-0'
                                      : 'overflow-hidden'
                                  }`}
                                  style={selectedProject.title.includes('Иркутск')
                                    ? {
                                        width: 'calc(33.333% - 1rem)',
                                        minWidth: '280px',
                                        maxWidth: '400px',
                                        aspectRatio: '3/4',
                                        padding: '0'
                                      }
                                    : { aspectRatio: '4/3' }
                                  }
                                >
                                  <CachedImage
                                    src={imgSrc}
                                    alt={`Gallery image ${imgIndex + 1}`}
                                    className={`hover:brightness-110 transition-all duration-300 ${
                                      selectedProject.title.includes('Иркутск')
                                        ? 'w-full h-full object-contain'
                                        : 'w-full h-full object-cover'
                                    }`}
                                    style={{
                                      imageRendering: 'pixelated'
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          ) : block.type === 'infoboxes' ? (
                            <div className="flex gap-4 w-full" style={{ display: 'flex', alignItems: 'stretch' }}>
                              {typeof block.content === 'string' && JSON.parse(block.content).map((box: { header: string; line: string; color: 'cyan' | 'pink' | 'green' | 'yellow'; increasedPadding?: boolean }, boxIndex: number) => (
                                <InfoBox
                                  key={boxIndex}
                                  header={box.header}
                                  line={box.line}
                                  color={box.color}
                                  increasedPadding={box.increasedPadding}
                                />
                              ))}
                            </div>
                          ) : null}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {selectedProject.videoUrl && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="aspect-video w-full bg-black border-4 border-gray-700 relative overflow-hidden"
                        >
                          <iframe
                            src={`https://player.vimeo.com/video/${selectedProject.videoUrl.split('/').pop()}?title=0&byline=0&portrait=0`}
                            className="absolute inset-0 w-full h-full"
                            frameBorder="0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </motion.div>
                      )}

                      {selectedProject.description && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="space-y-4"
                        >
                          <p
                            className="leading-relaxed"
                            style={{
                              fontFamily: "'Press Start 2P', cursive",
                              color: '#FFFFFF',
                              fontSize: '0.875rem',
                              lineHeight: '1.6',
                              letterSpacing: '0.02em'
                            }}
                            dangerouslySetInnerHTML={{ __html: selectedProject.description }}
                          />
                        </motion.div>
                      )}
                    </>
                  )}

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex justify-end pt-6 border-t-2 border-gray-800"
                  >
                    <button
                      onClick={async () => {
                        await audioEngine.resume();
                        await audioManager.resume();
                        soundEffects.play('button');
                        setSelectedProject(null);
                      }}
                      className="px-8 py-3 pixel-corners border-2 border-pink-500 neon-pink hover:bg-pink-950 transition-all duration-300 text-sm uppercase tracking-wider font-bold"
                    >
                      ЗАКРЫТЬ [ ESC ]
                    </button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {dialogue && currentHero && (
          <DialogueBox
            text={dialogue.text}
            heroImage={currentHero.image}
            heroName={currentHero.name}
            isVisible={dialogue.isVisible}
            onComplete={() => setDialogue(null)}
          />
        )}

        <ResumeModal
          isOpen={isResumeOpen}
          onClose={() => setIsResumeOpen(false)}
        />

        <AboutModal
          isOpen={isAboutOpen}
          onClose={() => setIsAboutOpen(false)}
        />

        <ContactsModal
          isOpen={isContactsOpen}
          onClose={() => setIsContactsOpen(false)}
          onDialogueTrigger={() => showDialogue('Позвони. Я буду ждать', 'smmario', 4000)}
        />
      </motion.div>
    </>
  );
}
