import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { soundEffects, audioManager } from '../../utils/audioManager';
import { useState, useEffect, useRef } from 'react';
import { MobileInfoCarousel } from './MobileInfoCarousel';
import { MobileDualInfoBox } from './MobileDualInfoBox';
import MobileDialogue from './MobileDialogue';

interface Project {
  id: number;
  title: string;
  subline?: string;
  genre: string;
  description: string;
  tags?: string[];
  videoUrl?: string;
  contentBlocks?: { type: 'text' | 'video' | 'header' | 'images' | 'infoboxes'; content: string | string[] }[];
}

interface MobileProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const generateProjectId = (title: string): string => {
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const num1 = (hash % 90) + 10;
  const letter = String.fromCharCode(65 + (hash % 26));
  const num2 = (hash * 7) % 1000;
  return `${num1}-${letter}-${num2}`;
};

const tagColors = ['#A855F7', '#BE3455', '#22C55E', '#3B82F6'];

const getTagColor = (index: number): string => {
  return tagColors[index % tagColors.length];
};

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

export const MobileProjectModal = ({ project, onClose }: MobileProjectModalProps) => {
  const [isMuted, setIsMuted] = useState(audioManager.getMuted());
  const [statusBlink, setStatusBlink] = useState(true);
  const [japaneseText, setJapaneseText] = useState('最高傑作');
  const [displayText, setDisplayText] = useState('最高傑作');
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [dialogue, setDialogue] = useState<DialogueState | null>(null);
  const dialogueTimerRef = useRef<number | null>(null);
  const dialogueAudioRef = useRef<HTMLAudioElement | null>(null);

  const japaneseWords = ['最高傑作', 'クリエイティブ', '未来', '電脳'];
  const scrambleChars = ['█', '▓', '▒', '░', '■', '□', '▪', '▫', '◆', '◇', '●', '○'];

  useEffect(() => {
    const unsubscribe = audioManager.subscribe((muted) => {
      setIsMuted(muted);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setStatusBlink(prev => !prev);
    }, 800);
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
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
    if (!project) return;

    const timers: number[] = [];

    if (project.title === 'FLASH UP') {
      const timer = setTimeout(() => {
        showDialogue('Сиять? Это по моей части', 'brendinho');
      }, 3000);
      timers.push(timer);
    } else if (project.title === 'NERF PROКАЧКА') {
      const timer = setTimeout(() => {
        showDialogue('Посмотрим, у кого бластер больше?', 'smmario');
      }, 2000);
      timers.push(timer);
    } else if (project.title === 'LITTLEST PET SHOP') {
      const timer = setTimeout(() => {
        showDialogue('О, моё любимое шоу! Я там хлопушку держал', 'mudborya');
      }, 3000);
      timers.push(timer);
    } else if (project.title === 'S7 PRIORITY') {
      const timer = setTimeout(() => {
        showDialogue('Выше только моя самооценка', 'brendinho');
      }, 3000);
      timers.push(timer);
    } else if (project.title === '5 ОЗЕР') {
      const timer = setTimeout(() => {
        showDialogue('Ммм, что-то на немецком? I like that', 'smmario');
      }, 3000);
      timers.push(timer);
    } else if (project.title === 'ЯСНО СОЛНЫШКО') {
      const timer = setTimeout(() => {
        showDialogue('Настоящий креатор ест комменты на завтрак!', 'mudborya');
      }, 3000);
      timers.push(timer);
    }

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [project]);

  useEffect(() => {
    return () => {
      if (dialogueTimerRef.current) {
        clearTimeout(dialogueTimerRef.current);
      }
    };
  }, []);

  if (!project) return null;

  const projectId = generateProjectId(project.title);
  const allTags = [project.genre, ...(project.tags || [])];

  const handleBackClick = () => {
    try {
      const audio = new Audio('https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0_oztdlq.mp3');
      audio.volume = audioManager.getMuted() ? 0 : 0.6;
      audio.play().catch(err => console.warn('Failed to play button sound:', err));
    } catch (err) {
      console.warn('Failed to create button sound:', err);
    }
    onClose();
  };

  const handleMuteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const audio = new Audio('https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0_oztdlq.mp3');
      audio.volume = audioManager.getMuted() ? 0 : 0.6;
      audio.play().catch(err => console.warn('Failed to play button sound:', err));
    } catch (err) {
      console.warn('Failed to create button sound:', err);
    }
    audioManager.toggleMute();
  };

  const handleDragStart = (event: MouseEvent | TouchEvent | PointerEvent) => {
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const screenWidth = window.innerWidth;
    const leftActiveZone = screenWidth * 0.15;

    if (clientX <= leftActiveZone) {
      setDragStartX(clientX);
    } else {
      setDragStartX(null);
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (dragStartX !== null && info.offset.x > 100) {
      try {
        const audio = new Audio('https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0_oztdlq.mp3');
        audio.volume = audioManager.getMuted() ? 0 : 0.6;
        audio.play().catch(err => console.warn('Failed to play button sound:', err));
      } catch (err) {
        console.warn('Failed to create button sound:', err);
      }
      setIsExiting(true);
      setTimeout(() => {
        onClose();
      }, 250);
    }
    setDragStartX(null);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 0 }}
        animate={{
          opacity: isExiting ? 0 : 1,
          x: isExiting ? 100 : 0
        }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="fixed inset-0 z-[100] overflow-y-auto"
        style={{
          backgroundImage: 'url(https://res.cloudinary.com/djihbhmzz/image/upload/v1773337386/mobile_portfolio_bg_p4gswy.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="mobile-crt-overlay" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 101 }} />

        <div className="mobile-sticky-header px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackClick}
              className="flex items-center gap-2 mobile-white-pixel text-xs"
            >
              <ArrowLeft className="w-3 h-3" />
              НАЗАД
            </button>

            <p
              className="text-center flex-1 mx-4"
              style={{
                fontFamily: "'Press Start 2P', cursive",
                fontSize: '8px',
                color: '#BE3455',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                lineHeight: '1.4'
              }}
            >
              project #{projectId}
            </p>

            <button
              onClick={handleMuteClick}
              className="flex items-center justify-center"
              style={{
                minWidth: '32px',
                minHeight: '32px',
                background: 'transparent',
                border: 'none'
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ imageRendering: 'pixelated' }}
              >
                <rect x="4" y="14" width="4" height="12" fill="#FFFFFF"/>
                <rect x="8" y="12" width="3" height="16" fill="#FFFFFF"/>
                <rect x="11" y="10" width="3" height="20" fill="#FFFFFF"/>
                <rect x="14" y="8" width="4" height="24" fill="#FFFFFF"/>
                <rect x="18" y="10" width="3" height="20" fill="#FFFFFF"/>

                <path d="M22 12 Q26 12 26 20 Q26 28 22 28" stroke="#FFFFFF" strokeWidth="2" fill="none"/>
                <path d="M26 8 Q32 8 32 20 Q32 32 26 32" stroke="#FFFFFF" strokeWidth="2" fill="none"/>

                {isMuted && (
                  <>
                    <rect x="8" y="8" width="3" height="3" fill="#FF1493"/>
                    <rect x="11" y="11" width="3" height="3" fill="#FF1493"/>
                    <rect x="14" y="14" width="3" height="3" fill="#FF1493"/>
                    <rect x="17" y="17" width="3" height="3" fill="#FF1493"/>
                    <rect x="20" y="20" width="3" height="3" fill="#FF1493"/>
                    <rect x="23" y="23" width="3" height="3" fill="#FF1493"/>
                    <rect x="26" y="26" width="3" height="3" fill="#FF1493"/>
                    <rect x="29" y="29" width="3" height="3" fill="#FF1493"/>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        <motion.div
          ref={contentRef}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="relative z-10 px-6 pt-20 space-y-6 w-full"
          style={{ paddingBottom: '2.5rem', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
          drag={dragStartX !== null ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={{ left: 0, right: 0.15 }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          whileDrag={{
            opacity: dragStartX !== null ? 0.85 : 1,
            scale: dragStartX !== null ? 0.98 : 1
          }}
        >
          <div style={{ flex: '0 0 auto' }}>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                padding: 0,
                margin: 0
              }}
            >
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mobile-3d-text-large"
                data-text={project.title}
                style={{
                  fontSize: project.title === 'ТРАНСФОРМЕРЫ: ПОРТАЛ' ? '1.62rem' : '1.8rem',
                  lineHeight: '1.4',
                  textAlign: 'center',
                  marginBottom: '1rem',
                  paddingLeft: 0,
                  marginLeft: 0
                }}
              >
                {project.title}
              </motion.h1>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2 justify-center mb-4"
            >
            {allTags.map((tag, index) => {
              const bgColor = getTagColor(index);
              const isCreativeStrategy = tag.toLowerCase() === 'креативная стратегия';

              return (
                <span
                  key={index}
                  style={{
                    fontSize: isCreativeStrategy ? '6.5px' : '9px',
                    fontWeight: '400',
                    textTransform: 'uppercase',
                    border: '2px solid #FFFFFF',
                    borderRadius: '50px',
                    backgroundColor: bgColor,
                    color: '#FFFFFF',
                    letterSpacing: isCreativeStrategy ? '-0.03em' : '0.02em',
                    imageRendering: 'pixelated',
                    textShadow: '0 0 8px rgba(255, 255, 255, 0.4)',
                    lineHeight: isCreativeStrategy ? '1.2' : 'normal',
                    maxWidth: isCreativeStrategy ? '85px' : 'none',
                    whiteSpace: isCreativeStrategy ? 'normal' : 'nowrap',
                    textAlign: 'center',
                    display: 'inline-block',
                    paddingLeft: isCreativeStrategy ? '8px' : '12px',
                    paddingRight: isCreativeStrategy ? '8px' : '12px',
                    paddingTop: isCreativeStrategy ? '6px' : '8px',
                    paddingBottom: isCreativeStrategy ? '6px' : '8px'
                  }}
                >
                  {tag}
                </span>
              );
            })}
            </motion.div>
          </div>

          <div style={{ flex: '1 1 auto' }}>
          {project.contentBlocks ? (
            project.contentBlocks.map((block, index) => {
              if (block.type === 'header') {
                return (
                  <motion.h2
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    style={{
                      fontFamily: "'Press Start 2P', cursive",
                      fontSize: '14px',
                      color: '#A855F7',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      lineHeight: '1.6',
                      textAlign: 'center',
                      width: '100%',
                      marginTop: '1.5rem',
                      marginBottom: '1rem'
                    }}
                  >
                    {typeof block.content === 'string' ? block.content : ''}
                  </motion.h2>
                );
              }

              if (block.type === 'text') {
                return (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    style={{
                      fontFamily: "'Press Start 2P', cursive",
                      fontSize: '10px',
                      color: '#FFFFFF',
                      textAlign: 'center',
                      width: '100%',
                      lineHeight: '1.8',
                      letterSpacing: '0.02em',
                      marginBottom: '1rem'
                    }}
                    dangerouslySetInnerHTML={{ __html: typeof block.content === 'string' ? block.content : '' }}
                  />
                );
              }

              if (block.type === 'video') {
                const videoId = typeof block.content === 'string' ? block.content.split('/').pop() : '';
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="relative w-full mb-6"
                    style={{
                      paddingTop: '56.25%',
                      backgroundColor: '#000',
                      border: '2px solid #FFFFFF',
                      overflow: 'hidden'
                    }}
                  >
                    <iframe
                      src={`https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`}
                      className="absolute inset-0 w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  </motion.div>
                );
              }

              if (block.type === 'images') {
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="w-full mb-6"
                    style={{
                      overflowX: 'auto',
                      overflowY: 'hidden',
                      WebkitOverflowScrolling: 'touch',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        gap: '12px',
                        paddingBottom: '8px'
                      }}
                    >
                      {Array.isArray(block.content) && block.content.map((imgSrc, imgIndex) => (
                        <div
                          key={imgIndex}
                          style={{
                            flexShrink: 0,
                            width: '280px',
                            height: '373px',
                            border: '2px solid #FFFFFF',
                            backgroundColor: '#000',
                            overflow: 'hidden'
                          }}
                        >
                          <img
                            src={imgSrc}
                            alt={`Gallery image ${imgIndex + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              imageRendering: 'auto'
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              }

              if (block.type === 'infoboxes') {
                try {
                  const infoBoxes = typeof block.content === 'string' ? JSON.parse(block.content) : [];

                  if (infoBoxes.length === 2 && infoBoxes[0]?.increasedPadding && infoBoxes[1]?.increasedPadding) {
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        <MobileDualInfoBox infoBoxes={infoBoxes as [any, any]} />
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <MobileInfoCarousel infoBoxes={infoBoxes} />
                    </motion.div>
                  );
                } catch (e) {
                  return null;
                }
              }

              return null;
            })
          ) : (
            <>
              {project.description && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  style={{
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: '10px',
                    color: '#FFFFFF',
                    textAlign: 'center',
                    width: '100%',
                    lineHeight: '1.8',
                    letterSpacing: '0.02em',
                    marginBottom: '1rem'
                  }}
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              )}
              {project.videoUrl && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="relative w-full mb-6"
                  style={{
                    paddingTop: '56.25%',
                    backgroundColor: '#000',
                    border: '2px solid #FFFFFF',
                    overflow: 'hidden'
                  }}
                >
                  <iframe
                    src={`https://player.vimeo.com/video/${project.videoUrl.split('/').pop()}?title=0&byline=0&portrait=0`}
                    className="absolute inset-0 w-full h-full"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                </motion.div>
              )}
            </>
          )}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="pt-10 pb-10 w-full border-t-2 border-[#BE345580]"
            style={{
              marginTop: 'auto',
              flex: '0 0 auto',
              fontFamily: "'Press Start 2P', cursive"
            }}
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#22C55E',
                    opacity: statusBlink ? 1 : 0.3,
                    transition: 'opacity 0.3s'
                  }}
                />
                <span
                  style={{
                    fontSize: '8px',
                    color: '#BE3455',
                    letterSpacing: '0.05em'
                  }}
                >
                  STATUS: ACTIVE
                </span>
              </div>

              <div
                style={{
                  fontSize: '14px',
                  color: '#A855F7',
                  letterSpacing: '0.05em',
                  textAlign: 'center',
                  flex: 1,
                  textShadow: '0 0 10px rgba(168, 85, 247, 0.8)'
                }}
              >
                {displayText}
              </div>

              <span
                style={{
                  fontSize: '8px',
                  color: '#BE3455',
                  letterSpacing: '0.05em'
                }}
              >
                VER 1.1.0
              </span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

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
    </AnimatePresence>
  );
};
