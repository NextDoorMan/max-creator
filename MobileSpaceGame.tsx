import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AudioToggle } from './AudioToggle';
import ArcadeGlitchTransition from './ArcadeGlitchTransition';
import SpaceDialogue from './SpaceDialogue';
import SystemTitle from './SystemTitle';
import { audioEngine } from '../../utils/webAudioEngine';
import { soundEffects } from '../../utils/audioManager';

interface Hero {
  id: string;
  name: string;
  quote: string;
  portrait: string;
}

const heroes: Record<string, Hero> = {
  mudborya: {
    id: 'mudborya',
    name: 'Мудборя',
    quote: 'А можно как-нибудь без правок?',
    portrait: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490572/%D0%9C%D1%83%D0%B4%D0%B1%D0%BE%D1%80%D1%8F_%D0%BF%D0%BE%D1%80%D1%82%D1%80%D0%B5%D1%82_yakafm.png'
  },
  smmario: {
    id: 'smmario',
    name: 'SMMарио',
    quote: 'That turns me on!',
    portrait: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490571/SMM%D0%B0%D1%80%D0%B8%D0%BE_%D0%BF%D0%BE%D1%80%D1%82%D1%80%D0%B5%D1%82_jfrqki.png'
  },
  brendinho: {
    id: 'brendinho',
    name: 'Брендиньо',
    quote: 'Держи свои комменты при себе',
    portrait: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1771490571/%D0%91%D1%80%D0%B5%D0%BD%D0%B4%D0%B8%D0%BD%D1%8C%D0%BE_%D0%BF%D0%BE%D1%80%D1%82%D1%80%D0%B5%D1%82_b3cxqq.png'
  }
};

const spaceships: Record<string, string> = {
  mudborya: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1772566105/%D0%BC%D1%83%D0%B4%D0%B1%D0%BE%D1%80%D1%8F_%D0%BA%D0%BE%D1%80%D0%B0%D0%B1%D0%BB%D1%8C_1_xlkwrm.png',
  smmario: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1772566105/Smm%D0%B0%D1%80%D0%B8%D0%BE_%D0%BA%D0%BE%D1%80%D0%B0%D0%B1%D0%BB%D1%8C_1_vo3pvh.png',
  brendinho: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1772569080/%D0%B1%D1%80%D0%B5%D0%BD%D0%B4%D0%B8%D0%BD%D1%8C%D0%BE_%D0%BA%D0%BE%D1%80%D0%B0%D0%B1%D0%BB%D1%8C_1_qtx3df.png'
};

const spaceshipSizes: Record<string, string> = {
  mudborya: 'min(27.52vw, 113.4px)',
  smmario: 'min(27.52vw, 113.4px)',
  brendinho: 'min(24.48vw, 100.8px)'
};

interface MobileSpaceGameProps {
  heroId: string;
  onBack: () => void;
  onChangeHero?: () => void;
  onMainMenu?: () => void;
}

type Lane = 0 | 1 | 2;

interface Bullet {
  id: number;
  x: number;
  startY: number;
  startTime: number;
}

interface Enemy {
  id: number;
  lane: Lane;
  type: number;
  startTime: number;
  isAsteroid?: boolean;
}

interface Boss {
  id: number;
  health: number;
  startTime: number;
  isDying: boolean;
}

interface Heart {
  id: number;
  lane: Lane;
  startTime: number;
}

const enemyGifs = [
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1772613862/%D1%80%D0%B5%D0%B4_%D1%84%D0%BB%D0%B0%D0%B3_%D0%B3%D0%BD%D0%B5%D0%B2_%D0%B3%D0%B8%D1%84%D0%BA%D0%B0_da49xo.gif',
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1772613862/%D1%80%D0%B5%D0%B4_%D1%84%D0%BB%D0%B0%D0%B3_%D1%83%D1%85%D0%BC%D1%8B%D0%BB%D0%BA%D0%B0_%D0%B3%D0%B8%D1%84%D0%BA%D0%B0_m3umhh.gif',
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1772615140/%D1%80%D0%B5%D0%B4%D1%84%D0%BB%D0%B0%D0%B3_%D0%BE%D0%B1%D1%8B%D1%87%D0%BD%D1%8B%D0%B9_%D0%B3%D0%B8%D1%84%D0%BA%D0%B0_ociq1d.gif'
];

const asteroidGif = 'https://res.cloudinary.com/djihbhmzz/image/upload/v1773064268/%D0%B0%D1%81%D1%82%D0%B5%D1%80%D0%BE%D0%B8%D0%B4_yrw9nc.gif';

const cringePhrases = {
  center: ["RE:ПРАВКИ"],
  all: [
    "Дедлайн: вчера",
    "Таймщиты",
    "Токсичный стратег",
    "У нас дебриф",
    "Фидбек аккаунта",
    "Офис 5/2",
    "Бюджет 1000 руб",
    "Хотим вау",
    "Созвон в 8:00",
    "Статус в пятницу",
    "Зачем тебе\nарт-дир?",
    "Давайте как Apple",
    "Тут дел на 5 минут",
    "Правки в голосовых",
    "Low KPI",
    "«Привет!\nА ты где?»"
  ]
};

interface HitEffect {
  id: number;
  x: number;
  y: number;
  phrase: string;
  lane: Lane;
}

interface GameStats {
  destroyed: number;
  missed: number;
  phraseFrequency: Record<string, number>;
}

interface SpaceFact {
  kills: number;
  text: string;
}

const spaceFacts: SpaceFact[] = [
  { kills: 2, text: '33 года' },
  { kills: 5, text: '10 лет опыта' },
  { kills: 9, text: '50+ брендов' },
  { kills: 11, text: 'Более 100\nпроектов' },
  { kills: 16, text: 'Тысячи\nстрок\nтекста' },
  { kills: 18, text: 'Миллионы\nпротеиновых\nбатончиков' },
  { kills: 22, text: '20 раз\nна турнике' },
  { kills: 24, text: 'Ну ладно, 19' },
  { kills: 26, text: 'И не только!' }
];

interface ActiveFact {
  id: number;
  text: string;
  color: string;
}

interface HeroDialogue {
  trigger: number;
  text: string;
}

const heroDialogues: Record<string, HeroDialogue[]> = {
  mudborya: [
    { trigger: 5, text: 'Делай хорошо, чтобы не было гав...гав!' },
    { trigger: 11, text: 'Нет, я не плачу. Это сроки в глаз попали' },
    { trigger: 18, text: 'Конечно, я выйду в субботу. В окно' },
    { trigger: 26, text: 'Ну что, понеслась!' }
  ],
  smmario: [
    { trigger: 5, text: 'Люблю, как ты играешься со шрифтами' },
    { trigger: 11, text: 'Хочешь посмотреть на мои подводки?' },
    { trigger: 18, text: 'Ого, какой у тебя большой...фидбек' },
    { trigger: 26, text: 'А теперь давай по-взрослому' }
  ],
  brendinho: [
    { trigger: 5, text: 'Сначала плати, потом брифуй' },
    { trigger: 11, text: 'Какой еще созвон? У меня тут фриланс горит' },
    { trigger: 18, text: 'Что значит «одна идея – мало»?' },
    { trigger: 26, text: 'Ну давай, удиви меня' }
  ]
};


export default function MobileSpaceGame({ heroId, onBack, onChangeHero, onMainMenu }: MobileSpaceGameProps) {
  const [ignitionPhase, setIgnitionPhase] = useState<'flash' | 'gameplay'>('gameplay');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentLane, setCurrentLane] = useState<Lane>(1);
  const [showUI, setShowUI] = useState(false);
  const [showEntryGlitch, setShowEntryGlitch] = useState(true);
  const [showTitle, setShowTitle] = useState(false);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [showMuzzleFlash, setShowMuzzleFlash] = useState(false);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [hitEffects, setHitEffects] = useState<HitEffect[]>([]);
  const [dyingEnemies, setDyingEnemies] = useState<number[]>([]);
  const [isInvulnerable, setIsInvulnerable] = useState(false);
  const [shipFlash, setShipFlash] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const [stats, setStats] = useState<GameStats>({
    destroyed: 0,
    missed: 0,
    phraseFrequency: {}
  });
  const [killCount, setKillCount] = useState(0);
  const [activeFacts, setActiveFacts] = useState<ActiveFact[]>([]);
  const [activeDialogue, setActiveDialogue] = useState<string | null>(null);
  const dialogueTriggeredRef = useRef<Set<number>>(new Set());
  const [showBossWarning, setShowBossWarning] = useState(false);
  const [boss, setBoss] = useState<Boss | null>(null);
  const [isBossActive, setIsBossActive] = useState(false);
  const [bossExplosion, setBossExplosion] = useState(false);
  const [isFlashActive, setIsFlashActive] = useState(false);
  const bossTriggeredRef = useRef(false);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [isGoldGlow, setIsGoldGlow] = useState(false);
  const [showDopcostTitle, setShowDopcostTitle] = useState(false);
  const [lifeGlow, setLifeGlow] = useState(false);
  const [isIntensePhase, setIsIntensePhase] = useState(false);
  const [showAsteroidWarning, setShowAsteroidWarning] = useState(false);
  const [postBossTimestamp, setPostBossTimestamp] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [show1000Button, setShow1000Button] = useState(false);
  const universalDialoguesTriggeredRef = useRef<Set<number>>(new Set());
  const [easterEggDialogueShown, setEasterEggDialogueShown] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [showVictoryTitle, setShowVictoryTitle] = useState(false);
  const [showVictoryStats, setShowVictoryStats] = useState(false);
  const [showVictoryButtons, setShowVictoryButtons] = useState(false);

  const hero = heroes[heroId];
  const audioInitializedRef = useRef(false);
  const bulletIdRef = useRef(0);
  const shipPositionRef = useRef(1);
  const enemyIdRef = useRef(0);
  const enemySpawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const heartSpawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const heartIdRef = useRef(0);
  const gameStartTimeRef = useRef<number>(0);
  const gameplayStartedRef = useRef(false);
  const enemiesRef = useRef<Enemy[]>([]);
  const killCountRef = useRef(0);
  const victoryWarmedUpRef = useRef(false);

  useEffect(() => {
    setShowUI(true);
    gameStartTimeRef.current = Date.now();
    setTimeout(() => setShowTitle(true), 1000);

    const initAudio = async () => {
      await audioEngine.init();
      await audioEngine.loadSound('fire', '/assets/Выстрел.mp3');
      await audioEngine.loadSound('hit', 'https://res.cloudinary.com/djihbhmzz/video/upload/v1772736714/%D0%9F%D0%BE%D0%BF%D0%B0%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5_%D0%B2_%D1%80%D0%B5%D0%B4_%D1%84%D0%BB%D0%B0%D0%B3_uaveio.mp3');
      await audioEngine.loadSound('hitShip', 'https://res.cloudinary.com/djihbhmzz/video/upload/v1772800586/%D0%BF%D0%BE%D0%BF%D0%B0%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5_%D0%B2_%D0%BA%D0%BE%D1%80%D0%B0%D0%B1%D0%BB%D1%8C_rxmsbs.mp3');
      await audioEngine.loadSound('explosion', 'https://res.cloudinary.com/djihbhmzz/video/upload/v1772640679/%D0%92%D0%B7%D1%80%D1%8B%D0%B2_n8kw41.mp3');
      await audioEngine.loadSound('fact', 'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%B7%D0%B2%D1%83%D0%BA_%D1%84%D0%B0%D0%BA%D1%82%D0%B0_n1qwe2.mp3');
      await audioEngine.loadSound('dialogue', 'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488777/%D0%A0%D0%B5%D0%BF%D0%BB%D0%B8%D0%BA%D0%B0_%D0%B2_%D1%80%D0%B0%D0%BD%D0%BD%D0%B5%D1%80%D0%B5_nymdvj.mp3');
      await audioEngine.loadSound('boss_explosion', 'https://res.cloudinary.com/djihbhmzz/video/upload/v1772998980/%D0%B2%D0%B7%D1%80%D1%8B%D0%B2_%D0%B1%D0%BE%D1%81%D1%81%D0%B0_dyovo0.mp3');
      await audioEngine.loadSound('dopcost', 'https://res.cloudinary.com/djihbhmzz/video/upload/v1773004860/%D0%94%D0%BE%D0%BF%D0%BA%D0%BE%D1%81%D1%82_mdmifs.mp3');
      await audioEngine.loadSound('victory', 'https://res.cloudinary.com/djihbhmzz/video/upload/v1773197854/%D0%9F%D0%BE%D0%B1%D0%B5%D0%B4%D0%B0_clfpxc.mp3');
    };

    initAudio();

    const resumeAudio = async () => {
      if (!audioInitializedRef.current) {
        await audioEngine.resume();
        audioInitializedRef.current = true;
      }
    };

    document.addEventListener('touchstart', resumeAudio, { once: true });
    document.addEventListener('click', resumeAudio, { once: true });

    return () => {
      document.removeEventListener('touchstart', resumeAudio);
      document.removeEventListener('click', resumeAudio);
    };
  }, []);

  useEffect(() => {
    if (!showBossWarning && bossTriggeredRef.current && !boss && !isBossActive && !isTransitioning) {
      bossTriggeredRef.current = false;
      setBoss({
        id: Date.now(),
        health: 25,
        startTime: Date.now(),
        isDying: false
      });
      setIsBossActive(true);
    }
  }, [showBossWarning, boss, isBossActive, isTransitioning]);


  useEffect(() => {
    if (enemySpawnTimerRef.current) {
      clearTimeout(enemySpawnTimerRef.current);
      enemySpawnTimerRef.current = null;
    }

    if (showTitle || isGameOver || isVictory || !gameplayStartedRef.current) {
      return;
    }

    if (showBossWarning || isBossActive || showAsteroidWarning) {
      return;
    }

    if (killCount >= 26 && !isIntensePhase) {
      return;
    }

    const spawnEnemy = () => {
      if (showTitle || isGameOver || isVictory || !gameplayStartedRef.current) {
        return;
      }

      if (showBossWarning || isBossActive || showAsteroidWarning) {
        return;
      }

      if (killCount >= 26 && !isIntensePhase) {
        return;
      }

      const randomLane = Math.floor(Math.random() * 3) as Lane;
      const randomType = Math.floor(Math.random() * 3);
      const isAsteroid = isIntensePhase && Math.random() < 0.3;

      setEnemies(prev => [...prev, {
        id: enemyIdRef.current++,
        lane: randomLane,
        type: randomType,
        startTime: Date.now(),
        isAsteroid
      }]);

      const baseDelay = 1500 + Math.random() * 1500;
      const nextSpawnDelay = isIntensePhase ? baseDelay * 0.4 : baseDelay;
      enemySpawnTimerRef.current = setTimeout(spawnEnemy, nextSpawnDelay);
    };

    const baseInitialDelay = 500 + Math.random() * 1000;
    const initialDelay = isIntensePhase ? baseInitialDelay * 0.5 : baseInitialDelay;
    enemySpawnTimerRef.current = setTimeout(spawnEnemy, initialDelay);

    return () => {
      if (enemySpawnTimerRef.current) {
        clearTimeout(enemySpawnTimerRef.current);
      }
    };
  }, [killCount, showTitle, showBossWarning, isBossActive, showAsteroidWarning, isGameOver, isVictory, isIntensePhase]);

  useEffect(() => {
    enemiesRef.current = enemies;
  }, [enemies]);

  useEffect(() => {
    killCountRef.current = killCount;
  }, [killCount]);

  useEffect(() => {
    if (heartSpawnTimerRef.current) {
      clearTimeout(heartSpawnTimerRef.current);
      heartSpawnTimerRef.current = null;
    }

    if (showTitle || isGameOver || isVictory || !gameplayStartedRef.current) {
      return;
    }

    if (showBossWarning || isBossActive || showAsteroidWarning) {
      return;
    }

    const spawnHeart = () => {
      if (showTitle || isGameOver || isVictory || !gameplayStartedRef.current) {
        return;
      }

      if (showBossWarning || isBossActive || showAsteroidWarning) {
        return;
      }

      const findSafeLane = (): Lane | null => {
        const lanes: Lane[] = [0, 1, 2];
        const shuffledLanes = lanes.sort(() => Math.random() - 0.5);

        for (const lane of shuffledLanes) {
          const hasCloseEnemy = enemiesRef.current.some(enemy => {
            if (enemy.lane !== lane) return false;
            const timeSinceSpawn = Date.now() - enemy.startTime;
            return timeSinceSpawn < 1500;
          });

          if (!hasCloseEnemy) {
            return lane;
          }
        }

        return null;
      };

      const safeLane = findSafeLane();

      if (safeLane !== null) {
        setHearts(prev => [...prev, {
          id: heartIdRef.current++,
          lane: safeLane,
          startTime: Date.now()
        }]);

        heartSpawnTimerRef.current = setTimeout(spawnHeart, 30000);
      } else {
        heartSpawnTimerRef.current = setTimeout(spawnHeart, 1000);
      }
    };

    const initialHeartDelay = 25000;
    heartSpawnTimerRef.current = setTimeout(spawnHeart, initialHeartDelay);

    return () => {
      if (heartSpawnTimerRef.current) {
        clearTimeout(heartSpawnTimerRef.current);
      }
    };
  }, [showTitle, showBossWarning, isBossActive, showAsteroidWarning, isGameOver, isVictory, isIntensePhase]);

  useEffect(() => {
    if (!postBossTimestamp || isGameOver || isVictory) return;

    const universalDialogues = [
      { delay: 14000, text: 'Не забудь посмотреть портфолио' },
      { delay: 29000, text: 'Ого. Ты все еще здесь' },
      { delay: 42000, text: 'Может, пора остановиться?' },
      { delay: 55000, text: 'Хм. А до тысячи слабо?' },
      { delay: 65000, text: 'У каких дизайнеров нет переработок?' },
      { delay: 73000, text: 'У безработных! ХА-ХА-ХА' },
      { delay: 84000, text: 'А ты не из тех, кто быстро сдается, да?' },
      { delay: 99000, text: 'Надели на креатора выгорание, а оно ему как раз' },
      { delay: 109000, text: 'Нет, серьезно, портфолио-то будем смотреть?' },
    ];

    const timers: NodeJS.Timeout[] = [];

    universalDialogues.forEach(({ delay, text }) => {
      const timer = setTimeout(() => {
        if (isGameOver || isVictory) return; 
        if (!universalDialoguesTriggeredRef.current.has(delay)) {
          universalDialoguesTriggeredRef.current.add(delay);
          audioEngine.play('dialogue', 1.0);
          setActiveDialogue(text);
        }
      }, delay);
      timers.push(timer);
    });
    if (isGameOver || isVictory) {
  setActiveDialogue(null);
  return;
    }

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [postBossTimestamp, isGameOver, isVictory]);

  useEffect(() => {
    if (score >= 1000 && !easterEggDialogueShown) {
      setEasterEggDialogueShown(true);
      audioEngine.play('dialogue', 1.0);
      setActiveDialogue('Ну ладно, ты победил. Лови пасхалку');

      setTimeout(() => {
        setIsVictory(true);
        setActiveDialogue(null);

        if (currentLane !== 1) {
          setCurrentLane(1);
          shipPositionRef.current = 1;
        }

        setTimeout(() => {
          soundEffects.play('victory');
        }, 100);

        setShowVictoryTitle(true);

        setTimeout(() => {
          setShowVictoryStats(true);
        }, 1000);

        setTimeout(() => {
          setShowVictoryButtons(true);
        }, 1000);
      }, 2500);
    }
  }, [score, easterEggDialogueShown, currentLane]);

  const handleEntryGlitchComplete = () => {
    setShowEntryGlitch(false);
  };

  const playButtonSound = () => {
    const audio = new Audio('https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0_oztdlq.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  const handleBack = () => {
    playButtonSound();
    setTimeout(() => onBack(), 100);
  };

  const moveLeft = () => {
    if (isGameOver) return;

    const isUILocked = showTitle || showBossWarning || showAsteroidWarning;
    if (isUILocked) return;

    if (!victoryWarmedUpRef.current) {
      victoryWarmedUpRef.current = true;
      soundEffects.warmUpSounds(['victory']);
    }

    setCurrentLane(prev => {
      const newLane = Math.max(0, prev - 1) as Lane;
      shipPositionRef.current = newLane;
      return newLane;
    });
  };

  const moveRight = () => {
    if (isGameOver) return;

    const isUILocked = showTitle || showBossWarning || showAsteroidWarning;
    if (isUILocked) return;

    if (!victoryWarmedUpRef.current) {
      victoryWarmedUpRef.current = true;
      soundEffects.warmUpSounds(['victory']);
    }

    setCurrentLane(prev => {
      const newLane = Math.min(2, prev + 1) as Lane;
      shipPositionRef.current = newLane;
      return newLane;
    });
  };

  const handleFire = () => {
    if (isGameOver) return;

    const isUILocked = showTitle || showBossWarning || showAsteroidWarning;
    if (isUILocked) return;

    audioEngine.play('fire', 0.8);

    if (!victoryWarmedUpRef.current) {
      victoryWarmedUpRef.current = true;
      soundEffects.warmUpSounds(['victory']);
    }

    const newBullet: Bullet = {
      id: bulletIdRef.current++,
      x: shipPositionRef.current,
      startY: 80,
      startTime: Date.now()
    };

    setBullets(prev => [...prev, newBullet]);

    setShowMuzzleFlash(true);
    setTimeout(() => setShowMuzzleFlash(false), 20);
  };

  const getFavoriteRedFlag = (): string => {
    const entries = Object.entries(stats.phraseFrequency);
    if (entries.length === 0) return '—';

    const sorted = entries.sort((a, b) => b[1] - a[1]);
    return sorted[0][0];
  };

  const handleRestart = () => {
    playButtonSound();

    if (enemySpawnTimerRef.current) {
      clearTimeout(enemySpawnTimerRef.current);
      enemySpawnTimerRef.current = null;
    }
    if (heartSpawnTimerRef.current) {
      clearTimeout(heartSpawnTimerRef.current);
      heartSpawnTimerRef.current = null;
    }

    setScore(0);
    setLives(3);
    setCurrentLane(1);
    shipPositionRef.current = 1;
    setBullets([]);
    setEnemies([]);
    setHitEffects([]);
    setDyingEnemies([]);
    setIsInvulnerable(false);
    setShipFlash(false);
    setIsGameOver(false);
    setShowExplosion(false);
    setStats({ destroyed: 0, missed: 0, phraseFrequency: {} });
    setKillCount(0);
    setActiveFacts([]);
    setActiveDialogue(null);
    dialogueTriggeredRef.current.clear();
    setShowBossWarning(false);
    setBoss(null);
    setIsBossActive(false);
    setBossExplosion(false);
    bossTriggeredRef.current = false;
    setHearts([]);
    setIsGoldGlow(false);
    setShowDopcostTitle(false);
    setLifeGlow(false);
    setIsIntensePhase(false);
    setShowAsteroidWarning(false);
    setPostBossTimestamp(null);
    setIsTransitioning(false);
    setShow1000Button(false);
    setEasterEggDialogueShown(false);
    universalDialoguesTriggeredRef.current.clear();
    setIsVictory(false);
    setShowVictoryTitle(false);
    setShowVictoryStats(false);
    setShowVictoryButtons(false);
    heartIdRef.current = 0;
    bulletIdRef.current = 0;
    enemyIdRef.current = 0;
    victoryWarmedUpRef.current = false;
    gameStartTimeRef.current = Date.now();
    gameplayStartedRef.current = false;
    setShowTitle(true);
  };

  const handleChangeHero = () => {
    playButtonSound();
    if (onChangeHero) {
      setTimeout(() => onChangeHero(), 100);
    }
  };

  const handleMainMenu = () => {
    playButtonSound();
    if (onMainMenu) {
      setTimeout(() => onMainMenu(), 100);
    }
  };

  const handleBulletComplete = (bulletId: number) => {
    setBullets(prev => prev.filter(b => b.id !== bulletId));
  };

  const handleEnemyComplete = (enemyId: number) => {
    setEnemies(prev => {
      const enemy = prev.find(e => e.id === enemyId);
      if (enemy && !dyingEnemies.includes(enemyId)) {
        setStats(s => ({ ...s, missed: s.missed + 1 }));
      }
      return prev.filter(e => e.id !== enemyId);
    });
  };

  const handleHeartComplete = (heartId: number) => {
    setHearts(prev => prev.filter(h => h.id !== heartId));
  };

  const getRandomPhrase = (lane: Lane): string => {
    if (lane === 1 && Math.random() < 0.3) {
      return cringePhrases.center[Math.floor(Math.random() * cringePhrases.center.length)];
    }
    return cringePhrases.all[Math.floor(Math.random() * cringePhrases.all.length)];
  };

  useEffect(() => {
    const checkCollisions = () => {
      if (isGameOver) return;

      const bulletsToRemove: number[] = [];
      const enemiesToRemove: number[] = [];
      const newHitEffects: HitEffect[] = [];

      const gameField = document.getElementById('game-field');
      if (!gameField) return;

      const fieldRect = gameField.getBoundingClientRect();

      // Check bullet-boss collisions
      if (boss && !boss.isDying) {
        bullets.forEach(bullet => {
          if (bulletsToRemove.includes(bullet.id)) return;

          const bulletElement = document.getElementById(`bullet-${bullet.id}`);
          if (!bulletElement) return;

          const bulletRect = bulletElement.getBoundingClientRect();

          const bossElement = document.getElementById('boss-enemy');
          if (!bossElement) return;

          const bossRect = bossElement.getBoundingClientRect();

          if (
            bulletRect.top <= bossRect.bottom &&
            bulletRect.bottom >= bossRect.top &&
            bullet.x === 1
          ) {
            bulletsToRemove.push(bullet.id);
            audioEngine.play('hit', 1.0);

            setBoss(prev => {
              if (!prev) return prev;
              const newHealth = prev.health - 1;

              if (newHealth <= 0) {
                setBossExplosion(true);
                audioEngine.play('boss_explosion', 1);
                setIsFlashActive(true);
                setTimeout(() => setIsFlashActive(false), 3000); 

                const field = document.getElementById('game-field');
                const fieldWidth = field ? field.clientWidth : window.innerWidth;
                const hitX = (fieldWidth / 2) - 140; 
                const hitY = bossRect.top + (bossRect.height / 2) - fieldRect.top;

                newHitEffects.push({
                  id: Date.now() + Math.random(),
                  x: hitX,
                  y: hitY,
                  phrase: 'ТЫ ЖЕ КРЕАТОР,\nПРИДУМАЙ ЧТО-НИБУДЬ',
                  lane: 1
                });
                setHitEffects(prev => [...prev, ...newHitEffects]);

                setScore(prev => prev + 300);
                setPostBossTimestamp(Date.now());

                setTimeout(() => {
                  setBoss(null);
                  setIsBossActive(false);
                  setBossExplosion(false);
                  setIsTransitioning(true);

                  setTimeout(() => {
                    setIsTransitioning(false);
                    setShowAsteroidWarning(true);
                  }, 1000);
                }, 2300);

                return { ...prev, health: 0, isDying: true };
              }

              return { ...prev, health: newHealth };
            });
          }
        });
      }

      // Check bullet-enemy collisions
      bullets.forEach(bullet => {
        if (bulletsToRemove.includes(bullet.id)) return;

        const bulletElement = document.getElementById(`bullet-${bullet.id}`);
        if (!bulletElement) return;

        const bulletRect = bulletElement.getBoundingClientRect();

        enemies.forEach(enemy => {
          if (enemiesToRemove.includes(enemy.id)) return;

          if (bullet.x !== enemy.lane) return;

          const enemyElement = document.getElementById(`enemy-${enemy.id}`);
          if (!enemyElement) return;

          const enemyRect = enemyElement.getBoundingClientRect();

          if (
            bulletRect.top <= enemyRect.bottom &&
            bulletRect.bottom >= enemyRect.top
          ) {
            bulletsToRemove.push(bullet.id);

            if (enemy.isAsteroid) {
              return;
            }

            enemiesToRemove.push(enemy.id);

            const hitX = enemyRect.left + (enemyRect.width / 2) - fieldRect.left;
            const hitY = enemyRect.top + (enemyRect.height / 2) - fieldRect.top;

            const phrase = getRandomPhrase(enemy.lane);
            newHitEffects.push({
              id: Date.now() + Math.random(),
              x: hitX,
              y: hitY,
              phrase,
              lane: enemy.lane
            });

            audioEngine.play('hit', 1.0);
            setDyingEnemies(prev => [...prev, enemy.id]);
            setScore(prev => prev + 7);

            setStats(s => ({
              ...s,
              destroyed: s.destroyed + 1,
              phraseFrequency: {
                ...s.phraseFrequency,
                [phrase]: (s.phraseFrequency[phrase] || 0) + 1
              }
            }));

            setKillCount(prev => {
              const newCount = prev + 1;

              if (newCount === 26) {
                if (enemySpawnTimerRef.current) {
                  clearTimeout(enemySpawnTimerRef.current);
                  enemySpawnTimerRef.current = null;
                }
              }

              const factIndex = spaceFacts.findIndex(f => f.kills === newCount);

              if (factIndex !== -1) {
                const colors = ['#C084FC', '#00F0FF'];
                const factId = Date.now() + Math.random();
                const factColor = colors[factIndex % 2];
                setTimeout(() => {
                  audioEngine.play('fact', 0.2);

                  setActiveFacts(current => [...current, {
                    id: factId,
                    text: spaceFacts[factIndex].text,
                    color: factColor
                  }]);

                  setTimeout(() => {
                    setActiveFacts(current => current.filter(f => f.id !== factId));
                  }, 2000);
                }, 1000);

                const dialogue = heroDialogues[heroId]?.find(d => d.trigger === newCount);
                if (dialogue && !dialogueTriggeredRef.current.has(newCount)) {
                  dialogueTriggeredRef.current.add(newCount);
                  const isLastDialogue = heroDialogues[heroId].indexOf(dialogue) === heroDialogues[heroId].length - 1;

                  setTimeout(() => {
                    audioEngine.play('dialogue', 1.0);
                    setActiveDialogue(dialogue.text);
                  }, 3000);

                  if (isLastDialogue && !bossTriggeredRef.current) {
                    bossTriggeredRef.current = true;

                    setTimeout(() => {
                      if (!showBossWarning && !showAsteroidWarning) {
                        setShowBossWarning(true);
                      }
                    }, 6000);
                  }
                }
              }

              return newCount;
            });

            return;
          }
        });
      });

      // Check boss boundary (critical failure)
      if (boss && !boss.isDying) {
        const bossElement = document.getElementById('boss-enemy');
        if (bossElement) {
          const bossRect = bossElement.getBoundingClientRect();
          const bottomBoundary = window.innerHeight - UI_BOTTOM_HEIGHT - 100;

          if (bossRect.top >= bottomBoundary && !isInvulnerable) {
            audioEngine.play('explosion', 0.8);
            setBossExplosion(true);
            const damage = 2;
            const newLives = Math.max(0, lives - damage);
            setLives(newLives);
            setShipFlash(true);
            setIsInvulnerable(true);
            setTimeout(() => setShipFlash(false), 500);
            setTimeout(() => setIsInvulnerable(false), 5000);
            if (newLives === 0) {
              setShowExplosion(true);
              setTimeout(() => setIsGameOver(true), 1200);
            }
            setPostBossTimestamp(Date.now());
            setTimeout(() => {
              setBoss(null);
              setIsBossActive(false);
              setBossExplosion(false);
              setIsTransitioning(true);

              setTimeout(() => {
                setIsTransitioning(false);
                setShowAsteroidWarning(true);
              }, 1000);
            }, 2300);
            return;
          }
        }
      }

      // Check heart-ship collisions
      const shipElement = document.getElementById('player-ship');
      if (shipElement) {
        const shipRect = shipElement.getBoundingClientRect();

        hearts.forEach(heart => {
          if (heart.lane !== currentLane) return;

          const heartElement = document.getElementById(`heart-${heart.id}`);
          if (!heartElement) return;

          const heartRect = heartElement.getBoundingClientRect();

          if (
            heartRect.bottom >= shipRect.top &&
            heartRect.top <= shipRect.bottom
          ) {
            setHearts(prev => prev.filter(h => h.id !== heart.id));
            setScore(prev => prev + 20);

            if (lives < 3) {
              setLives(prev => prev + 1);
            }

            audioEngine.play('dopcost', 0.8);

            setIsGoldGlow(true);
            setShowDopcostTitle(true);
            setIsInvulnerable(true);
            setLifeGlow(true);

            setTimeout(() => setLifeGlow(false), 1000);

            setTimeout(() => {
              setIsGoldGlow(false);
              setShowDopcostTitle(false);
              setIsInvulnerable(false);
            }, 4000);
          }
        });
      }

      // Check enemy-ship collisions
      if (!isInvulnerable && score < 1000) {
        if (shipElement) {
          const shipRect = shipElement.getBoundingClientRect();

          enemies.forEach(enemy => {
            if (isInvulnerable || score >= 1000 || bossExplosion || (boss && boss.isDying)) return;
            if (enemiesToRemove.includes(enemy.id)) return;
            if (enemy.lane !== currentLane) return;

            const enemyElement = document.getElementById(`enemy-${enemy.id}`);
            if (!enemyElement) return;

            const enemyRect = enemyElement.getBoundingClientRect();

            if (
              enemyRect.bottom >= shipRect.top &&
              enemyRect.top <= shipRect.bottom
            ) {
              if (!enemy.isAsteroid) {
                enemiesToRemove.push(enemy.id);
              }

              if (lives > 1) {
                audioEngine.play('hitShip', 0.25);
                setLives(prev => prev - 1);
                setIsInvulnerable(true);
                setShipFlash(true);
                setTimeout(() => setShipFlash(false), 500);
                setTimeout(() => setIsInvulnerable(false), 3000);
              } else {
                audioEngine.play('explosion', 0.8);
                setShowExplosion(true);
                setLives(0);
                setIsInvulnerable(true);
                setTimeout(() => {
                  setIsGameOver(true);
                }, 1200);
              }
            }
          });
        }
      }

      if (bulletsToRemove.length > 0) {
        setBullets(prev => prev.filter(b => !bulletsToRemove.includes(b.id)));
      }
      if (enemiesToRemove.length > 0) {
        setTimeout(() => {
          setEnemies(prev => prev.filter(e => !enemiesToRemove.includes(e.id)));
          setDyingEnemies(prev => prev.filter(id => !enemiesToRemove.includes(id)));
        }, 30);
      }
      if (newHitEffects.length > 0) {
        setHitEffects(prev => [...prev, ...newHitEffects]);

        newHitEffects.forEach(effect => {
          setTimeout(() => {
            setHitEffects(prev => prev.filter(e => e.id !== effect.id));
          }, 2000);
        });
      }
    };

    const interval = setInterval(checkCollisions, 16);
    return () => clearInterval(interval);
  }, [bullets, enemies, isInvulnerable, currentLane, lives, isGameOver, boss, hearts]);

  const UI_BOTTOM_HEIGHT = 160;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-hidden"
      style={{
        background: 'transparent',
        imageRendering: 'pixelated',
        WebkitFontSmoothing: 'none',
        MozOsxFontSmoothing: 'grayscale',
        height: '100dvh',
        maxHeight: '100dvh',
        width: '100%',
        padding: 0,
        margin: 0
      }}
    >
      <>
          <AnimatePresence>
            {activeDialogue && (
              <SpaceDialogue
                text={activeDialogue}
                heroPortrait={heroes[heroId].portrait}
                onComplete={() => setActiveDialogue(null)}
              />
            )}
          </AnimatePresence>

          <motion.div
            className="relative pt-6 pb-4 px-4 flex items-center justify-between"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0 }}
            style={{ zIndex: 150 }}
          >
            {!isGameOver ? (
              <button
                onClick={handleBack}
                className="text-white mobile-white-pixel text-sm active:scale-95 transition-transform"
                style={{
                  textShadow: '3px 3px 0px rgba(0,0,0,0.9)',
                  imageRendering: 'pixelated'
                }}
              >
                &lt; НАЗАД
              </button>
            ) : null}

            {!isGameOver && !isVictory && (
              <div className="flex items-center gap-3">
                <span
                  className="mobile-white-pixel font-bold"
                  style={{
                    fontSize: '1.40875rem',
                    color: '#ffffff',
                    textShadow: '2px 2px 0px rgba(0,0,0,0.9)',
                    imageRendering: 'pixelated'
                  }}
                >
                  СЧЕТ
                </span>
                <span
                  className="mobile-white-pixel"
                  style={{
                    fontSize: '1.40875rem',
                    color: '#FFD700',
                    textShadow: '2px 2px 0px rgba(0,0,0,0.9)',
                    imageRendering: 'pixelated'
                  }}
                >
                  {score}
                </span>
              </div>
            )}

            <div style={{ width: '28px' }}>
              <AudioToggle />
            </div>
          </motion.div>

          <div className="flex-1" style={{ position: 'relative' }} />

          <div
            id="game-field"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              overflow: 'visible',
              opacity: isGameOver ? 0 : 1,
              transition: 'opacity 0.3s ease-out'
            }}
          >
            <div
              style={{
                position: 'absolute',
                display: 'block',
                top: 0,
                left: '16px',
                right: '16px',
                bottom: `${UI_BOTTOM_HEIGHT}px`,
                pointerEvents: 'none'
              }}
            >
              {boss && (
                <motion.div
                  id="boss-enemy"
                  initial={{ y: -200 }}
                  animate={{ y: bossExplosion ? boss.y : window.innerHeight + 100,
                           x: (boss && boss.health <= 5 && !bossExplosion) ? [0, -6, 6, -6, 6, 0] : 0}}
                  transition={{
                    x: {
                      repeat: Infinity,
                        duration: 0.1,
                        ease: "linear" 
                    },
                    y: { duration: 12, ease: "linear" },
                    duration: 12,
                    ease: 'linear'
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    marginLeft: `-${(93.53 * 2.4) / 2}px`,
                    transform: 'none',
                    width: `${93.53 * 2.4}px`,
                    height: `${70.72 * 2.4}px`,
                    pointerEvents: 'none',
                    zIndex: 4,
                    filter: 'drop-shadow(0 0 15px #BB2649)',
                    willChange: 'transform, filter',
                    WebkitBackfaceVisibility: 'hidden'
                  }}
                >
                  <img
                    src={bossExplosion
                      ? 'https://res.cloudinary.com/djihbhmzz/image/upload/v1772800602/%D0%B2%D0%B7%D1%80%D1%8B%D0%B2_%D0%BA%D0%BE%D1%80%D0%B0%D0%B1%D0%BB%D1%8F_gtrijg.gif'
                      : 'https://res.cloudinary.com/djihbhmzz/image/upload/v1772961008/%D0%B1%D0%BE%D1%81%D1%81_%D1%80%D0%B5%D0%B4_%D1%84%D0%BB%D0%B0%D0%B3_jwecm2.gif'
                    }
                    alt="Boss Red Flag"
                    style={{
                      padding: '10px',
                      width: '100%',
                      height: '100%',
                      imageRendering: 'pixelated',
                      filter: (boss && boss.health <= 5 && !bossExplosion) ? 'hue-rotate(90deg) brightness(1.2) drop-shadow(0 0 10px #FF0000)' : 'none',
                      objectFit: 'contain'
                    }}
                  />
                </motion.div>
              )}

              {hearts.map((heart) => {
                const laneWidth = 100 / 3;
                const heartLeft = (laneWidth * heart.lane) + (laneWidth / 2);
                const heartWidth = 93.53 * 0.7;
                const heartHeight = 70.72 * 0.7;

                return (
                  <motion.div
                    key={heart.id}
                    id={`heart-${heart.id}`}
                    initial={{ y: -100 }}
                    animate={{ y: window.innerHeight + 100 }}
                    transition={{
                      duration: 4,
                      ease: 'linear'
                    }}
                    onAnimationComplete={() => handleHeartComplete(heart.id)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: `calc(${heartLeft}% - ${heartWidth / 2}px)`,
                      width: `${heartWidth}px`,
                      height: `${heartHeight}px`,
                      pointerEvents: 'none',
                      willChange: 'transform',
                      WebkitBackfaceVisibility: 'hidden',
                      filter: 'none',
                      zIndex: 3
                    }}
                  >
                    <img
                      src="https://res.cloudinary.com/djihbhmzz/image/upload/v1773003898/%D1%81%D0%B5%D1%80%D0%B4%D0%B5%D1%87%D0%BA%D0%BE_wfywag.gif"
                      alt="Heart"
                      style={{
                        width: '100%',
                        height: '100%',
                        imageRendering: 'pixelated',
                        filter: 'none',
                        objectFit: 'contain'
                      }}
                    />
                  </motion.div>
                );
              })}

              {enemies.map((enemy) => {
                const laneWidth = 100 / 3;
                const enemyLeft = (laneWidth * enemy.lane) + (laneWidth / 2);
                const isDying = dyingEnemies.includes(enemy.id);
                const animationDuration = isIntensePhase ? 4 * 0.85 : 4;
                const enemyWidth = enemy.isAsteroid ? '74.824px' : '93.53px';
                const enemyHeight = enemy.isAsteroid ? '56.576px' : '70.72px';
                const enemyOffset = enemy.isAsteroid ? '37.412px' : '46.765px';

                return (
                  <motion.div
                    key={enemy.id}
                    id={`enemy-${enemy.id}`}
                    initial={{ y: -100 }}
                    animate={{ y: window.innerHeight + 100 }}
                    transition={{
                      duration: animationDuration,
                      ease: 'linear'
                    }}
                    onAnimationComplete={() => handleEnemyComplete(enemy.id)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: `calc(${enemyLeft}% - ${enemyOffset})`,
                      width: enemyWidth,
                      height: enemyHeight,
                      pointerEvents: 'none',
                      zIndex: 3
                    }}
                  >
                    <img
                      src={enemy.isAsteroid ? asteroidGif : enemyGifs[enemy.type]}
                      alt={enemy.isAsteroid ? "Asteroid" : "Red flag enemy"}
                      style={{
                        width: '100%',
                        height: '100%',
                        imageRendering: 'pixelated',
                        willChange: 'transform, filter',
                        WebkitBackfaceVisibility: 'hidden',
                        filter: (!enemy.isAsteroid && isDying) ? 'brightness(0) invert(1)' : (enemy.isAsteroid ? 'none' : 'drop-shadow(0 0 5px #BB2649)'),
                        objectFit: 'contain'
                      }}
                    />
                  </motion.div>
                );
              })}

              {bullets.map((bullet) => {
                const laneWidth = 100 / 3;
                const bulletLeft = (laneWidth * bullet.x) + (laneWidth / 2);

                return (
                  <motion.div
                    key={bullet.id}
                    id={`bullet-${bullet.id}`}
                    initial={{ y: 0 }}
                    animate={{ y: -1000 }}
                    transition={{
                      duration: 1.1,
                      ease: 'linear'
                    }}
                    onAnimationComplete={() => handleBulletComplete(bullet.id)}
                    style={{
                      position: 'absolute',
                      bottom: '70.72px',
                      left: `calc(${bulletLeft}% - 1.5px)`,
                      width: '3px',
                      height: '10px',
                      background: 'linear-gradient(to top, #FF00FF 0%, #ffffff 50%, #FF00FF 100%)',
                      boxShadow: '0 0 8px #FF00FF, inset 0 0 2px #ffffff',
                      imageRendering: 'pixelated',
                      willChange: 'transform',
                      pointerEvents: 'none',
                      zIndex: 5
                    }}
                  />
                );
              })}

              {hitEffects.map((hit) => {
                const isREPhrase = hit.phrase === 'RE:ПРАВКИ';
                const isPrivetPhrase = hit.phrase.includes('Привет');
                const isBossPhrase = hit.phrase.toUpperCase().includes('КРЕАТОР');

                return (
                  <motion.div
                    key={hit.id}
                    initial={{ opacity: 0, scale: 0.5, y: 0 }}
                    animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.1, 1], y: 60 }}
                    transition={{
                      duration: isBossPhrase ? 3.5 : 1.5,
                      times: [0, 0.1, 0.9, 1],
                      ease: 'easeOut'
                    }}
                    style={{
                      position: 'absolute',
                      left: hit.x,
                      top: hit.y,
                      transform: isBossPhrase ? 'translate(-50%, -50%)' : 'none',
                      width: isBossPhrase ? '280px' : '200px',
                      marginLeft: isBossPhrase ? '0' : '-100px',
                      marginTop: isBossPhrase ? '0' : '-20px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      pointerEvents: 'none',
                      zIndex: 10
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: isBossPhrase ? '16px' : '12px',
                        fontWeight: 'bold',
                        color: '#FFFFFF',
                        textAlign: 'center',
                        display: 'inline-block',
                        textTransform: 'uppercase',
                        textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000',
                        filter: 'drop-shadow(0 0 4px rgba(220, 20, 60, 0.8)) drop-shadow(0 0 10px rgba(187, 38, 73, 0.4))',
                        whiteSpace: isREPhrase ? 'nowrap' : (isPrivetPhrase || isBossPhrase ? 'pre-line' : 'normal'),
                        wordBreak: 'keep-all',
                        maxWidth: isREPhrase ? 'none' : (isBossPhrase ? '280px' : (isPrivetPhrase ? '200px' : '100px')),
                        lineHeight: '1.2'
                      }}
                    >
                      {hit.phrase}
                    </div>
                  </motion.div>
                );
              })}

              {activeFacts.map((fact,index) => (
                <motion.div
                  key={fact.id}
                  initial={{ opacity: 0, x: [-5, 5, -3, 3, 0] }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    times: [0, 0.1, 0.75, 1],
                    ease: 'easeOut'
                  }}
                  style={{
                    position: 'fixed',
                    top: '45%',
                    left: spaceFacts.findIndex(f => f.text === fact.text) % 2 === 0 ? '8%' : 'auto',
                    right: spaceFacts.findIndex(f => f.text === fact.text) % 2 === 0 ? 'auto' : '8%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    alignItems: spaceFacts.findIndex(f => f.text === fact.text) % 2 === 0 ? 'flex-start' : 'flex-end',
                    pointerEvents: 'none',
                    zIndex: 100
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Press Start 2P', monospace",
                      fontSize: fact.text.includes('протеиновых', 'турнике') ? '1.2rem' : '1.5rem',
                      color: fact.color,
                      textShadow: `
                        1px 1px 0 #000,
                        -1px -1px 0 #000,
                        1px -1px 0 #000,
                        -1px 1px 0 #000
                      `,
                      filter: `drop-shadow(0 0 4px ${fact.color})`,
                      whiteSpace: fact.text.includes('19') ? 'nowrap' : 'pre-line',
                      lineHeight: '1.4',
                      padding: '0 20px',
                      imageRendering: 'pixelated',
                      textTransform: 'uppercase',
                      maxWidth: 'none',
                      width: 'max-content',
                      textAlign: spaceFacts.findIndex(f => f.text === fact.text) % 2 === 0 ? 'left' : 'right',
                    }}
                  >
                    {fact.text}
                  </div>
                </motion.div>
              ))}

            </div>

            <div
              style={{
                position: 'absolute',
                left: '16px',
                right: '16px',
                bottom: '130px',
                pointerEvents: 'none'
              }}
            >
              <div
                className="grid grid-cols-3 gap-2"
                style={{
                  position: 'relative'
                }}
              >
                <motion.div
                  id="player-ship"
                  initial= {{
                    x: '100%',
                    y: 100,
                    opacity: 0
                  }}
                  animate={{
                    x: currentLane === 0 ? '0%' : currentLane === 1 ? '100%' : '200%',
                    y: [0, -8, 0],
                    opacity: isVictory ? 0 : (isInvulnerable && !shipFlash ? [1, 0.5, 1] : 1)
                  }}
                  transition={{
                    x: {
                      type: 'tween',
                      duration: 0.2,
                      ease: "easeOut"
                    },
                    y: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    },
                    opacity: {
                      duration: 0.3,
                      repeat: isInvulnerable && !shipFlash ? Infinity : 0,
                      ease: "linear"
                    }
                  }}
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    width: `${100 / 3}%`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    pointerEvents: 'none',
                    willChange: 'transform',
                    zIndex: 10
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <img
                      src={showExplosion ? 'https://res.cloudinary.com/djihbhmzz/image/upload/v1772800602/%D0%B2%D0%B7%D1%80%D1%8B%D0%B2_%D0%BA%D0%BE%D1%80%D0%B0%D0%B1%D0%BB%D1%8F_gtrijg.gif' : spaceships[heroId]}
                      alt={`${hero.name} spaceship`}
                      style={{
                        width: showExplosion ? '152px' : '93.53px',
                        height: showExplosion ? '114.875px' : '70.72px',
                        imageRendering: 'pixelated',
                        filter: shipFlash
                          ? 'brightness(0) invert(1)'
                          : isGoldGlow
                            ? 'drop-shadow(0 0 20px #FFD700) drop-shadow(0 0 30px rgba(255, 215, 0, 0.8))'
                            : 'drop-shadow(0 0 16px rgba(187, 38, 73, 0.5))',
                        display: 'block',
                        objectFit: 'contain'
                      }}
                    />
                    {showMuzzleFlash && !isGameOver && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '-10px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '16px',
                          height: '16px',
                          background: 'radial-gradient(circle, #ffffff 0%, #FF00FF 50%, transparent 70%)',
                          boxShadow: '0 0 20px #FF00FF, 0 0 40px #ffffff',
                          borderRadius: '50%',
                          pointerEvents: 'none',
                          imageRendering: 'pixelated',
                          zIndex: 15
                        }}
                      />
                    )}
                  </div>
                </motion.div>
                {[0, 1, 2].map((laneIndex) => (
                  <div
                    key={laneIndex}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                      position: 'relative',
                      height: '83.2px'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <motion.div
            className="px-4"
            style={{
              paddingBottom: 'max(20px, env(safe-area-inset-bottom, 20px))',
              height: '16.67vh',
              minHeight: '140px',
              maxHeight: '180px',
              zIndex: 20,
              position: 'relative',
              opacity: (isGameOver || isVictory) ? 0 : (showUI ? 1 : 0),
              pointerEvents: (isGameOver || isVictory) ? 'none' : 'auto'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: (isGameOver || isVictory) ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="h-full flex flex-col justify-end gap-3">
              <div className="flex items-center justify-between px-2">
                <span
                  className="mobile-white-pixel"
                  style={{
                    fontSize: '0.875rem',
                    color: '#9BB3E0',
                    textShadow: '2px 2px 0px rgba(0,0,0,0.9)',
                    imageRendering: 'pixelated',
                    textTransform: 'uppercase'
                  }}
                >
                  {hero.name}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className="mobile-white-pixel font-bold"
                    style={{
                      fontSize: '0.875rem',
                      color: '#ffffff',
                      textShadow: '2px 2px 0px rgba(0,0,0,0.9)',
                      imageRendering: 'pixelated'
                    }}
                  >
                    ЖИЗНИ:
                  </span>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((life) => (
                      <div
                        key={life}
                        style={{
                          width: '28px',
                          height: '32px',
                          background: life <= lives
                            ? 'linear-gradient(180deg, #BF00FF 0%, #BF00FF 60%, #4B0082 60%, #4B0082 100%)'
                            : 'rgba(75, 0, 130, 0.25)',
                          imageRendering: 'pixelated',
                          clipPath: `polygon(
                            0 3px, 3px 3px, 3px 0,
                            calc(100% - 3px) 0, calc(100% - 3px) 3px, 100% 3px,
                            100% calc(100% - 3px), calc(100% - 3px) calc(100% - 3px), calc(100% - 3px) 100%,
                            3px 100%, 3px calc(100% - 3px), 0 calc(100% - 3px)
                          )`,
                          boxShadow: life <= lives
                            ? (lifeGlow
                              ? '0 0 24px rgba(191, 0, 255, 1), 0 0 16px rgba(191, 0, 255, 0.8), inset 0 0 12px rgba(191, 0, 255, 0.5)'
                              : '0 0 16px rgba(191, 0, 255, 0.8), inset 0 0 8px rgba(191, 0, 255, 0.3)')
                            : 'none',
                          border: life <= lives ? '2px solid rgba(191, 0, 255, 0.5)' : '2px solid rgba(75, 0, 130, 0.3)'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={moveLeft}
                  className="py-3 mobile-white-pixel text-white active:scale-95 transition-transform flex items-center justify-center"
                  style={{
                    fontSize: '1.5rem',
                    background: '#BB2649',
                    textShadow: '3px 3px 0px rgba(0,0,0,0.9)',
                    imageRendering: 'pixelated',
                    clipPath: `polygon(
                      0 6px, 4px 6px, 4px 3px, 6px 3px, 6px 0,
                      calc(100% - 6px) 0, calc(100% - 6px) 3px, calc(100% - 4px) 3px, calc(100% - 4px) 6px, 100% 6px,
                      100% calc(100% - 6px), calc(100% - 4px) calc(100% - 6px), calc(100% - 4px) calc(100% - 3px),
                      calc(100% - 6px) calc(100% - 3px), calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 3px),
                      4px calc(100% - 3px), 4px calc(100% - 6px), 0 calc(100% - 6px)
                    )`,
                    boxShadow: '0 4px 0 #8B1C38'
                  }}
                >
                  &lt;
                </button>

                <button
                  onClick={moveRight}
                  className="py-3 mobile-white-pixel text-white active:scale-95 transition-transform flex items-center justify-center"
                  style={{
                    fontSize: '1.5rem',
                    background: '#BB2649',
                    textShadow: '3px 3px 0px rgba(0,0,0,0.9)',
                    imageRendering: 'pixelated',
                    clipPath: `polygon(
                      0 6px, 4px 6px, 4px 3px, 6px 3px, 6px 0,
                      calc(100% - 6px) 0, calc(100% - 6px) 3px, calc(100% - 4px) 3px, calc(100% - 4px) 6px, 100% 6px,
                      100% calc(100% - 6px), calc(100% - 4px) calc(100% - 6px), calc(100% - 4px) calc(100% - 3px),
                      calc(100% - 6px) calc(100% - 3px), calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 3px),
                      4px calc(100% - 3px), 4px calc(100% - 6px), 0 calc(100% - 6px)
                    )`,
                    boxShadow: '0 4px 0 #8B1C38'
                  }}
                >
                  &gt;
                </button>

                <button
                  onClick={handleFire}
                  className="py-3 mobile-white-pixel text-white active:scale-95 transition-transform"
                  style={{
                    fontSize: '0.875rem',
                    background: '#BB2649',
                    textShadow: '3px 3px 0px rgba(0,0,0,0.9)',
                    imageRendering: 'pixelated',
                    clipPath: `polygon(
                      0 6px, 4px 6px, 4px 3px, 6px 3px, 6px 0,
                      calc(100% - 6px) 0, calc(100% - 6px) 3px, calc(100% - 4px) 3px, calc(100% - 4px) 6px, 100% 6px,
                      100% calc(100% - 6px), calc(100% - 4px) calc(100% - 6px), calc(100% - 4px) calc(100% - 3px),
                      calc(100% - 6px) calc(100% - 3px), calc(100% - 6px) 100%, 6px 100%, 6px calc(100% - 3px),
                      4px calc(100% - 3px), 4px calc(100% - 6px), 0 calc(100% - 6px)
                    )`,
                    boxShadow: '0 4px 0 #8B1C38'
                  }}
                >
                  ОГОНЬ!
                </button>
              </div>
            </div>
          </motion.div>
      </>

   <AnimatePresence>
     {showDopcostTitle && (
        <motion.div
          className="fixed z-[65] flex items-center justify-center pointer-events-none"
          style={{
            top: '30%',
            left: 0,
            right: 0,
            transform: 'translateY(-50%)'
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.8 } }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="mobile-white-pixel"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '0.9rem',
              color: '#FFD700',
              textAlign: 'center',
              textShadow: '1px 1px 0px #000',
              filter: 'drop-shadow(0 0 12px #FFD700) drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))',
              imageRendering: 'pixelated',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              padding: '0 20px',
              fontWeight: 'bold'
            }}
          >
            ДОПКОСТ
          </div>
        </motion.div>
      )}
   </AnimatePresence>

   <AnimatePresence>
     {isVictory && (
        <motion.div
          className="fixed z-[100] flex flex-col items-center justify-center"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'auto'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {showVictoryTitle && (
            <motion.div
              className="flex flex-col items-center"
              style={{
                position: 'absolute',
                top: '25%',
                left: 0,
                right: 0
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
            >
              <div className="flex flex-col items-center gap-3">
                <h1
                  className="mobile-3d-text-large leading-none tracking-tight"
                  data-text="YOU"
                  style={{
                    fontSize: 'clamp(3rem, 18vw, 6rem)',
                    textAlign: 'center',
                    fontFamily: "'Press Start 2P', monospace"
                  }}
                >
                  YOU
                </h1>
                <h1
                  className="mobile-3d-text-large leading-none tracking-tight"
                  data-text="WIN"
                  style={{
                    fontSize: 'clamp(3rem, 18vw, 6rem)',
                    textAlign: 'center',
                    fontFamily: "'Press Start 2P', monospace"
                  }}
                >
                  WIN
                </h1>
              </div>
            </motion.div>
          )}

          {showVictoryStats && (
            <motion.div
              className="flex flex-col items-center gap-3"
              style={{
                position: 'absolute',
                top: '52%',
                left: 0,
                right: 0
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="mobile-white-pixel"
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '1.1rem',
                  color: '#B388FF',
                  textAlign: 'center',
                  textShadow: '2px 2px 0 #000',
                  imageRendering: 'pixelated',
                  textTransform: 'uppercase'
                }}
              >
                {hero.name}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                <div
                  className="mobile-white-pixel"
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '1rem',
                    color: '#FFFFFF',
                    textAlign: 'right',
                    textShadow: '1px 1px 0 #000',
                    imageRendering: 'pixelated',
                    textTransform: 'uppercase',
                    lineHeight: '1.2'
                  }}
                >
                  YOUR<br/>SCORE
                </div>
                <div 
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '2.5rem',
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFD700 40%, #FFFFFF 50%, #FFD700 60%, #FFD700 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(2px 2px 0px #000)',
                    imageRendering: 'pixelated',
                    display: 'block'
                  }}
                >
                  {score}
                </div>
              </div>
            </motion.div>
          )}

          {showVictoryButtons && (
            <motion.div
              className="flex flex-col items-center w-full"
              style={{
                position: 'absolute',
                top: '68%',
                left: 0,
                right: 0,
                padding: '0 20px'
                
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <button
                style={{ marginBottom: '20px' }}
                onClick={() => {
                  playButtonSound();
                  window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1', '_blank');
                }}
                className="mobile-menu-button w-full max-w-[320px]"
               >
                <span className="mobile-white-pixel font-bold uppercase" style={{ fontSize: '0.9rem' }}>
                  ПОЛУЧИТЬ ПРИЗ
                </span>
              </button>

              <button
                onClick={() => {
                  playButtonSound();
                  handleMainMenu();
                }}
                className="mobile-menu-button w-full max-w-[320px]"
               >
                <span className="mobile-white-pixel font-bold uppercase" style={{ fontSize: '0.9rem' }}>
                  В ГЛАВНОЕ МЕНЮ
                </span>
              </button>


            </motion.div>
          )}
        </motion.div>
      )}
   </AnimatePresence>

      <SystemTitle
        key="boss"
        lines={['ЭТО', 'МЕГА-РЕДФЛАГ!', 'СТРЕЛЯЙ', 'ДО КОНЦА']}
        show={showBossWarning}
        onComplete={() => setShowBossWarning(false)}
      />

      <SystemTitle
        key="asteroid"
        lines={['ОБЛЕТАЙ', 'АСТЕРОИДЫ']}
        show={showAsteroidWarning}
        onComplete={() => {
          setShowAsteroidWarning(false);
          setIsIntensePhase(true);
        }}
      />

      <SystemTitle
        key="initial"
        lines={['ВЫНОСИ', 'КРЕАТИВНЫЕ', 'РЕД ФЛАГИ']}
        show={showTitle}
        onComplete={() => {
          setShowTitle(false);
          gameplayStartedRef.current = true;
        }}
      />

      {isGameOver && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center px-6"
          style={{ pointerEvents: 'auto' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-full max-w-sm flex flex-col items-center gap-3" style={{ position: 'relative' }}>
            <motion.h1
              className="mobile-3d-text-large"
              data-text="GAME OVER"
              style={{
                fontSize: 'clamp(2rem, 9vw, 2.8rem)',
                color: '#BB2649',
                textAlign: 'center',
                textShadow: '3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000',
                imageRendering: 'pixelated',
                letterSpacing: '0.05em',
                position: 'relative',
                zIndex: 2
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
            >
              GAME OVER
            </motion.h1>

            {/* Hero Spaceship - Centered */}
            <motion.img
              src={spaceships[heroId]}
              alt="hero ship"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -8, 0],
              }}
              transition={{
                opacity: { delay: 0.1, duration: 0.5 },
                scale: { delay: 0.1, type: 'spring', duration: 0.5 },
                y: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }
              }}
              style={{
                width: `calc(${spaceshipSizes[heroId]} * 0.84)`,
                height: 'auto',
                imageRendering: 'pixelated',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))',
                zIndex: 1
              }}
            />

            <motion.div
              className="w-full flex flex-col items-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ position: 'relative', zIndex: 2 }}
            >
              {/* Two-column stats layout */}
              <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                {/* Left column - Labels (right-aligned) */}
                <div style={{ width: '50%', textAlign: 'right', paddingRight: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span className="mobile-white-pixel" style={{ fontSize: '1.05rem', color: '#ffffff', textShadow: '2px 2px 0px #000', whiteSpace: 'pre-line' }}>ГЕРОЙ</span>
                  <span className="mobile-white-pixel" style={{ fontSize: '1.05rem', color: '#ffffff', textShadow: '2px 2px 0px #000', whiteSpace: 'pre-line' }}>СЧЕТ</span>
                  <span className="mobile-white-pixel" style={{ fontSize: '1.05rem', color: '#ffffff', textShadow: '2px 2px 0px #000', whiteSpace: 'pre-line' }}>ПОПАДАНИЙ</span>
                  <span className="mobile-white-pixel" style={{ fontSize: '1.05rem', color: '#ffffff', textShadow: '2px 2px 0px #000', whiteSpace: 'pre-line' }}>ПРОПУЩЕНО</span>
                  <span className="mobile-white-pixel" style={{ fontSize: '1.05rem', color: '#ffffff', textShadow: '2px 2px 0px #000', whiteSpace: 'pre' }}>{"ЛЮБИМЫЙ\nРЕД ФЛАГ:"}</span>
                </div>

                {/* Right column - Values (left-aligned) */}
                <div style={{ width: '50%', textAlign: 'left', paddingLeft: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <span className="mobile-white-pixel font-bold" style={{ fontSize: '1.05rem', color: '#87CEEB', textShadow: '2px 2px 0px #000', textTransform: 'uppercase' }}>{heroes[heroId].name}</span>
                  <span className="mobile-white-pixel font-bold" style={{ fontSize: '1.05rem', color: '#FFD700', textShadow: '2px 2px 0px #000' }}>{score}</span>
                  <span className="mobile-white-pixel font-bold" style={{ fontSize: '1.05rem', color: '#FFD700', textShadow: '2px 2px 0px #000' }}>{stats.destroyed}</span>
                  <span className="mobile-white-pixel font-bold" style={{ fontSize: '1.05rem', color: '#FFD700', textShadow: '2px 2px 0px #000' }}>{stats.missed}</span>
                  <span
                    className="mobile-white-pixel font-bold"
                    style={{
                      fontSize: '0.9rem',
                      color: '#FF1493',
                      textTransform: 'uppercase',
                      textShadow: '2px 2px 0px #000',
                      filter: 'drop-shadow(0 0 8px #BB2649)',
                      whiteSpace: 'pre-line',
                      lineHeight: '1.4',
                      maxWidth: '200px'
                    }}
                  >
                    {getFavoriteRedFlag()}
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="w-full flex flex-col gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <button
                onClick={handleRestart}
                className="mobile-menu-button w-full"
              >
                <span className="mobile-white-pixel font-bold uppercase" style={{ fontSize: '0.9rem' }}>ПОПРОБОВАТЬ СНОВА</span>
              </button>

              <button
                onClick={handleChangeHero}
                className="mobile-menu-button-outline w-full"
              >
                <span className="mobile-white-pixel text-base font-bold uppercase">СМЕНИТЬ ГЕРОЯ</span>
              </button>

              <button
                onClick={handleMainMenu}
                className="mobile-menu-button-outline w-full"
              >
                <span className="mobile-white-pixel text-base font-bold uppercase">В ГЛАВНОЕ МЕНЮ</span>
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}

      <ArcadeGlitchTransition
        isActive={showEntryGlitch}
        onComplete={handleEntryGlitchComplete}
        shortMode={true}
      />
      {isFlashActive && (
     <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 3, times: [0, 0.1, 0.4, 1] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#FFFFFF',
          zIndex: 50,
          pointerEvents: 'none'
            }}
       />
      )}
    </div>
       
  );
}
