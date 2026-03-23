import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import IntroScreen from './components/IntroScreen';
import LoadingScreen from './components/LoadingScreen';
import HeroSelection from './components/HeroSelection';
import RunnerGame from './components/RunnerGame';
import MainPortfolio from './components/MainPortfolio';
import { MobileStartScreen } from './components/mobile/MobileStartScreen';
import { MobileLoadingScreen } from './components/mobile/MobileLoadingScreen';
import { MobileMainMenu } from './components/mobile/MobileMainMenu';
import MobileHeroSelector from './components/mobile/MobileHeroSelector';
import MobileSpaceGame from './components/mobile/MobileSpaceGame';
import { MobileSpaceBackground } from './components/mobile/MobileSpaceBackground';
import { MobileGlitchTransition } from './components/mobile/MobileGlitchTransition';
import { WoohooTitle } from './components/mobile/WoohooTitle';
import { GlitchOverlay } from './components/mobile/GlitchOverlay';
import { useIsMobile } from './utils/useIsMobile';
import { audioManager, soundEffects } from './utils/audioManager';
import { startKeepAlive, stopKeepAlive } from './utils/keepAlive';
import { assetCache, IMAGE_ASSETS } from './utils/persistentAssetCache';
import { audioRecovery } from './utils/audioRecovery';

type Screen = 'intro' | 'loading' | 'hero-selection' | 'runner-game' | 'portfolio';
type MobileScreen = 'intro' | 'loading' | 'menu' | 'warp' | 'glitch' | 'hero-selection' | 'space-game';
const AUDIO_ASSETS = [
  'https://res.cloudinary.com/djihbhmzz/video/upload/v1773077822/space_victory_qc63yw.mp3',
  'https://res.cloudinary.com/djihbhmzz/video/upload/v1772317785/%D0%93%D0%BB%D0%B8%D1%87_qxzkdx.mp3'
  ];

function App() {
  const isMobile = useIsMobile(768);
  const [currentScreen, setCurrentScreen] = useState<Screen>('intro');
  const [mobileScreen, setMobileScreen] = useState<MobileScreen>('intro');
  const [selectedHero, setSelectedHero] = useState<string>('');
  const [gameScore, setGameScore] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const glitchAudioRef = useRef<HTMLAudioElement | null>(null);

  const showBackgroundVideo = currentScreen === 'hero-selection' || currentScreen === 'portfolio';

  useEffect(() => {
    startKeepAlive();
    audioRecovery.init();

    Promise.all().then(() => {
      console.log('✓ All assets (images & audio) preloaded and cached');
      setAssetsLoaded(true);
    }).catch(err => {
      console.warn('Asset preload had some errors:', err);
      setAssetsLoaded(true);
    });

    const unlockAudio = async () => {
      try {
        const AudioContext = (window.AudioContext || (window as any).webkitAudioContext);
        if (AudioContext) {
          const ctx = new AudioContext();
          if (ctx.state === 'suspended') {
            await ctx.resume();
          }
          const buffer = ctx.createBuffer(1, 1, 22050);
          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(ctx.destination);
          source.start(0);
        }
      } catch (err) {
        console.warn('Audio unlock failed:', err);
      }
    };

    document.addEventListener('touchstart', unlockAudio, { once: true });
    document.addEventListener('click', unlockAudio, { once: true });

    return () => {
      stopKeepAlive();
      audioRecovery.destroy();
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('click', unlockAudio);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video && showBackgroundVideo) {
      video.muted = audioManager.getMuted();

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => console.log('✓ Background video playing'))
          .catch(err => console.log('Video autoplay:', err));
      }

      const unsubscribe = audioManager.subscribe((muted) => {
        if (video) {
          video.muted = muted;
        }
      });

      return unsubscribe;
    }
  }, [showBackgroundVideo, currentScreen]);

  const handleStart = () => {
    setCurrentScreen('loading');
  };

  const handleLoadingComplete = () => {
    setCurrentScreen('hero-selection');
  };

  const handleSelectHero = (heroId: string) => {
    setSelectedHero(heroId);
    setCurrentScreen('runner-game');
  };

  const handleGameComplete = (score: number) => {
    setGameScore(score);
    setCurrentScreen('portfolio');
  };

  const handleChangeHero = () => {
    setCurrentScreen('hero-selection');
  };

  const handlePlayAgain = () => {
    setCurrentScreen('hero-selection');
  };

  const [mobileBackgroundSpeed, setMobileBackgroundSpeed] = useState(1);
  const [triggerAcceleration, setTriggerAcceleration] = useState(false);
  const [showWoohoo, setShowWoohoo] = useState(false);
  const [showGlitchOverlay, setShowGlitchOverlay] = useState(false);

  const handleMobileStart = () => {
    setMobileScreen('loading');
    audioManager.startBackgroundMusic();
  };

  const handleMobileLoadingComplete = () => {
    setMobileScreen('menu');
  };

  const handleMobileStartGame = async () => {
    try {
      await audioManager.resume?.();
    } catch (err) {
      console.warn('AudioContext resume failed:', err);
    }

    if (!audioManager.getMuted() && !glitchAudioRef.current) {
      try {
        glitchAudioRef.current = new Audio('https://res.cloudinary.com/djihbhmzz/video/upload/v1772317785/%D0%93%D0%BB%D0%B8%D1%87_qxzkdx.mp3');
        glitchAudioRef.current.volume = 0.7;
        glitchAudioRef.current.load();
      } catch (err) {
        console.warn('Failed to preload glitch audio:', err);
      }
    }

    setTriggerAcceleration(true);
    setShowWoohoo(true);
    soundEffects.playWithOverlap('acceleration', 'glitch', 500, () => {
      if (glitchAudioRef.current && !audioManager.getMuted()) {
        glitchAudioRef.current.currentTime = 0;
        glitchAudioRef.current.play().catch(err => console.warn('Failed to play glitch sound:', err));
      }
      setShowGlitchOverlay(true);
      setMobileScreen('glitch');
      setShowWoohoo(false);
      setShowGlitchOverlay(false);
    });
  };

  const handleGlitchComplete = () => {
    setMobileScreen('hero-selection');
  };

  const handleMobileHeroSelect = (heroId: string) => {
    setSelectedHero(heroId);
    setMobileScreen('space-game');
  };

  const handleMobileBackToMenu = () => {
    setTriggerAcceleration(false);
    setMobileBackgroundSpeed(1);
    setMobileScreen('menu');
  };

  const handleMobileBackToHeroSelection = () => {
    setMobileScreen('hero-selection');
  };

  if (isMobile) {
    return (
      <div className="relative w-full h-screen overflow-hidden">
        {(mobileScreen === 'menu' || mobileScreen === 'glitch' || mobileScreen === 'hero-selection' || mobileScreen === 'space-game') && (
          <MobileSpaceBackground
            currentSpeed={mobileBackgroundSpeed}
            onSpeedChange={setMobileBackgroundSpeed}
            triggerAcceleration={triggerAcceleration}
          />
        )}

        <div className="mobile-crt-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999, pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {mobileScreen === 'intro' && (
            <MobileStartScreen key="mobile-intro" onStart={handleMobileStart} />
          )}
          {mobileScreen === 'loading' && (
            <MobileLoadingScreen key="mobile-loading" onComplete={handleMobileLoadingComplete} />
          )}
          {mobileScreen === 'menu' && (
            <MobileMainMenu
              key="mobile-menu"
              onStartGame={handleMobileStartGame}
            />
          )}
          {mobileScreen === 'glitch' && (
            <MobileGlitchTransition
              key="glitch-transition"
              onComplete={handleGlitchComplete}
              playGlitchSound={true}
            />
          )}
          {mobileScreen === 'hero-selection' && (
            <MobileHeroSelector
              key="hero-selection"
              onBack={handleMobileBackToMenu}
              onSelect={handleMobileHeroSelect}
              backgroundSpeed={mobileBackgroundSpeed}
            />
          )}
          {mobileScreen === 'space-game' && (
            <MobileSpaceGame
              key="space-game"
              heroId={selectedHero}
              onBack={handleMobileBackToHeroSelection}
              onChangeHero={handleMobileBackToHeroSelection}
              onMainMenu={handleMobileBackToMenu}
            />
          )}
          {showWoohoo && <WoohooTitle />}
          {showGlitchOverlay && <GlitchOverlay />}
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {showBackgroundVideo && (
        <>
          <div className="fixed top-0 left-0 w-full h-full" style={{ zIndex: 1, backgroundColor: '#000', overflow: 'hidden' }}>
            <motion.video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              initial={{
                opacity: 0,
                scale: 1.1,
                filter: 'blur(10px)'
              }}
              animate={{
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)'
              }}
              exit={{
                opacity: 0,
                scale: 1.1,
                filter: 'blur(10px)'
              }}
              transition={{
                duration: 1.5,
                ease: 'easeOut'
              }}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onLoadedData={() => console.log('✓ Background video loaded with Retro Power-On effect')}
              onError={(e) => console.error('Video error:', e)}
            >
              <source src="https://res.cloudinary.com/djihbhmzz/video/upload/bg_video_sukqhs.mp4" type="video/mp4" />
            </motion.video>
          </div>

          <motion.div
            className="fixed top-0 left-0 w-full h-full bg-black/40 pointer-events-none"
            style={{ zIndex: 2 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </>
      )}

      <div className="crt-overlay" style={{ zIndex: 9999 }} />

      <div style={{ position: 'relative', zIndex: 100 }}>
        <AnimatePresence mode="wait">
          {currentScreen === 'intro' && (
            <IntroScreen key="intro" onStart={handleStart} />
          )}
          {currentScreen === 'loading' && (
            <LoadingScreen key="loading" onLoadingComplete={handleLoadingComplete} />
          )}
          {currentScreen === 'hero-selection' && (
            <HeroSelection key="hero-selection" onSelectHero={handleSelectHero} />
          )}
          {currentScreen === 'runner-game' && (
            <RunnerGame key="runner-game" heroId={selectedHero} onGameComplete={handleGameComplete} onChangeHero={handleChangeHero} />
          )}
          {currentScreen === 'portfolio' && (
            <MainPortfolio key="portfolio" heroId={selectedHero} runnerScore={gameScore} onPlayAgain={handlePlayAgain} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
