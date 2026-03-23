import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { soundEffects, audioManager } from '../../utils/audioManager';
import { AudioToggle } from './AudioToggle';
import MobileDialogue from './MobileDialogue';

interface MobileContactsProps {
  onClose: () => void;
}

interface FloatingIcon {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  src: string;
  alt: string;
  href?: string;
  width: number;
  height: number;
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

export const MobileContacts = ({ onClose }: MobileContactsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const iconsRef = useRef<FloatingIcon[]>([]);
  const [iconPositions, setIconPositions] = useState<FloatingIcon[]>([]);
  const [dialogue, setDialogue] = useState<DialogueState | null>(null);
  const dialogueTimerRef = useRef<number | null>(null);
  const isProcessingRef = useRef(false);
  const dialogueAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const baseSize = Math.min(width, height) * 0.22;

    const initialIcons: FloatingIcon[] = [
      {
        id: 'telegram',
        x: width * 0.2,
        y: height * 0.3,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        src: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1773436802/%D0%BA%D0%BE%D0%BD%D1%82%D0%B0%D0%BA%D1%82_%D0%BC%D0%BE%D0%B1%D0%B0%D0%B9%D0%BB_%D1%82%D0%B3_1_pzi9ej.png',
        alt: 'Telegram',
        href: 'https://t.me/BuddyNextDoor',
        width: baseSize,
        height: baseSize
      },
      {
        id: 'discord',
        x: width * 0.7,
        y: height * 0.4,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        src: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1773436802/%D0%BA%D0%BE%D0%BD%D1%82%D0%B0%D0%BA%D1%82_%D0%BC%D0%BE%D0%B1%D0%B0%D0%B9%D0%BB_%D0%B4%D0%B8%D1%81%D0%BA%D0%BE%D1%80%D0%B4_1_fucesb.png',
        alt: 'Discord',
        href: 'https://discord.com/users/1049011262450839614',
        width: baseSize,
        height: baseSize
      },
      {
        id: 'mail',
        x: width * 0.5,
        y: height * 0.6,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        src: 'https://res.cloudinary.com/djihbhmzz/image/upload/v1773436803/%D0%BA%D0%BE%D0%BD%D1%82%D0%B0%D0%BA%D1%82_%D0%BC%D0%BE%D0%B1%D0%B0%D0%B9%D0%BB_%D0%BF%D0%BE%D1%87%D1%82%D0%B0_1_vcpwhc.png',
        alt: 'Mail',
        width: baseSize,
        height: baseSize
      }
    ];

    iconsRef.current = initialIcons;
    setIconPositions([...initialIcons]);

    const checkCollision = (icon1: FloatingIcon, icon2: FloatingIcon): boolean => {
      const dx = icon1.x - icon2.x;
      const dy = icon1.y - icon2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const radius1 = (icon1.width / 2) * 0.92;
      const radius2 = (icon2.width / 2) * 0.92;
      return distance < (radius1 + radius2);
    };

    const resolveCollision = (icon1: FloatingIcon, icon2: FloatingIcon) => {
      const dx = icon2.x - icon1.x;
      const dy = icon2.y - icon1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance === 0) return;

      const nx = dx / distance;
      const ny = dy / distance;

      const relativeVelocityX = icon2.vx - icon1.vx;
      const relativeVelocityY = icon2.vy - icon1.vy;
      const velocityAlongNormal = relativeVelocityX * nx + relativeVelocityY * ny;

      if (velocityAlongNormal > 0) return;

      const restitution = 0.7;
      const impulse = (-(1 + restitution) * velocityAlongNormal) / 2;

      icon1.vx -= impulse * nx;
      icon1.vy -= impulse * ny;
      icon2.vx += impulse * nx;
      icon2.vy += impulse * ny;

      const radius1 = (icon1.width / 2) * 0.92;
      const radius2 = (icon2.width / 2) * 0.92;
      const minDistance = radius1 + radius2;
      const overlap = minDistance - distance;
      const separationX = (overlap / 2) * nx;
      const separationY = (overlap / 2) * ny;

      icon1.x -= separationX;
      icon1.y -= separationY;
      icon2.x += separationX;
      icon2.y += separationY;
    };

    const animate = () => {
      const icons = iconsRef.current;
      const width = containerRef.current?.clientWidth || window.innerWidth;
      const height = containerRef.current?.clientHeight || window.innerHeight;

      icons.forEach(icon => {
        icon.x += icon.vx;
        icon.y += icon.vy;
        icon.rotation += icon.rotationSpeed;

        const halfWidth = icon.width / 2;
        const halfHeight = icon.height / 2;
        const padding = 20;

        if (icon.x - halfWidth < padding) {
          icon.x = padding + halfWidth;
          icon.vx = -icon.vx;
        } else if (icon.x + halfWidth > width - padding) {
          icon.x = width - padding - halfWidth;
          icon.vx = -icon.vx;
        }

        if (icon.y - halfHeight < padding + 80) {
          icon.y = padding + 80 + halfHeight;
          icon.vy = -icon.vy;
        } else if (icon.y + halfHeight > height - padding) {
          icon.y = height - padding - halfHeight;
          icon.vy = -icon.vy;
        }

        const speed = Math.sqrt(icon.vx * icon.vx + icon.vy * icon.vy);

        if (speed < 0.5) {
          const pushAngle = Math.random() * Math.PI * 2;
          icon.vx += Math.cos(pushAngle) * 0.3;
          icon.vy += Math.sin(pushAngle) * 0.3;
        }

        const maxSpeed = 1.5;
        if (speed > maxSpeed) {
          icon.vx = (icon.vx / speed) * maxSpeed;
          icon.vy = (icon.vy / speed) * maxSpeed;
        }
      });

      for (let i = 0; i < icons.length; i++) {
        for (let j = i + 1; j < icons.length; j++) {
          if (checkCollision(icons[i], icons[j])) {
            resolveCollision(icons[i], icons[j]);
          }
        }
      }

      setIconPositions([...icons]);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

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
    setDialogue({ text, heroId, isVisible: true });

    if (!audioManager.getMuted() && dialogueAudioRef.current) {
      try {
        dialogueAudioRef.current.currentTime = 0;
        dialogueAudioRef.current.play().catch(err => console.warn('Failed to play dialogue sound:', err));
      } catch (err) {
        console.warn('Failed to play dialogue sound:', err);
      }
    }

    if (dialogueTimerRef.current) {
      clearTimeout(dialogueTimerRef.current);
    }

    dialogueTimerRef.current = window.setTimeout(() => {
      setDialogue(null);
    }, duration);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      showDialogue('Позвони. Я буду ждать', 'smmario', 4000);
    }, 3000);

    return () => {
      clearTimeout(timer);
      if (dialogueTimerRef.current) {
        clearTimeout(dialogueTimerRef.current);
      }
    };
  }, []);

  const handleBack = () => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    try {
      const audio = new Audio('https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0_oztdlq.mp3');
      audio.volume = audioManager.getMuted() ? 0 : 0.6;
      audio.play().catch(err => console.warn('Failed to play button sound:', err));
    } catch (err) {
      console.warn('Failed to create button sound:', err);
    }

    setTimeout(() => {
      onClose();
      isProcessingRef.current = false;
    }, 100);
  };

  const handleIconClick = (icon: FloatingIcon) => {
    try {
      const audio = new Audio('https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0_oztdlq.mp3');
      audio.volume = audioManager.getMuted() ? 0 : 0.6;
      audio.play().catch(err => console.warn('Failed to play click sound:', err));
    } catch (err) {
      console.warn('Failed to create click sound:', err);
    }

    if (icon.href) {
      window.open(icon.href, '_blank', 'noopener,noreferrer');
    } else if (icon.id === 'mail') {
      const mailtoLink = 'mailto:makbondal@mail.ru';
      window.location.href = mailtoLink;
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full flex flex-col relative overflow-hidden"
      style={{ background: 'transparent' }}
    >
      <div className="mobile-sticky-header px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 mobile-white-pixel text-xs"
          >
            <ArrowLeft className="w-3 h-3" />
            НАЗАД
          </button>

          <h1
            className="text-center flex-1 mx-4 mobile-3d-text"
            style={{ fontSize: '1.31rem' }}
          >
            КОНТАКТЫ
          </h1>

          <div className="flex items-center justify-center" style={{ minWidth: '32px' }}>
            <AudioToggle />
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative" style={{ marginTop: '20px' }}>
        <motion.div
          className="text-center z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            position: 'relative',
            pointerEvents: 'none'
          }}
        >
          <h2
            className="mobile-white-pixel text-lg mb-3"
            style={{
              color: '#B19CD9',
              textShadow: '0 0 15px rgba(177, 156, 217, 0.8)',
              letterSpacing: '0.05em'
            }}
          >
            МАКСИМ БОНДАРЕНКО
          </h2>
          <p
            className="mobile-white-pixel text-lg mb-3"
            style={{
              color: '#FFFFFF',
              fontSize: '0.7rem',
              textShadow: '0 0 8px rgba(255, 255, 255, 0.6)',
              letterSpacing: '0.05em'
            }}
          >
            +7 (985) 122-19-35
          </p>
           <p
            className="mobile-white-pixel text-lg mb-3"
            style={{
              color: '#FFFFFF',
              fontSize: '0.9rem',
              textShadow: '0 0 8px rgba(255, 255, 255, 0.6)',
              letterSpacing: '0.05em'
            }}
          >
            makbondal@mail.ru
          </p>
        </motion.div>

        {iconPositions.map((icon) => {
          const handleClick = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            try {
              const audio = new Audio('https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0_oztdlq.mp3');
              audio.volume = audioManager.getMuted() ? 0 : 0.6;
              audio.play().catch(err => console.warn('Failed to play click sound:', err));
            } catch (err) {
              console.warn('Failed to create click sound:', err);
            }

            if (icon.href) {
              window.open(icon.href, '_blank', 'noopener,noreferrer');
            } else if (icon.id === 'mail') {
              const mailtoLink = 'mailto:makbondal@mail.ru';
              window.location.href = mailtoLink;
            }
          };

          const iconElement = (
            <motion.div
              style={{
                position: 'absolute',
                left: icon.x,
                top: icon.y,
                transform: `translate(-50%, -50%) rotate(${icon.rotation}rad)`,
                cursor: 'pointer',
                zIndex: 20,
                imageRendering: 'pixelated',
                pointerEvents: 'auto'
              }}
            >
              <img
                src={icon.src}
                alt={icon.alt}
                style={{
                  width: `${icon.width}px`,
                  height: `${icon.height}px`,
                  imageRendering: 'pixelated',
                  pointerEvents: 'none',
                  filter: 'brightness(0.85)',
                  transition: 'filter 0.2s ease',
                  objectFit: 'contain'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = 'brightness(1.2) drop-shadow(0 0 20px rgba(255, 255, 255, 0.6))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = 'brightness(0.85)';
                }}
              />
            </motion.div>
          );

          if (icon.href) {
            return (
              <a
                key={icon.id}
                href={icon.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClick}
                style={{ pointerEvents: 'auto', textDecoration: 'none' }}
              >
                {iconElement}
              </a>
            );
          } else {
            return (
              <button
                key={icon.id}
                onClick={handleClick}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  pointerEvents: 'auto',
                  cursor: 'pointer'
                }}
              >
                {iconElement}
              </button>
            );
          }
        })}
      </div>

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
    </div>
  );
};
