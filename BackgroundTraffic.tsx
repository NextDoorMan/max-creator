import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrafficObject {
  id: number;
  type: 'enemy' | 'spaceship';
  asset: string;
  direction: 'left' | 'right';
  topPosition: number;
  duration: number;
}

const enemyGifs = [
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1772613862/%D1%80%D0%B5%D0%B4_%D1%84%D0%BB%D0%B0%D0%B3_%D0%B3%D0%BD%D0%B5%D0%B2_%D0%B3%D0%B8%D1%84%D0%BA%D0%B0_da49xo.gif',
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1772613862/%D1%80%D0%B5%D0%B4_%D1%84%D0%BB%D0%B0%D0%B3_%D1%83%D1%85%D0%BC%D1%8B%D0%BB%D0%BA%D0%B0_%D0%B3%D0%B8%D1%84%D0%BA%D0%B0_m3umhh.gif',
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1772615140/%D1%80%D0%B5%D0%B4%D1%84%D0%BB%D0%B0%D0%B3_%D0%BE%D0%B1%D1%8B%D1%87%D0%BD%D1%8B%D0%B9_%D0%B3%D0%B8%D1%84%D0%BA%D0%B0_ociq1d.gif'
];

const spaceships = [
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1772566105/%D0%BC%D1%83%D0%B4%D0%B1%D0%BE%D1%80%D1%8F_%D0%BA%D0%BE%D1%80%D0%B0%D0%B1%D0%BB%D1%8C_1_xlkwrm.png',
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1772566105/Smm%D0%B0%D1%80%D0%B8%D0%BE_%D0%BA%D0%BE%D1%80%D0%B0%D0%B1%D0%BB%D1%8C_1_vo3pvh.png',
  'https://res.cloudinary.com/djihbhmzz/image/upload/v1772569080/%D0%B1%D1%80%D0%B5%D0%BD%D0%B4%D0%B8%D0%BD%D1%8C%D0%BE_%D0%BA%D0%BE%D1%80%D0%B0%D0%B1%D0%BB%D1%8C_1_qtx3df.png'
];

interface BackgroundTrafficProps {
  isGameStarting?: boolean;
}

export const BackgroundTraffic = ({ isGameStarting = false }: BackgroundTrafficProps) => {
  const [objects, setObjects] = useState<TrafficObject[]>([]);
  const objectIdRef = useRef(0);
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastDirectionRef = useRef<'left' | 'right' | null>(null);
  const objectsRef = useRef<TrafficObject[]>([]);

  useEffect(() => {
    objectsRef.current = objects;
  }, [objects]);

  useEffect(() => {
    if (isGameStarting) {
      if (spawnTimerRef.current) {
        clearTimeout(spawnTimerRef.current);
        spawnTimerRef.current = null;
      }
      setObjects([]);
      return;
    }
  }, [isGameStarting]);

  useEffect(() => {
    if (isGameStarting) {
      return;
    }

    const findSafeTopPosition = (): number => {
      const MIN_VERTICAL_SPACING = 20;
      const maxAttempts = 10;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const candidatePosition = 10 + Math.random() * 70;

        const hasConflict = objectsRef.current.some(obj => {
          return Math.abs(obj.topPosition - candidatePosition) < MIN_VERTICAL_SPACING;
        });

        if (!hasConflict) {
          return candidatePosition;
        }
      }

      return 10 + Math.random() * 70;
    };

    const spawnObject = () => {
      if (objectsRef.current.length >= 4) {
        const nextSpawnDelay = 10000;
        spawnTimerRef.current = setTimeout(spawnObject, nextSpawnDelay);
        return;
      }

      const isEnemy = Math.random() < 0.5;
      const type: 'enemy' | 'spaceship' = isEnemy ? 'enemy' : 'spaceship';

      let asset: string;
      if (type === 'enemy') {
        asset = enemyGifs[Math.floor(Math.random() * enemyGifs.length)];
      } else {
        asset = spaceships[Math.floor(Math.random() * spaceships.length)];
      }

      let direction: 'left' | 'right';
      if (lastDirectionRef.current === null) {
        direction = Math.random() < 0.5 ? 'left' : 'right';
      } else {
        direction = lastDirectionRef.current === 'left' ? 'right' : 'left';
      }
      lastDirectionRef.current = direction;

      const topPosition = findSafeTopPosition();
      const duration = 8 + Math.random() * 4;

      const newObject: TrafficObject = {
        id: objectIdRef.current++,
        type,
        asset,
        direction,
        topPosition,
        duration
      };

      setObjects(prev => [...prev, newObject]);

      const nextSpawnDelay = 10000;
      spawnTimerRef.current = setTimeout(spawnObject, nextSpawnDelay);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (spawnTimerRef.current) {
          clearTimeout(spawnTimerRef.current);
          spawnTimerRef.current = null;
        }
        setObjects([]);
      } else {
        if (spawnTimerRef.current) {
          clearTimeout(spawnTimerRef.current);
        }
        const initialDelay = 3000;
        spawnTimerRef.current = setTimeout(spawnObject, initialDelay);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const initialDelay = 0;
    spawnTimerRef.current = setTimeout(spawnObject, initialDelay);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (spawnTimerRef.current) {
        clearTimeout(spawnTimerRef.current);
      }
    };
  }, [isGameStarting]);

  const handleAnimationComplete = (objectId: number) => {
    setObjects(prev => prev.filter(obj => obj.id !== objectId));
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 5,
        overflow: 'hidden',
        opacity: isGameStarting ? 0 : 1,
        transition: 'opacity 0s'
      }}
    >
      <AnimatePresence>
        {!isGameStarting && objects.map(obj => {
          const isSpaceship = obj.type === 'spaceship';
          const rotation = isSpaceship ? (obj.direction === 'right' ? 90 : -90) : 0;

          return (
            <motion.div
              key={obj.id}
              initial={{
                x: obj.direction === 'left' ? '110vw' : '-150px',
                y: 0
              }}
              animate={{
                x: obj.direction === 'left' ? '-150px' : '110vw',
                y: 0
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: obj.duration,
                ease: 'linear'
              }}
              onAnimationComplete={() => handleAnimationComplete(obj.id)}
              style={{
                position: 'absolute',
                top: `${obj.topPosition}%`,
                width: '93.53px',
                height: '70.72px',
                pointerEvents: 'none'
              }}
            >
              <img
                src={obj.asset}
                alt={obj.type}
                style={{
                  width: '100%',
                  height: '100%',
                  imageRendering: 'pixelated',
                  objectFit: 'contain', 
                  filter: obj.type === 'enemy' ? 'drop-shadow(0 0 1px #BB2649) drop-shadow(0 0 8px #BB2649)' : 'drop-shadow(0 0 15px rgba(0, 242, 255, 0.4))',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: `translateZ(0) rotate(${rotation}deg) scale(1.01)`
                }}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
