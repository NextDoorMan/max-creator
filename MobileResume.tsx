import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { soundEffects, audioManager } from '../../utils/audioManager';
import { useState, useEffect } from 'react';
import { CachedImage } from '../CachedImage';

interface MobileResumeProps {
  onClose: () => void;
}

interface Experience {
  id: number;
  company: string;
  role: string;
  period: string;
  description: string;
  brands: string[];
  image: string;
}

const experiences: Experience[] = [
  {
    id: 1,
    company: 'MILK CREATIVE',
    role: 'СТАЖЕР',
    period: 'Май 2015 — Май 2016',
    description: 'Первые шаги в креативе.\nВпервые узнал, что такое BIG IDEA, инсайты и креативные штурмы. И что плохих идей не бывает, но бывают те, что не в бриф.\nПомогал команде креативно и морально на самых разных проектах.',
    brands: ['VELKOPOPOVICKY KOZEL', 'СБЕРБАНК', 'MERCI', 'CORDIANT', 'ЦИАН', 'TEVA'],
    image: '/assets/cv/резюме_1.png'
  },
  {
    id: 2,
    company: 'RAPP RUSSIA',
    role: 'МЛАДШИЙ КОПИРАЙТЕР',
    period: 'Май 2016 — Дек 2016',
    description: 'Медленно, но верно набираемся опыта.\nЗдесь я открыл для себя фишки BTL-коммуникаций и только начал осознавать весь масштаб возможностей современного креатива.',
    brands: ['RENAULT CIS', 'RENAULT LOGAN', 'J.D.BURGERS', 'MCDONALD\'S', 'FRESH BAR', 'TELE 2'],
    image: '/assets/cv/резюме_2.png'
  },
  {
    id: 3,
    company: 'MARVELOUS',
    role: 'МЛАДШИЙ КРЕАТОР',
    period: 'Янв 2017 — Апр 2018',
    description: 'Кайфовал на брендах Hasbro и с головой погрузился в креатив-360: сценарии, наружка, SMM, cпецпроекты, digital, PR.\nА еще съемки, озвучка и прочие особенности национального продакшна. Понравилось.',
    brands: ['NERF', 'TRANSFORMERS', 'FURREAL FRIENDS', 'DOH-VINCI', 'MY LITTLE PONY', 'HASBRO GAMING'],
    image: '/assets/cv/резюме_3.png'
  },
  {
    id: 4,
    company: 'MINDSHARE RUSSIA',
    role: 'МЛАДШИЙ КРЕАТОР',
    period: 'Апр 2018 — Сен 2018',
    description: 'Впервые попал в глобальную рекламную сеть.\nУчаствовал в проектной работе для брендов Nestle Purina. Работал над роликами, спецпроектами и SMM.',
    brands: ['FELIX', 'FRISKIES', 'GOURMET', 'PURINA ONE'],
    image: '/assets/cv/резюме_4.png'
  },
  {
    id: 5,
    company: 'FABULA CONTENT',
    role: 'SMM-КРЕАТОР',
    period: 'Сен 2018 — Июн 2019',
    description: 'Трудился на поприще SMM-креатора и понял, что в социальных сетях можно развернуться не менее круто, чем в ATL или BTL.',
    brands: ['ZEWA', 'VALIO', 'KAGOTSEL', 'WELEDA', 'AMWAY'],
    image: '/assets/cv/резюме_5.png'
  },
  {
    id: 6,
    company: 'ACCORD DIGITAL',
    role: 'КРЕАТОР',
    period: 'Авг 2019 — Ноя 2020',
    description: 'Всё и сразу: ролики, SMM, спецпроекты, наружка, радио, брендинг.\nЛьвиная доля приходилась на бренды алкогольной продукции.',
    brands: ['BELUGA', 'BALTIKA', 'ТРИ КОТА', 'DANONE'],
    image: '/assets/cv/резюме_6.png'
  },
  {
    id: 7,
    company: 'TBWA',
    role: 'КРЕАТОР',
    period: 'Янв 2021 — Янв 2023',
    description: 'Набрался огромного опыта в работе с сектором автомобилей.\nКреативил для Nissan 24/7: ролики, радио, SMM, спецпроекты, наружка, киберспортивные проекты',
    brands: ['NISSAN', 'NISSAN', 'И ЕЩЕ РАЗ NISSAN'],
    image: '/assets/cv/резюме_7.png'
  },
  {
    id: 8,
    company: 'MADNESS',
    role: 'КОПИРАЙТЕР',
    period: 'Янв 2023 — Июн 2024',
    description: 'Мощно ворвался в ATL: ролики, наружка, креативные платформы, радио.\nПомимо креатива участвовал в съемках и пост-продакшне.',
    brands: ['ZATECKY GUS', 'RADIO ENERGY', 'ЯСНО СОЛНЫШКО', 'HOLSTEN', 'LAVINA', 'VTB', 'FLASH UP'],
    image: '/assets/cv/резюме_8.png'
  },
  {
    id: 9,
    company: 'ACTION',
    role: 'СТАРШИЙ КРЕАТОР',
    period: 'Июн 2024 — Окт 2025',
    description: 'Бодро креативил 360 с упором на BTL и event, был лидом на ряде проектов.\nУчаствовал в массе тендеров для Авито, Lactalis и других брендов. Выиграл 60% тендеров.',
    brands: ['АВИТО', 'PRESIDENT', 'PARMALAT', 'MTS', 'YANDEX', 'S7'],
    image: '/assets/cv/резюме_9.png'
  }
];

const gradientMap: { [key: number]: string } = {
  1: 'radial-gradient(circle at 80% 85%, #00bfff 0%, #0066cc 30%, #000000 65%)',
  2: 'radial-gradient(circle at 70% 40%, #ff1493 0%, #8b0a50 25%, #000000 60%)',
  3: 'radial-gradient(circle at 50% 50%, #8b004b 0%, #4d0026 30%, #000000 70%)',
  4: 'radial-gradient(circle at 50% 100%, #00ced1 0%, #008b8b 35%, #000000 70%)',
  5: 'radial-gradient(circle at 25% 60%, #ff1493 0%, #8b0a50 25%, #000000 60%)',
  6: 'linear-gradient(to bottom, #50c878 0%, #2d7f4f 20%, #000000 50%, #000000 100%)',
  7: 'linear-gradient(to top, #dc143c 0%, #8b0000 40%, #000000 70%)',
  8: 'radial-gradient(circle at 15% 15%, #8b00ff 0%, #4b0082 30%, #000000 65%)',
  9: 'radial-gradient(circle at 80% 85%, #00bfff 0%, #0066cc 30%, #000000 65%)'
};

export const MobileResume = ({ onClose }: MobileResumeProps) => {
  const [isMuted, setIsMuted] = useState(audioManager.getMuted());
  const [statusBlink, setStatusBlink] = useState(true);
  const [japaneseText, setJapaneseText] = useState('最高傑作');
  const [displayText, setDisplayText] = useState('最高傑作');
  const [arrowBlink, setArrowBlink] = useState(true);
  const [arrowColorIndex, setArrowColorIndex] = useState(0);

  const japaneseWords = ['最高傑作', 'クリエイティブ', '未来', '電脳'];
  const scrambleChars = ['█', '▓', '▒', '░', '■', '□', '▪', '▫', '◆', '◇', '●', '○'];
  const arrowColors = ['#BE3455', '#FFFFFF', '#FACC15', '#397eed', '#A855F7'];

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
    const arrowBlinkInterval = setInterval(() => {
      setArrowBlink(prev => !prev);
      setArrowColorIndex(prev => (prev + 1) % arrowColors.length);
    }, 400);
    return () => clearInterval(arrowBlinkInterval);
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

  const handleDownload = async () => {
    try {
      const audio = new Audio('https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0_oztdlq.mp3');
      audio.volume = audioManager.getMuted() ? 0 : 0.6;
      audio.play().catch(err => console.warn('Failed to play button sound:', err));
    } catch (err) {
      console.warn('Failed to create button sound:', err);
    }
    try {
      const response = await fetch('/assets/cv/Maxim_Bondarenko_CV.pdf');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Maxim_Bondarenko_CV.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
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
              RESUME #MB-007
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
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="relative z-10 px-6 pt-20 pb-20 space-y-6 w-full"
          style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ flex: '0 0 auto', width: '100%' }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '1.5rem'
              }}
            >
              <div
                style={{
                  opacity: arrowBlink ? 1 : 0,
                  transition: 'none',
                  color: arrowColors[arrowColorIndex],
                  filter: `drop-shadow(0 0 8px ${arrowColors[arrowColorIndex]})`,
                  transform: 'scale(1.2)'
                }}
              >
                <ChevronLeft size={24} strokeWidth={4} style={{ imageRendering: 'pixelated' }} />
              </div>

              <span
                style={{
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: '16px',
                  fontWeight: 'bold',
                  letterSpacing: '0.15em',
                  color: '#FFFFFF',
                  textShadow: `
                    0 0 8px rgba(255, 255, 255, 0.8),
                    0 0 16px rgba(255, 107, 107, 0.6),
                    2px 2px 4px rgba(0, 0, 0, 0.8),
                    -2px -2px 4px rgba(255, 255, 255, 0.3)
                  `,
                  imageRendering: 'pixelated',
                  filter: 'brightness(1.1)'
                }}
              >
                SWIPE
              </span>

              <div
                style={{
                  opacity: arrowBlink ? 1 : 0,
                  transition: 'none',
                  color: arrowColors[arrowColorIndex],
                  filter: `drop-shadow(0 0 8px ${arrowColors[arrowColorIndex]})`,
                  transform: 'scale(1.2)'
                }}
              >
                <ChevronRight size={24} strokeWidth={4} style={{ imageRendering: 'pixelated' }} />
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full overflow-x-auto overflow-y-hidden pb-4"
            style={{
              WebkitOverflowScrolling: 'touch',
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              flex: '1 1 auto'
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '32px',
                paddingBottom: '8px'
              }}
            >
              {experiences.map((exp, index) => {
                const characterGradient = gradientMap[exp.id] || 'radial-gradient(circle at 50% 50%, #ff4500 0%, #8b2500 25%, #000000 60%)';

                return (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    style={{
                      flexShrink: 0,
                      width: 'calc(100vw - 64px)',
                      scrollSnapAlign: 'start',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '16px'
                    }}
                  >
                    <h2
                      className="mobile-3d-text uppercase"
                      style={{
                        fontSize: '1.455rem',
                        lineHeight: '1.4',
                        textAlign: 'center'
                      }}
                    >
                      {exp.company}
                    </h2>

                    <p
                      className="uppercase"
                      style={{
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '16px',
                        color: '#A855F7',
                        textShadow: '0 0 10px rgba(168, 85, 247, 0.8)',
                        lineHeight: '1.4',
                        textAlign: 'center'
                      }}
                    >
                      {exp.role}
                    </p>

                    <p
                      style={{
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '12px',
                        color: '#397eed',
                        lineHeight: '1.4',
                        textAlign: 'center',
                        marginBottom: '8px'
                      }}
                    >
                      {exp.period}
                    </p>

                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: '100%',
                        height: '240px',
                        border: '2px solid #FFFFFF',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        background: characterGradient,
                        boxShadow: '0 0 15px rgba(0, 255, 255, 0.4)'
                      }}
                    >
                      <CachedImage
                        src={exp.image}
                        alt={exp.company}
                        className="max-w-full max-h-full object-contain"
                        style={{
                          imageRendering: 'pixelated'
                        }}
                      />
                    </div>

                    <div
                      style={{
                        fontFamily: "'Press Start 2P', cursive",
                        fontSize: '11px',
                        color: '#FFFFFF',
                        lineHeight: '1.8',
                        textAlign: 'center',
                        letterSpacing: '0.02em',
                        marginTop: '8px'
                      }}
                    >
                      {exp.description.split('\n').map((line, idx) => (
                        <p key={idx} style={{ marginBottom: idx < exp.description.split('\n').length - 1 ? '0.8em' : 0 }}>
                          {line}
                        </p>
                      ))}
                    </div>

                    <div style={{ width: '100%', marginTop: '8px' }}>
                      <h5
                        className="mb-3"
                        style={{
                          fontFamily: "'Press Start 2P', cursive",
                          fontSize: '10px',
                          color: '#00ffff',
                          textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
                          letterSpacing: '0.05em',
                          textAlign: 'center'
                        }}
                      >
                        С ЧЕМ РАБОТАЛ:
                      </h5>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {exp.brands.map((brand, brandIndex) => (
                          <span
                            key={brandIndex}
                            style={{
                              fontSize: '9px',
                              fontWeight: '400',
                              textTransform: 'uppercase',
                              border: '2px solid #FFFFFF',
                              borderRadius: '50px',
                              backgroundColor: 'transparent',
                              color: '#FFFFFF',
                              letterSpacing: '0.02em',
                              imageRendering: 'pixelated',
                              textShadow: '0 0 6px rgba(255, 255, 255, 0.4)',
                              lineHeight: 'normal',
                              whiteSpace: 'nowrap',
                              textAlign: 'center',
                              display: 'inline-block',
                              paddingLeft: '10px',
                              paddingRight: '10px',
                              paddingTop: '6px',
                              paddingBottom: '6px',
                              fontFamily: "'Press Start 2P', cursive"
                            }}
                          >
                            {brand}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + experiences.length * 0.05 }}
                style={{
                  flexShrink: 0,
                  width: 'calc(100vw - 64px)',
                  scrollSnapAlign: 'start',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '24px',
                  paddingTop: '20px'
                }}
              >
                <h2
                  className="uppercase"
                  style={{
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: '18px',
                    color: '#A66FB5',
                    lineHeight: '1.6',
                    textAlign: 'center'
                  }}
                >
                  ВЫ НАХОДИТЕСЬ ЗДЕСЬ
                </h2>

                <img
                  src="https://res.cloudinary.com/djihbhmzz/image/upload/v1771490810/about_icon_fi3b5s.png"
                  alt="Location Icon"
                  style={{
                    width: '58px',
                    height: '75px',
                    imageRendering: 'pixelated',
                    filter: 'drop-shadow(0 0 8px rgba(166, 111, 181, 0.6))'
                  }}
                />

                <p
                  style={{
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: '12px',
                    color: '#FFFFFF',
                    lineHeight: '1.8',
                    textAlign: 'center',
                    letterSpacing: '0.02em',
                    marginTop: '8px'
                  }}
                >
                  Скачайте полное резюме в формате PDF
                </p>

                <button
                  onClick={handleDownload}
                  className="flex items-center gap-3 px-6 py-3 border-2 border-cyan-400 hover:bg-cyan-950 transition-all duration-300"
                  style={{
                    color: '#00ffff',
                    textShadow: '0 0 10px rgba(0, 255, 255, 0.8)',
                    imageRendering: 'pixelated',
                    boxShadow: '0 0 15px rgba(0, 255, 255, 0.4)',
                    backgroundColor: 'transparent',
                    borderRadius: '8px',
                    marginTop: '8px'
                  }}
                >
                  <Download className="w-5 h-5" />
                  <span
                    style={{
                      fontFamily: "'Press Start 2P', cursive",
                      fontSize: '10px'
                    }}
                  >
                    СКАЧАТЬ PDF
                  </span>
                </button>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="pt-10 pb-3 w-full border-t-2 border-[#BE345580]"
            style={{
              marginTop: '3rem',
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
                  STATUS: OK
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
    </AnimatePresence>
  );
};
