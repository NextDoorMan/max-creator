import { assetCache } from './persistentAssetCache';

class AudioManager {
  private static instance: AudioManager;
  private isMuted: boolean = false;
  private isMusicMuted: boolean = false;
  private backgroundAudio: HTMLAudioElement | null = null;
  private isBackgroundPlaying: boolean = false;
  private themeAudio: HTMLAudioElement | null = null;
  private listeners: Set<(muted: boolean) => void> = new Set();
  private playlist: string[] = [
    'https://res.cloudinary.com/djihbhmzz/video/upload/v1771360409/main_background_qck2gt.mp3',
    'https://res.cloudinary.com/djihbhmzz/video/upload/v1771360409/main_background_2_dk0hen.mp3',
    'https://res.cloudinary.com/djihbhmzz/video/upload/v1771360409/main_background_3_bcvpkx.mp3'
  ];
  private mobilePlaylist: string[] = [
    'https://res.cloudinary.com/djihbhmzz/video/upload/v1772486795/Starfield_Credit_Run_1_arnd5f.mp3',
    'https://res.cloudinary.com/djihbhmzz/video/upload/v1772390525/Solar_Rings_Over_Neo-Orbit_jjqw72.mp3',
    'https://res.cloudinary.com/djihbhmzz/video/upload/v1772390523/Starship_Pixel_Run_ew8wo2.mp3',
    'https://res.cloudinary.com/djihbhmzz/video/upload/v1772390523/Starfield_Checkpoint_aw52q5.mp3'
  ];
  private currentTrackIndex: number = 0;
  private targetVolume: number = 0.4;
  private mobileTargetVolume: number = 0.2;
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private isMobileMode: boolean = false;
  private audioUnlocked: boolean = false;

  private constructor() {
    const saved = localStorage.getItem('audioMuted');
    const savedMusic = localStorage.getItem('musicMuted');
    this.isMuted = saved === 'true';
    this.isMusicMuted = savedMusic === 'true';
    this.isMobileMode = window.innerWidth < 768;
    this.preloadAudioAssets();
    this.setupAudioUnlock();
  }

  private setupAudioUnlock(): void {
    const unlockAudio = async () => {
      if (this.audioUnlocked) return;

      try {
        const tempAudio = new Audio();
        tempAudio.src = 'data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
        tempAudio.volume = 0.01;

        await tempAudio.play();
        this.audioUnlocked = true;
        tempAudio.pause();
        tempAudio.src = '';

        document.removeEventListener('touchstart', unlockAudio);
        document.removeEventListener('touchend', unlockAudio);
        document.removeEventListener('click', unlockAudio);
      } catch (err) {
        console.warn('Audio unlock failed:', err);
      }
    };

    document.addEventListener('touchstart', unlockAudio);
    document.addEventListener('touchend', unlockAudio);
    document.addEventListener('click', unlockAudio);
  }

  private async preloadAudioAssets(): Promise<void> {
    const backgroundTracks = this.isMobileMode ? this.mobilePlaylist : this.playlist;

    const audioUrls = [
      ...backgroundTracks,
      'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%92%D1%8B%D0%B1%D0%BE%D1%80_%D0%B3%D0%B5%D1%80%D0%BE%D1%8F_jval80.mp3',
      'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%B7%D0%B2%D1%83%D0%BA_%D1%84%D0%B0%D0%BA%D1%82%D0%B0_n1qwe2.mp3',
      'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0_oztdlq.mp3',
      'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488771/%D0%9E%D1%82%D1%81%D1%87%D0%B5%D1%82_%D1%80%D0%B0%D0%BD%D0%BD%D0%B5%D1%80%D0%B0_odewjy.mp3',
      'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488774/%D0%BF%D1%80%D1%8B%D0%B6%D0%BE%D0%BA_juaj6a.mp3',
      'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488777/%D0%A0%D0%B5%D0%BF%D0%BB%D0%B8%D0%BA%D0%B0_%D0%B2_%D1%80%D0%B0%D0%BD%D0%BD%D0%B5%D1%80%D0%B5_nymdvj.mp3',
      'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488779/Game_Over_bpawbn.mp3',
      'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%B0%D0%BA%D1%82%D0%B8%D0%B2%D0%B0%D1%86%D0%B8%D1%8F_luobxd.mp3',
      'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/hero_selection_loud_bdty1t.mp3',
      'https://res.cloudinary.com/djihbhmzz/video/upload/v1772317785/%D0%93%D0%BB%D0%B8%D1%87_qxzkdx.mp3',
      'https://res.cloudinary.com/djihbhmzz/video/upload/v1772552283/%D0%B2%D0%B7%D0%BB%D0%B5%D1%82_csrncw.mp3',
      'https://res.cloudinary.com/djihbhmzz/video/upload/v1773077822/space_victory_qc63yw.mp3',
      'https://res.cloudinary.com/djihbhmzz/video/upload/v1772317785/%D0%93%D0%BB%D0%B8%D1%87_qxzkdx.mp3'
      
    ];

    for (const url of audioUrls) {
      try {
        const cachedUrl = await assetCache.cacheAsset(url, 'audio');
        const audio = new Audio(cachedUrl);
        audio.preload = 'auto';
        audio.load();
        this.audioCache.set(url, audio);
      } catch (error) {
        console.warn(`Failed to preload audio: ${url}`, error);
      }
    }
  }

  private async getCachedAudio(url: string): Promise<string> {
    const cached = assetCache.getCachedUrl(url);
    if (cached) return cached;

    return await assetCache.cacheAsset(url, 'audio');
  }

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  subscribe(listener: (muted: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.isMusicMuted));
  }

  toggleMute(): void {
    this.isMusicMuted = !this.isMusicMuted;
    localStorage.setItem('musicMuted', String(this.isMusicMuted));

    if (this.backgroundAudio) {
      this.backgroundAudio.muted = this.isMusicMuted;
    }

    if (this.themeAudio) {
      this.themeAudio.muted = this.isMusicMuted;
    }

    try {
      const { audioEngine } = require('./webAudioEngine');
      if (audioEngine) {
        audioEngine.setMuted(this.isMusicMuted);
      }
    } catch (e) {
      // Ignore if webAudioEngine not available
    }

    this.notifyListeners();
  }

  getMuted(): boolean {
    return this.isMusicMuted;
  }

  async warmUpAudio(path: string): Promise<void> {
    try {
      let audio = this.audioCache.get(path);

      if (!audio) {
        const cachedUrl = await this.getCachedAudio(path);
        audio = new Audio(cachedUrl);
        audio.preload = 'auto';
        this.audioCache.set(path, audio);
      }

      audio.volume = 0.01;
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        await playPromise;
        audio.pause();
        audio.currentTime = 0;
      }
    } catch (err) {
      console.warn(`Failed to warm up audio "${path}":`, err);
    }
  }

  async resume(): Promise<void> {
    try {
      const AudioContext = (window.AudioContext || (window as any).webkitAudioContext);
      if (AudioContext) {
        const ctx = new AudioContext();
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }
      }
    } catch (err) {
      console.warn('AudioContext resume failed:', err);
    }
    return Promise.resolve();
  }

  getBackgroundAudio(): HTMLAudioElement | null {
    return this.backgroundAudio;
  }

  isBackgroundMusicPlaying(): boolean {
    return this.isBackgroundPlaying;
  }

  private async playNextTrack(): Promise<void> {
    if (!this.isBackgroundPlaying) return;

    const activePlaylist = this.isMobileMode ? this.mobilePlaylist : this.playlist;
    this.currentTrackIndex = (this.currentTrackIndex + 1) % activePlaylist.length;

    if (this.backgroundAudio) {
      this.backgroundAudio.pause();
      this.backgroundAudio = null;
    }

    const trackUrl = activePlaylist[this.currentTrackIndex];
    const cachedUrl = await this.getCachedAudio(trackUrl);

    this.backgroundAudio = new Audio(cachedUrl);
    this.backgroundAudio.volume = this.isMobileMode ? this.mobileTargetVolume : this.targetVolume;
    this.backgroundAudio.muted = this.isMusicMuted;

    this.backgroundAudio.addEventListener('ended', () => {
      this.playNextTrack();
    });

    this.backgroundAudio.addEventListener('error', () => {
      console.warn('Track failed to load, retrying in 2 seconds:', trackUrl);
      setTimeout(() => {
        if (this.isBackgroundPlaying) {
          this.playNextTrack();
        }
      }, 2000);
    });

    this.backgroundAudio.play().catch(err => {
      console.warn('Failed to play next track:', err);
      setTimeout(() => {
        if (this.isBackgroundPlaying) {
          this.playNextTrack();
        }
      }, 2000);
    });
  }

  setMobileMode(isMobile: boolean): void {
    this.isMobileMode = isMobile;
  }

  async startBackgroundMusic(): Promise<void> {
    if (this.isBackgroundPlaying) return;

    const activePlaylist = this.isMobileMode ? this.mobilePlaylist : this.playlist;
    this.currentTrackIndex = 0;
    const cachedUrl = await this.getCachedAudio(activePlaylist[0]);

    this.backgroundAudio = new Audio(cachedUrl);
    this.backgroundAudio.volume = 0;
    this.backgroundAudio.muted = this.isMusicMuted;

    this.backgroundAudio.addEventListener('ended', () => {
      this.playNextTrack();
    });

    this.backgroundAudio.addEventListener('error', () => {
      console.warn('Initial track failed to load, retrying in 2 seconds');
      setTimeout(() => {
        if (this.isBackgroundPlaying) {
          this.playNextTrack();
        }
      }, 2000);
    });

    this.backgroundAudio.play().catch(err => {
      console.warn('Failed to play background music:', err);
    });

    const fadeDuration = 1000;
    const fadeSteps = 50;
    const stepDuration = fadeDuration / fadeSteps;
    const finalVolume = this.isMobileMode ? this.mobileTargetVolume : this.targetVolume;
    const volumeIncrement = finalVolume / fadeSteps;
    let currentStep = 0;

    const fadeInterval = setInterval(() => {
      if (!this.backgroundAudio || currentStep >= fadeSteps) {
        clearInterval(fadeInterval);
        if (this.backgroundAudio) {
          this.backgroundAudio.volume = finalVolume;
        }
        return;
      }

      currentStep++;
      this.backgroundAudio.volume = Math.min(volumeIncrement * currentStep, finalVolume);
    }, stepDuration);

    this.isBackgroundPlaying = true;
  }

  stopBackgroundMusic(): void {
    if (this.backgroundAudio) {
      this.backgroundAudio.pause();
      this.backgroundAudio = null;
      this.isBackgroundPlaying = false;
    }
  }

  async playThemeMusic(path: string, volume: number = 1): Promise<void> {
    this.stopThemeMusic();

    const cachedUrl = await this.getCachedAudio(path);

    if (this.isMusicMuted) {
      this.themeAudio = new Audio(cachedUrl);
      this.themeAudio.volume = volume;
      this.themeAudio.muted = true;
      return;
    }

    this.themeAudio = new Audio(cachedUrl);
    this.themeAudio.volume = volume;
    this.themeAudio.currentTime = 0;
    this.themeAudio.muted = this.isMusicMuted;

    this.themeAudio.addEventListener('error', () => {
      console.warn('Theme music failed to load, retrying:', path);
      setTimeout(() => {
        if (this.themeAudio) {
          this.themeAudio.load();
          this.themeAudio.play().catch(err => {
            console.warn('Theme music retry failed:', err);
          });
        }
      }, 1000);
    });

    this.themeAudio.play().catch(err => {
      console.warn('Failed to play theme music:', err);
    });
  }

  stopThemeMusic(): void {
    if (this.themeAudio) {
      this.themeAudio.pause();
      this.themeAudio = null;
    }
  }

  async playSound(path: string, baseVolume: number): Promise<void> {
    if (this.isMusicMuted) return;

    try {
      let audio = this.audioCache.get(path);

      if (!audio) {
        const cachedUrl = await this.getCachedAudio(path);
        audio = new Audio(cachedUrl);
        audio.preload = 'auto';
        this.audioCache.set(path, audio);
      }

      const soundClone = audio.cloneNode() as HTMLAudioElement;
      soundClone.volume = baseVolume;
      soundClone.muted = false;

      await soundClone.play();
    } catch (err) {
      console.warn(`Failed to play sound "${path}":`, err);
    }
  }

  async playSoundWithCallback(path: string, baseVolume: number, onNearEnd?: (timeRemaining: number) => void, triggerBeforeEnd: number = 300): Promise<HTMLAudioElement> {
    const cachedUrl = await this.getCachedAudio(path);
    const audio = new Audio(cachedUrl);
    audio.volume = baseVolume;
    audio.muted = false;

    if (onNearEnd) {
      const checkProgress = () => {
        if (!audio.duration || audio.paused || audio.ended) return;

        const timeRemaining = (audio.duration - audio.currentTime) * 1000;

        if (timeRemaining <= triggerBeforeEnd && timeRemaining > 0) {
          onNearEnd(timeRemaining);
          audio.removeEventListener('timeupdate', checkProgress);
        }
      };

      audio.addEventListener('timeupdate', checkProgress);
    }

    audio.play().catch(err => {
      console.warn(`Failed to play sound "${path}":`, err);
    });

    return audio;
  }
}

export const audioManager = AudioManager.getInstance();

export class SoundEffects {
  private sounds: Map<string, { path: string; volume: number }> = new Map();
  private webAudioEngine: any = null;
  private isMobileMode: boolean = false;

  constructor() {
    this.sounds.set('heroSelection', { path: 'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%92%D1%8B%D0%B1%D0%BE%D1%80_%D0%B3%D0%B5%D1%80%D0%BE%D1%8F_jval80.mp3', volume: 1 });
    this.sounds.set('factBadge', { path: 'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%B7%D0%B2%D1%83%D0%BA_%D1%84%D0%B0%D0%BA%D1%82%D0%B0_n1qwe2.mp3', volume: 0.261 });
    this.sounds.set('button', { path: 'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0_oztdlq.mp3', volume: 0.6 });
    this.sounds.set('countdown', { path: 'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488771/%D0%9E%D1%82%D1%81%D1%87%D0%B5%D1%82_%D1%80%D0%B0%D0%BD%D0%BD%D0%B5%D1%80%D0%B0_odewjy.mp3', volume: 0.197 });
    this.sounds.set('jump', { path: 'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488774/%D0%BF%D1%80%D1%8B%D0%B6%D0%BE%D0%BA_juaj6a.mp3', volume: 0.864 });
    this.sounds.set('dialogue', { path: 'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488777/%D0%A0%D0%B5%D0%BF%D0%BB%D0%B8%D0%BA%D0%B0_%D0%B2_%D1%80%D0%B0%D0%BD%D0%BD%D0%B5%D1%80%D0%B5_nymdvj.mp3', volume: 0.864 });
    this.sounds.set('gameOver', { path: 'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488779/Game_Over_bpawbn.mp3', volume: 0.84 });
    this.sounds.set('mobileMenu', { path: 'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%92%D1%8B%D0%B1%D0%BE%D1%80_%D0%B3%D0%B5%D1%80%D0%BE%D1%8F_jval80.mp3', volume: 1.0 });
    this.sounds.set('coin', { path: 'https://res.cloudinary.com/djihbhmzz/video/upload/v1771488770/%D0%B0%D0%BA%D1%82%D0%B8%D0%B2%D0%B0%D1%86%D0%B8%D1%8F_luobxd.mp3', volume: 0.6 });
    this.sounds.set('glitch', { path: 'https://res.cloudinary.com/djihbhmzz/video/upload/v1772317785/%D0%93%D0%BB%D0%B8%D1%87_qxzkdx.mp3', volume: 0.7 });
    this.sounds.set('acceleration', { path: 'https://res.cloudinary.com/djihbhmzz/video/upload/v1772552283/%D0%B2%D0%B7%D0%BB%D0%B5%D1%82_csrncw.mp3', volume: 0.6 });
    this.sounds.set('victory', { path: 'https://res.cloudinary.com/djihbhmzz/video/upload/v1773077822/space_victory_qc63yw.mp3', volume: 0.8 })

    this.isMobileMode = window.innerWidth < 768;
  }

  setWebAudioEngine(engine: any): void {
    this.webAudioEngine = engine;
  }

  async preloadDesktopSounds(): Promise<void> {
    if (!this.webAudioEngine || this.isMobileMode) return;

    const desktopSounds = ['heroSelection', 'button', 'dialogue', 'factBadge', 'countdown', 'gameOver'];
    for (const soundName of desktopSounds) {
      const soundConfig = this.sounds.get(soundName);
      if (soundConfig) {
        await this.webAudioEngine.loadSound(soundName, soundConfig.path);
      }
    }
  }

  warmUpSounds(soundNames: string[]): void {
    soundNames.forEach(soundName => {
      const soundConfig = this.sounds.get(soundName);
      if (!soundConfig) {
        console.warn(`Sound "${soundName}" not found for warm-up`);
        return;
      }

      if (!this.isMobileMode && this.webAudioEngine && this.webAudioEngine.isLoaded(soundName)) {
        this.webAudioEngine.warmUp(soundName);
      } else {
        audioManager.warmUpAudio(soundConfig.path).catch(err => {
          console.warn(`Failed to warm up sound "${soundName}":`, err);
        });
      }
    });
  }

  play(soundName: string, volumeOverride?: number): void {
    const soundConfig = this.sounds.get(soundName);
    if (!soundConfig) {
      console.warn(`Sound "${soundName}" not found`);
      return;
    }

    const volume = volumeOverride !== undefined ? volumeOverride : soundConfig.volume;

    if (!this.isMobileMode && this.webAudioEngine && this.webAudioEngine.isLoaded(soundName)) {
      this.webAudioEngine.resume();
      this.webAudioEngine.play(soundName, volume);
    } else {
      const audio = audioManager.audioCache.get(soundConfig.path);
      if (audio) {
        audio.currentTime = 0;
        audio.volume = audioManager.getMuted() ? 0 : volume;
        audio.play().catch(err => {
          console.warn(`Failed to play cached sound "${soundName}":`, err);
        });
      } else {
        audioManager.playSound(soundConfig.path, volume).catch(err => {
          console.warn(`Failed to play sound effect "${soundName}":`, err);
        });
      }
    }
  }

  async playWithOverlap(soundName: string, overlapSound: string, overlapMs: number = 300, onGlitchStart?: () => void): Promise<void> {
    const soundConfig = this.sounds.get(soundName);
    const overlapConfig = this.sounds.get(overlapSound);

    if (!soundConfig || !overlapConfig) {
      console.warn(`Sound not found: ${soundName} or ${overlapSound}`);
      return;
    }

    await audioManager.playSoundWithCallback(
      soundConfig.path,
      soundConfig.volume,
      () => {
        audioManager.playSound(overlapConfig.path, overlapConfig.volume);
        if (onGlitchStart) {
          onGlitchStart();
        }
      },
      overlapMs
    );
  }
}

export const soundEffects = new SoundEffects();
