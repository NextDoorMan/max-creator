import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import { heroes } from './HeroSelection';
import { soundEffects, audioManager } from '../utils/audioManager';
import { audioEngine } from '../utils/webAudioEngine';
import MuteButton from './MuteButton';
import { CachedImage } from './CachedImage';

interface RunnerGameProps {
  heroId: string;
  onGameComplete: (score: number) => void;
  onChangeHero: () => void;
}

interface Obstacle {
  id: number;
  x: number;
  label: string;
  width: number;
  cleared: boolean;
}

interface AchievementText {
  id: number;
  text: string;
  color: 'pink' | 'blue';
  position: string;
}

interface HeroDialogue {
  id: number;
  text: string;
}

interface ScoreDialogue {
  score: number;
  text: string;
  shown: boolean;
}

interface BurstEffect {
  id: number;
  x: number;
  y: number;
}

const SCORE_DIALOGUES: ScoreDialogue[] = [
  { score: 3500, text: 'Не забудь посмотреть портфолио', shown: false },
  { score: 4500, text: 'Ого. Ты всё еще здесь', shown: false },
  { score: 5500, text: 'Может, пора остановиться?', shown: false },
  { score: 6200, text: 'Хм, а до 10.000 слабо?', shown: false },
  { score: 7500, text: 'У каких дизайнеров нет переработок?', shown: false },
  { score: 8000, text: 'У безработных! ХА-ХА-ХА', shown: false },
  { score: 8500, text: 'Надели на креатора выгорание, а оно ему как раз', shown: false },
  { score: 9300, text: 'Нет, серьезно, портфолио-то будем смотреть?', shown: false },
  { score: 10000, text: 'Ну ладно, ты победил. Лови пасхалку', shown: false },
];

const OBSTACLE_LABELS = [
  'Дедлайн: вчера',
  'У нас дебриф',
  'Фидбек аккаунта',
  'Токсичный стратег',
  'Офис 5/2',
  'Бюджет 1000 рублей',
  'RE: комментарии',
  'Хотим вау',
  'Созвон в 8:00',
  'Low KPI',
  'Правки (1)_upd_new_final',
  '«Привет. А ты где?»'
];
const FACT_LIST = [
  '33 года',
  '10 лет опыта',
  '50+ брендов',
  'Более 100 проектов',
  'Тысячи строк текста',
  'Миллионы протеиновых батончиков',
  '20 раз на турнике',
  'Ну ладно, 19',
  'И не только!'
];

const FACT_OBSTACLE_TRIGGERS = [1, 2, 4, 5, 7, 8, 10, 11, 13];
const DIALOGUE_TRIGGERS: Record<number, number> = {
  2: 0,
  5: 1,
  8: 2,
  13: 3
};

const HERO_DIALOGUES: Record<string, string[]> = {
  mudborya: [
    'Делай хорошо, чтобы не было гав...гав!',
    'Нет, я не плачу. Это сроки в глаз попали',
    'Конечно, я выйду в субботу. В окно',
    'Может, ускоримся?'
  ],
  smmario: [
    'Люблю, как ты играешься со шрифтами',
    'Хочешь посмотреть на мои подводки?',
    'Ого, какой у тебя большой... фидбек',
    'А теперь давай по-взрослому'
  ],
  brendinho: [
    'Сначала плати, потом брифуй',
    'Что значит «одна идея – мало»?',
    'Какой еще созвон? У меня тут фриланс горит',
    'Ну давай, удиви меня'
  ]
};

const PLAYER_X = 150;
const PLAYER_SIZE = 136;
const OBSTACLE_MIN_WIDTH = 130;
const OBSTACLE_HEIGHT = 170;
const ROAD_HEIGHT = 250;
const GROUND_BOTTOM = ROAD_HEIGHT;
const JUMP_VELOCITY = 13.28;
const AIR_JUMP_VELOCITY = 12.30;
const GRAVITY = 0.2279;
const OBSTACLE_SPEED = 9.583;
const OBSTACLE_SPAWN_INTERVAL = 2800;
const OBSTACLE_SPAWN_INTERVAL_INTENSIVE_BASE = 1680;
const OBSTACLE_SPAWN_INTERVAL_INTENSIVE_MIN_SAFE = 1739;
const OBSTACLE_SPAWN_INTERVAL_INTENSIVE_MAX_BONUS = 0.13;
const OBSTACLE_SPAWN_INTERVAL_DOUBLE_JUMP = 660;
const DOUBLE_JUMP_CHALLENGE_CHANCE = 0.28;
const PORTFOLIO_BUTTON_TIME = 10000;
const HITBOX_MARGIN = 30;
const ROAD_REPEAT_WIDTH = 1920;
const CITY_HEIGHT = 384;
const CITY_REPEAT_WIDTH = 1920;
const CITY_SCROLL_SPEED = 1.917;
const ROAD_SCROLL_SPEED = 9.583;

export default function RunnerGame({ heroId, onGameComplete, onChangeHero }: RunnerGameProps) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isSmallDesktop, setIsSmallDesktop] = useState(false);
  const [score, setScore] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [countdown, setCountdown] = useState(4);
  const [showGo, setShowGo] = useState(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [achievements, setAchievements] = useState<AchievementText[]>([]);
  const [factIndex, setFactIndex] = useState(0);
  const [showPortfolioButton, setShowPortfolioButton] = useState(false);
  const [isDynamicMode, setIsDynamicMode] = useState(false);
  const [currentDialogue, setCurrentDialogue] = useState<HeroDialogue | null>(null);
  const [showAdvancedTutorial, setShowAdvancedTutorial] = useState(false);
  const [scoreDialogues, setScoreDialogues] = useState<ScoreDialogue[]>(SCORE_DIALOGUES);
  const [showRewardButton, setShowRewardButton] = useState(false);
  const [burstEffects, setBurstEffects] = useState<BurstEffect[]>([]);

  const getAdjustedGround = () => {
    const height = window.innerHeight;
    if (height <= 700) return 125;
    if (height <= 800) return 180;
    return GROUND_BOTTOM;
  };

  const getCityBottom = () => {
    const adjustedGround = getAdjustedGround();
    return adjustedGround - (adjustedGround * 0.1);
  };

  const getPlayerSize = () => {
    return isSmallDesktop ? PLAYER_SIZE * 0.9 : PLAYER_SIZE;
  };

  const getObstacleHeight = () => {
    return isSmallDesktop ? OBSTACLE_HEIGHT * 0.9 : OBSTACLE_HEIGHT;
  };

  const getObstacleMinWidth = () => {
    return isSmallDesktop ? OBSTACLE_MIN_WIDTH * 0.9 : OBSTACLE_MIN_WIDTH;
  };

  const getHitboxMargin = () => {
    return isSmallDesktop ? HITBOX_MARGIN * 0.9 : HITBOX_MARGIN;
  };

  const ADJUSTED_GROUND = getAdjustedGround();
  const CITY_BOTTOM = getCityBottom();

  const [playerBottomY, setPlayerBottomY] = useState(ADJUSTED_GROUND);
  const [playerVelocityY, setPlayerVelocityY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [hasUsedAirJump, setHasUsedAirJump] = useState(false);

  const animationFrameRef = useRef<number>();
  const obstacleIdRef = useRef(0);
  const achievementIdRef = useRef(0);
  const dialogueIdRef = useRef(0);
  const burstIdRef = useRef(0);
  const gameStartTimeRef = useRef<number>(0);
  const lastObstacleTimeRef = useRef<number>(0);
  const totalObstaclesClearedRef = useRef(0);
  const cityOffsetRef = useRef(0);
  const roadOffsetRef = useRef(0);
  const cityElementRef = useRef<HTMLDivElement>(null);
  const roadElementRef = useRef<HTMLDivElement>(null);
  const nextObstacleIntervalRef = useRef(OBSTACLE_SPAWN_INTERVAL);
  const scoreFrameCounterRef = useRef(0);
  const gameOverSoundPlayedRef = useRef(false);
  const lastFrameTimeRef = useRef<number>(0);
  const scoreAccumulatorRef = useRef(0);
  const shouldSpawnDoubleJumpRef = useRef(false);
  const firstDoubleJumpObstacleIdRef = useRef<number | null>(null);

  const hero = heroes.find((h) => h.id === heroId);

  useEffect(() => {
    soundEffects.preloadDesktopSounds().catch(err => {
      console.warn('Failed to preload desktop sounds:', err);
    });
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerHeight <= 800);
      setIsSmallDesktop(window.innerWidth <= 850);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  useEffect(() => {
    if (!isGameActive) {
      setPlayerBottomY(ADJUSTED_GROUND);
    }
  }, [ADJUSTED_GROUND, isGameActive]);

  const restartGame = () => {
    audioEngine.resume().catch(() => {});
    audioManager.resume().catch(() => {});

    setScore(0);
    setIsGameActive(false);
    setCountdown(4);
    setShowGo(false);
    setObstacles([]);
    setAchievements([]);
    setFactIndex(0);
    setShowPortfolioButton(false);
    setIsDynamicMode(false);
    setCurrentDialogue(null);
    setShowAdvancedTutorial(false);
    setScoreDialogues(SCORE_DIALOGUES);
    setShowRewardButton(false);
    setBurstEffects([]);
    setPlayerBottomY(ADJUSTED_GROUND);
    setPlayerVelocityY(0);
    setIsJumping(false);
    setHasUsedAirJump(false);
    obstacleIdRef.current = 0;
    achievementIdRef.current = 0;
    dialogueIdRef.current = 0;
    burstIdRef.current = 0;
    gameStartTimeRef.current = 0;
    lastObstacleTimeRef.current = 0;
    totalObstaclesClearedRef.current = 0;
    cityOffsetRef.current = 0;
    roadOffsetRef.current = 0;
    nextObstacleIntervalRef.current = OBSTACLE_SPAWN_INTERVAL;
    scoreFrameCounterRef.current = 0;
    gameOverSoundPlayedRef.current = false;
    lastFrameTimeRef.current = 0;
    scoreAccumulatorRef.current = 0;
    shouldSpawnDoubleJumpRef.current = false;
    firstDoubleJumpObstacleIdRef.current = null;
  };

  const showDialogue = useCallback((dialogueIndex: number) => {
    const dialogues = HERO_DIALOGUES[heroId];
    if (!dialogues || dialogueIndex >= dialogues.length) return;

    soundEffects.play('dialogue');

    const newDialogue: HeroDialogue = {
      id: dialogueIdRef.current++,
      text: dialogues[dialogueIndex],
    };
    setCurrentDialogue(newDialogue);

    setTimeout(() => {
      setCurrentDialogue(prev => prev?.id === newDialogue.id ? null : prev);

      if (dialogueIndex === 3) {
        setTimeout(() => {
          setShowAdvancedTutorial(true);
          setTimeout(() => {
            setShowAdvancedTutorial(false);
          }, 5000);
        }, 100);
      }
    }, 4000);
  }, [heroId]);

  const showScoreDialogue = useCallback((text: string, isLastDialogue: boolean = false) => {
    soundEffects.play('dialogue');

    const newDialogue: HeroDialogue = {
      id: dialogueIdRef.current++,
      text: text,
    };
    setCurrentDialogue(newDialogue);

    setTimeout(() => {
      setCurrentDialogue(prev => prev?.id === newDialogue.id ? null : prev);

      if (isLastDialogue) {
        setShowRewardButton(true);
      }
    }, 4000);
  }, []);

  const showAchievement = useCallback((obstacleNumber: number) => {
    const factIndexToShow = FACT_OBSTACLE_TRIGGERS.indexOf(obstacleNumber);
    if (factIndexToShow === -1 || factIndexToShow >= FACT_LIST.length) return;

    soundEffects.play('factBadge');

    const text = FACT_LIST[factIndexToShow];
    const position = factIndexToShow % 2 === 0 ? '30%' : '45%';
    const isLastFact = factIndexToShow === FACT_LIST.length - 1;

    const newAchievement: AchievementText = {
      id: achievementIdRef.current++,
      text,
      color: factIndexToShow % 2 === 0 ? 'pink' : 'blue',
      position,
    };
    setAchievements(prev => [...prev, newAchievement]);

    setTimeout(() => {
      setAchievements(prev => prev.filter(a => a.id !== newAchievement.id));

      if (isLastFact) {
        setIsDynamicMode(true);
      }
    }, 2500);

    const dialogueIndex = DIALOGUE_TRIGGERS[obstacleNumber];
    if (dialogueIndex !== undefined) {
      setTimeout(() => showDialogue(dialogueIndex), 500);
    }
  }, [showDialogue]);

  const jump = useCallback(() => {
    if (!isGameActive) return;

    audioEngine.resume().catch(() => {});
    audioManager.resume().catch(() => {});

    // First jump (on ground)
    if (!isJumping) {
      soundEffects.play('jump');
      setPlayerVelocityY(JUMP_VELOCITY);
      setIsJumping(true);
      setHasUsedAirJump(false);
    }
    // Second jump (air jump)
    else if (isJumping && !hasUsedAirJump) {
      soundEffects.play('jump');
      setPlayerVelocityY(AIR_JUMP_VELOCITY);
      setHasUsedAirJump(true);
    }
  }, [isGameActive, isJumping, hasUsedAirJump]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };

    const handleClick = () => {
      jump();
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleClick);
    };
  }, [jump]);

  useEffect(() => {
    if (countdown === 4) {
      soundEffects.play('countdown');
    }
    if (countdown > 1) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 1 && !isGameActive) {
      setShowGo(true);
      const goTimer = setTimeout(() => {
        setShowGo(false);
        setCountdown(0);
        setIsGameActive(true);
        gameStartTimeRef.current = performance.now();
      }, 1000);
      return () => clearTimeout(goTimer);
    }
  }, [countdown, isGameActive]);

  useEffect(() => {
    if (isGameActive) {
      const portfolioTimer = setTimeout(() => {
        setShowPortfolioButton(true);
      }, PORTFOLIO_BUTTON_TIME);
      return () => clearTimeout(portfolioTimer);
    }
  }, [isGameActive]);

  useEffect(() => {
    if (!isGameActive || score === 0) return;

    const dialogueToShow = scoreDialogues.find(d => !d.shown && score >= d.score);
    if (dialogueToShow) {
      const isLastDialogue = dialogueToShow.score === 10000;
      showScoreDialogue(dialogueToShow.text, isLastDialogue);

      setScoreDialogues(prev =>
        prev.map(d =>
          d.score === dialogueToShow.score ? { ...d, shown: true } : d
        )
      );
    }
  }, [score, isGameActive, scoreDialogues, showScoreDialogue]);

  const gameLoop = useCallback((currentTime: number) => {
    if (!isGameActive) return;

    if (lastFrameTimeRef.current === 0) {
      lastFrameTimeRef.current = currentTime;
      animationFrameRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const deltaTime = (currentTime - lastFrameTimeRef.current) / 16.667;
    lastFrameTimeRef.current = currentTime;

    const cappedDelta = Math.min(deltaTime, 2);

    const elapsedTime = currentTime - gameStartTimeRef.current;

    cityOffsetRef.current = (cityOffsetRef.current + CITY_SCROLL_SPEED * deltaTime) % CITY_REPEAT_WIDTH;
    roadOffsetRef.current = (roadOffsetRef.current + ROAD_SCROLL_SPEED * deltaTime) % ROAD_REPEAT_WIDTH;

    if (cityElementRef.current) {
      cityElementRef.current.style.backgroundPosition = `${-cityOffsetRef.current}px bottom`;
    }
    if (roadElementRef.current) {
      roadElementRef.current.style.backgroundPosition = `${-roadOffsetRef.current}px bottom`;
    }

    setPlayerVelocityY(prev => prev - GRAVITY * cappedDelta);
    setPlayerBottomY(prev => {
      const newBottomY = prev + playerVelocityY * cappedDelta;
      if (newBottomY <= ADJUSTED_GROUND) {
        setIsJumping(false);
        setHasUsedAirJump(false);
        return ADJUSTED_GROUND;
      }
      return newBottomY;
    });

    if (elapsedTime - lastObstacleTimeRef.current > nextObstacleIntervalRef.current) {
      const label = OBSTACLE_LABELS[Math.floor(Math.random() * OBSTACLE_LABELS.length)];
      const width = Math.max(getObstacleMinWidth(), label.length * 11 + 30);
      const currentObstacleId = obstacleIdRef.current++;

      setObstacles(prev => [...prev, {
        id: currentObstacleId,
        x: window.innerWidth,
        label,
        width,
        cleared: false,
      }]);
      lastObstacleTimeRef.current = elapsedTime;

      if (shouldSpawnDoubleJumpRef.current && firstDoubleJumpObstacleIdRef.current === null) {
        firstDoubleJumpObstacleIdRef.current = currentObstacleId;
        nextObstacleIntervalRef.current = OBSTACLE_SPAWN_INTERVAL_DOUBLE_JUMP;
      } else if (shouldSpawnDoubleJumpRef.current && firstDoubleJumpObstacleIdRef.current !== null) {
        shouldSpawnDoubleJumpRef.current = false;
        firstDoubleJumpObstacleIdRef.current = null;

        if (isDynamicMode) {
          const bonusDistance = Math.random() * OBSTACLE_SPAWN_INTERVAL_INTENSIVE_MAX_BONUS * OBSTACLE_SPAWN_INTERVAL_INTENSIVE_MIN_SAFE;
          nextObstacleIntervalRef.current = OBSTACLE_SPAWN_INTERVAL_INTENSIVE_MIN_SAFE + bonusDistance;
        } else {
          nextObstacleIntervalRef.current = OBSTACLE_SPAWN_INTERVAL;
        }
      } else if (isDynamicMode) {
        if (Math.random() < DOUBLE_JUMP_CHALLENGE_CHANCE) {
          shouldSpawnDoubleJumpRef.current = true;
          nextObstacleIntervalRef.current = OBSTACLE_SPAWN_INTERVAL_INTENSIVE_MIN_SAFE + Math.random() * OBSTACLE_SPAWN_INTERVAL_INTENSIVE_MAX_BONUS * OBSTACLE_SPAWN_INTERVAL_INTENSIVE_MIN_SAFE;
        } else {
          const bonusDistance = Math.random() * OBSTACLE_SPAWN_INTERVAL_INTENSIVE_MAX_BONUS * OBSTACLE_SPAWN_INTERVAL_INTENSIVE_MIN_SAFE;
          nextObstacleIntervalRef.current = OBSTACLE_SPAWN_INTERVAL_INTENSIVE_MIN_SAFE + bonusDistance;
        }
      } else {
        nextObstacleIntervalRef.current = OBSTACLE_SPAWN_INTERVAL;
      }
    }

    setObstacles(prev => {
      const updated = prev.map(obs => ({
        ...obs,
        x: obs.x - OBSTACLE_SPEED * deltaTime,
      })).filter(obs => obs.x > -obs.width);

      updated.forEach(obs => {
        const currentPlayerSize = getPlayerSize();
        const currentObstacleHeight = getObstacleHeight();
        const currentHitboxMargin = getHitboxMargin();

        const playerLeft = PLAYER_X + currentHitboxMargin;
        const playerRight = PLAYER_X + currentPlayerSize - currentHitboxMargin;
        const playerBottom = playerBottomY + currentHitboxMargin;
        const playerTop = playerBottomY + currentPlayerSize - currentHitboxMargin;

        const obsLeft = obs.x + currentHitboxMargin;
        const obsRight = obs.x + obs.width - currentHitboxMargin;
        const obsBottom = ADJUSTED_GROUND + currentHitboxMargin;
        const obsTop = ADJUSTED_GROUND + currentObstacleHeight - currentHitboxMargin;

        if (
          playerRight > obsLeft &&
          playerLeft < obsRight &&
          playerTop > obsBottom &&
          playerBottom < obsTop
        ) {
          if (!gameOverSoundPlayedRef.current) {
            soundEffects.play('gameOver');
            gameOverSoundPlayedRef.current = true;

            const burstX = obs.x + obs.width / 2;
            const burstY = ADJUSTED_GROUND + getObstacleHeight() / 2;
            const burstId = burstIdRef.current++;

            setBurstEffects(prev => [...prev, { id: burstId, x: burstX, y: burstY }]);

            setTimeout(() => {
              setBurstEffects(prev => prev.filter(b => b.id !== burstId));
            }, 600);
          }
          setIsGameActive(false);
        }

        if (!obs.cleared && obs.x + obs.width < PLAYER_X) {
          obs.cleared = true;
          totalObstaclesClearedRef.current++;
          const totalCleared = totalObstaclesClearedRef.current;

          if (FACT_OBSTACLE_TRIGGERS.includes(totalCleared)) {
            showAchievement(totalCleared);
          }
        }
      });

      return updated;
    });

    scoreAccumulatorRef.current += 5.148 * deltaTime / 5;
    if (scoreAccumulatorRef.current >= 3) {
      const scoreToAdd = Math.floor(scoreAccumulatorRef.current / 3) * 3;
      setScore(prev => prev + scoreToAdd);
      scoreAccumulatorRef.current = scoreAccumulatorRef.current % 3;
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [isGameActive, playerVelocityY, playerBottomY, showAchievement, isDynamicMode, ADJUSTED_GROUND]);

  useEffect(() => {
    if (isGameActive) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isGameActive, gameLoop]);

  if (!hero) return null;

  return (
    <>
      <MuteButton />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 overflow-hidden"
        style={{
          imageRendering: 'pixelated',
          position: 'relative',
          height: '100vh'
        }}
      >
      {countdown > 1 && (
        <motion.div
          key={countdown}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70"
          style={{ zIndex: 200 }}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1, times: [0, 0.3, 0.7, 1] }}
            className="text-9xl neon-pink font-bold"
          >
            {countdown - 1}
          </motion.div>
        </motion.div>
      )}

      {showGo && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70"
          style={{ zIndex: 200 }}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1, times: [0, 0.3, 0.7, 1] }}
            className="text-9xl neon-green font-bold"
            style={{
              imageRendering: 'pixelated',
              transform: 'translate3d(0,0,0)',
              WebkitFontSmoothing: 'none',
              textShadow: '0 0 10px #39FF14, 0 0 20px rgba(57, 255, 20, 0.8), 0 0 40px rgba(57, 255, 20, 0.4)',
              filter: 'none'
            }}
          >
            GO!
          </motion.div>
        </motion.div>
      )}

      <div
        className="absolute inset-0 bg-cover bg-center runner-background"
        style={{
          backgroundImage: 'url(https://res.cloudinary.com/djihbhmzz/image/upload/v1771490597/%D0%A4%D0%BE%D0%BD_nllusy.png)',
          zIndex: 10,
        }}
      />

      <div
        ref={cityElementRef}
        className="absolute left-0 w-full runner-city-layer"
        style={{
          backgroundImage: 'url(https://res.cloudinary.com/djihbhmzz/image/upload/v1771491172/city_final_upd_wygefa.png)',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: '0px bottom',
          backgroundSize: `${CITY_REPEAT_WIDTH}px ${CITY_HEIGHT}px`,
          height: `${CITY_HEIGHT}px`,
          bottom: `${CITY_BOTTOM}px`,
          zIndex: 30,
          willChange: 'transform',
        }}
      />

      <div
        ref={roadElementRef}
        className="absolute bottom-0 left-0 w-full runner-road-layer"
        style={{
          backgroundImage: 'url(https://res.cloudinary.com/djihbhmzz/image/upload/v1771491172/road_newest_wbc37l.png)',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: '0px bottom',
          backgroundSize: `${ROAD_REPEAT_WIDTH}px ${ROAD_HEIGHT}px`,
          height: `${ROAD_HEIGHT}px`,
          zIndex: 50,
          willChange: 'transform',
        }}
      />

      <div
        className="absolute top-8 right-8 space-y-4"
        style={{
          zIndex: 150,
          transform: isSmallScreen ? 'scale(0.8)' : 'scale(1)',
          transformOrigin: 'top right',
        }}
      >
        <motion.div
          className="text-4xl neon-pink leading-relaxed font-bold pixel-corners border-4 border-pink-500 bg-black bg-opacity-80 px-6 py-3"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          style={{
            imageRendering: 'pixelated',
            transform: 'translate3d(0,0,0)',
            WebkitFontSmoothing: 'none',
            textShadow: '0 0 5px #ec4899, 0 0 10px rgba(236, 72, 153, 0.8)',
            filter: 'none'
          }}
        >
          СЧЁТ: {score}
        </motion.div>

        {showPortfolioButton && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              soundEffects.play('button');
              onGameComplete(score);
            }}
            className="w-full pixel-corners border-4 border-cyan-400 bg-black bg-opacity-90 px-6 py-3 text-sm neon-blue hover:bg-cyan-950 transition-all duration-300 leading-relaxed font-bold"
            style={{
              imageRendering: 'pixelated',
              transform: 'translate3d(0,0,0)',
              boxShadow: '0 0 10px #22d3ee, 0 0 20px rgba(34, 211, 238, 0.4), inset 0 0 6px #22d3ee',
              textShadow: '0 0 5px #22d3ee',
              filter: 'none'
            }}
          >
            К ПОРТФОЛИО
          </motion.button>
        )}

        {showRewardButton && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              soundEffects.play('button');
              window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1', '_blank', 'noopener,noreferrer');
            }}
            className="w-full pixel-corners border-4 border-yellow-400 bg-black bg-opacity-90 px-6 py-3 text-sm font-bold leading-relaxed transition-all duration-300 hover:bg-yellow-950"
            style={{
              color: '#FFD700',
              textShadow: '0 0 5px #22c55e, 0 0 10px rgba(34, 197, 94, 0.8)',
            }}
          >
            ПОЛУЧИТЬ ПРИЗ
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {score < 300 && !showAdvancedTutorial && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-24 left-1/2 transform -translate-x-1/2"
            style={{ zIndex: 150 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-xl md:text-2xl neon-green text-center px-4 leading-relaxed font-bold text-shadow-glow"
              style={{
                imageRendering: 'pixelated',
                transform: 'translate3d(0,0,0)',
                WebkitFontSmoothing: 'none',
                textShadow: 
                  '0 0 5px #22c55e, 0 0 10px rgba(34, 197, 94, 0.8)',
                filter: 'none'
              }}
            >
              ЖМИТЕ SPACE, ЧТОБЫ ПРЫГАТЬ ЧЕРЕЗ КРЕАТИВНЫЕ БЛОКИ
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAdvancedTutorial && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-24 left-1/2 transform -translate-x-1/2"
            style={{ zIndex: 150 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-xl md:text-2xl neon-green text-center px-4 leading-relaxed font-bold text-shadow-glow"
              style={{
                imageRendering: 'pixelated',
                transform: 'translate3d(0,0,0)',
                WebkitFontSmoothing: 'none',
                textShadow: 
                   `0 0 10px #39FF14, 0 0 20px rgba(57, 255, 20, 1), 0 0 40px rgba(57, 255, 20, 0.6)`,
                filter: 'none'
              }}
            >
              ДЛЯ БОЛЬШОГО ПРЫЖКА НАЖМИТЕ SPACE ДВА РАЗА
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0" style={{ zIndex: 100, pointerEvents: 'none' }}>
        <motion.div
          className="absolute"
          style={{
            left: PLAYER_X,
            bottom: playerBottomY,
            width: getPlayerSize(),
            height: getPlayerSize(),
            zIndex: 100,
          }}
          animate={
            isGameActive && !isJumping
              ? { y: [0, -5, 0] }
              : {}
          }
          transition={{
            duration: 0.3,
            repeat: isGameActive && !isJumping ? Infinity : 0,
            ease: 'easeInOut',
          }}
        >
          <CachedImage
            src={hero.sprite}
            alt={hero.name}
            className="w-full h-full object-contain"
            style={{
              imageRendering: 'pixelated',
              transform: heroId === 'brendinho' ? 'scale(0.9775)' : 'scale(1)'
            }}
          />
        </motion.div>

        {obstacles.map(obstacle => {
          const isSpecialLabel = obstacle.label === 'Правки (1)_upd_new_final' || obstacle.label === 'Бюджет 1000 рублей';
          const labelLength = obstacle.label.length;
          let fontSize = labelLength > 20 ? '0.86rem' : labelLength > 15 ? '0.98rem' : '1.09rem';

          if (isSpecialLabel) {
            fontSize = labelLength > 20 ? '1.03rem' : labelLength > 15 ? '1.18rem' : '1.31rem';
          }

          return (
            <div
              key={obstacle.id}
              className="absolute pixel-corners bg-gradient-to-b from-red-700 to-red-900 flex items-center justify-center"
              style={{
                left: Math.round(obstacle.x),
                bottom: ADJUSTED_GROUND,
                width: obstacle.width,
                height: isSpecialLabel ? 'auto' : getObstacleHeight(),
                minHeight: isSpecialLabel ? getObstacleHeight() : undefined,
                zIndex: 100,
                border: '3px solid #FFD700',
                padding: isSpecialLabel ? '12px 10px' : '8px 10px',
                transform: 'translate3d(0,0,0)',
                imageRendering: 'pixelated',
                willChange: 'transform',
              }}
            >
              <span
                className="text-white font-bold text-center leading-snug"
                style={{
                  fontSize,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  wordBreak: 'break-word',
                  hyphens: 'auto',
                  whiteSpace: isSpecialLabel ? 'normal' : undefined,
                  imageRendering: 'pixelated',
                  WebkitFontSmoothing: 'none',
                  transform: 'translate3d(0,0,0)',
                  textShadow: '1px 1px 0px #000',
                }}
              >
                {obstacle.label}
              </span>
            </div>
          );
        })}

        <AnimatePresence>
          {burstEffects.map(burst => (
            <motion.div
              key={burst.id}
              initial={{ opacity: 1, scale: 0 }}
              animate={{ opacity: 0, scale: 2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                position: 'absolute',
                left: burst.x,
                bottom: burst.y,
                transform: 'translate(-50%, -50%)',
                zIndex: 150,
                pointerEvents: 'none',
              }}
            >
              <div style={{
                position: 'relative',
                width: '120px',
                height: '120px',
              }}>
                {[...Array(8)].map((_, i) => {
                  const angle = (i * 45) * (Math.PI / 180);
                  const distance = 40;
                  const x = Math.cos(angle) * distance;
                  const y = Math.sin(angle) * distance;

                  return (
                    <motion.div
                      key={i}
                      initial={{ x: 0, y: 0, opacity: 1 }}
                      animate={{ x, y, opacity: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        width: '16px',
                        height: '16px',
                        backgroundColor: i % 2 === 0 ? '#FF10F0' : '#FFD700',
                        boxShadow: `0 0 10px ${i % 2 === 0 ? '#FF10F0' : '#FFD700'}`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  );
                })}
                <motion.div
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{ opacity: 0, scale: 3 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#FF10F0',
                    boxShadow: '0 0 20px #FF10F0, 0 0 40px #FF10F0',
                  }}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {achievements.map(achievement => {
            const isPink = achievement.color === 'pink';
            const textColor = isPink ? '#FF10F0' : '#00F0FF';
            const glowColor = isPink ? 'rgba(255, 16, 240, 0.8)' : 'rgba(0, 240, 255, 0.8)';

            const baseFontSize = achievement.text.length > 20 ? '2.16rem' : '2.88rem';
            const fontSize = isSmallScreen ? 'clamp(1.4rem, 5vh, 2.2rem)' : baseFontSize;

            const whiteSpace = achievement.text === 'Ну ладно, 19' ? 'nowrap' : 'pre-wrap';
            const isRightLane = achievement.position === '45%';
            const leftPosition = achievement.position;
            const translateX = isRightLane ? 'calc(-50% - 15px)' : '-50%';

            const topPosition = isSmallScreen ? '30%' : '35%';
            const maxWidth = isSmallScreen ? '550px' : '500px';

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut"
                }}
                style={{
                  position: 'absolute',
                  left: leftPosition,
                  top: topPosition,
                  transform: `translate(${translateX}, -50%)`,
                  textAlign: 'left',
                  maxWidth,
                  zIndex: 1000,
                  pointerEvents: 'none',
                }}
              >
                <div
                  className="font-bold glitch-text"
                  style={{
                    fontSize,
                    color: textColor,
                    textShadow: `
                      4px 4px 0px #000,
                      -4px -4px 0px #000,
                      4px -4px 0px #000,
                      -4px 4px 0px #000,
                      0px 4px 0px #000,
                      0px -4px 0px #000,
                      4px 0px 0px #000,
                      -4px 0px 0px #000,
                      0 0 20px ${glowColor},
                      0 0 40px ${glowColor}
                    `,
                    imageRendering: 'pixelated',
                    letterSpacing: '0.05em',
                    lineHeight: '1.2',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    whiteSpace,
                  }}
                >
                  {achievement.text}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {currentDialogue && hero && (
          <motion.div
            key={currentDialogue.id}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className={`absolute ${isSmallScreen ? 'bottom-6 left-6' : 'bottom-8 left-8'} flex items-center gap-4`}
            style={{ zIndex: 150, pointerEvents: 'none' }}
          >
            <div
              className="pixel-corners border-4 border-white bg-black overflow-hidden flex-shrink-0"
              style={{ width: isSmallScreen ? '115.2px' : '144px', height: isSmallScreen ? '115.2px' : '144px' }}
            >
              <CachedImage
                src={hero.image}
                alt={hero.name}
                className="w-full h-full object-cover"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            <div
              className={`pixel-corners border-4 border-white bg-black ${isSmallScreen ? 'px-6 py-4' : 'px-8 py-5'} relative`}
              style={{ minWidth: isSmallScreen ? '320px' : '400px' }}
            >
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-white"></div>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-white"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-white"></div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-white"></div>
              <div className="text-white font-bold" style={{ fontSize: isSmallScreen ? '1.296rem' : '1.62rem', imageRendering: 'pixelated', whiteSpace: 'nowrap', lineHeight: '1.3' }}>
                {currentDialogue.text}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isGameActive && countdown === 0 && !showGo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90"
          style={{ zIndex: 200 }}
        >
          <div className="text-center space-y-8 px-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                imageRendering: 'pixelated',
                transform: 'translate3d(0,0,0)',
                WebkitFontSmoothing: 'none',
                textShadow: `0 0 5px #FF00FF, 0 0 15px rgba(255, 0, 255, 0.8), 0 0 30px rgba(255, 119, 255, 0.4)`,
                filter: 'none'
              }}
              className="text-5xl md:text-7xl neon-pink leading-relaxed font-bold"
            >
              GAME OVER
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl neon-blue leading-relaxed"
            >
              ВАШ СЧЁТ: {score}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col gap-4 justify-center items-center"
            >
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    imageRendering: 'pixelated',
                    transform: 'translateZ(0)',
                    textShadow: '0 0 5px #22c55e, 0 0 10px rgba(34, 197, 94, 0.8)',
                    filter: 'none'
                  }}
                  onClick={() => {
                    soundEffects.play('button');
                    restartGame();
                  }}
                  className="pixel-corners border-4 border-green-500 bg-black px-8 py-4 text-xl md:text-2xl neon-green hover:bg-green-950 transition-all duration-300 leading-relaxed font-bold"
                >
                  ПОПРОБОВАТЬ СНОВА
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ 
                    imageRendering: 'pixelated', 
                    transform: 'translateZ(0)',
                    textShadow: '0 0 5px #06b6d4, 0 0 10px rgba(6, 182, 212, 0.8)',
                    filter: 'none'
                  }}
                  onClick={() => {
                    soundEffects.play('button');
                    onChangeHero();
                  }}
                  className="pixel-corners border-4 border-cyan-500 bg-black px-8 py-4 text-xl md:text-2xl neon-blue hover:bg-cyan-950 transition-all duration-300 leading-relaxed font-bold"
                >
                  СМЕНИТЬ ГЕРОЯ
                </motion.button>
              </div>
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    imageRendering: 'pixelated',
                    transform: 'translateZ(0)',
                    textShadow: '0 0 5px #ec4899, 0 0 10px rgba(236, 72, 153, 0.8)',
                    filter: 'none'
                  }}
                  onClick={() => {
                    soundEffects.play('button');
                    onGameComplete(score);
                  }}
                  className="pixel-corners border-4 border-pink-500 bg-black px-8 py-4 text-xl md:text-2xl neon-pink hover:bg-pink-950 transition-all duration-300 leading-relaxed font-bold"
                >
                  К ПОРТФОЛИО
                </motion.button>
                {score >= 10000 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      soundEffects.play('button');
                      window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1', '_blank', 'noopener,noreferrer');
                    }}
                    className="pixel-corners border-4 border-yellow-400 bg-black px-8 py-4 text-xl md:text-2xl font-bold leading-relaxed transition-all duration-300 hover:bg-yellow-950"
                    style={{
                      color: '#FFD700',
                      textShadow: '0 0 10px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.6)',
                    }}
                  >
                    ПОЛУЧИТЬ ПРИЗ
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </motion.div>
    </>
  );
}
