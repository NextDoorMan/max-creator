import { audioEngine } from './webAudioEngine';
import { audioManager } from './audioManager';

class AudioRecovery {
  private isInitialized = false;
  private resumeTimeout: NodeJS.Timeout | null = null;
  private kickInterval: NodeJS.Timeout | null = null;

  init() {
    if (this.isInitialized) return;

    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    window.addEventListener('focus', this.handleWindowFocus);

    this.startAudioKick();

    this.isInitialized = true;
  }

  private startAudioKick() {
    this.kickInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        this.kickAudio();
      }
    }, 30000);
  }

  async kickAudio() {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }

      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      gainNode.gain.value = 0.001;
      oscillator.frequency.value = 20;

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.01);
    } catch (error) {
      console.warn('Audio kick failed:', error);
    }
  }

  private handleVisibilityChange = async () => {
    if (document.visibilityState === 'visible') {
      this.scheduleAudioResume();
    }
  };

  private handleWindowFocus = async () => {
    this.scheduleAudioResume();
  };

  private scheduleAudioResume = () => {
    if (this.resumeTimeout) {
      clearTimeout(this.resumeTimeout);
    }

    this.resumeTimeout = setTimeout(async () => {
      try {
        await audioEngine.resume();
        await this.resumeBackgroundMusic();
      } catch (error) {
        console.warn('Audio resume failed:', error);
      }
    }, 500);
  };

  private async resumeBackgroundMusic() {
    try {
      const backgroundAudio = audioManager.getBackgroundAudio();
      const isPlaying = audioManager.isBackgroundMusicPlaying();

      if (backgroundAudio && backgroundAudio.paused && isPlaying) {
        await backgroundAudio.play();
      }
    } catch (error) {
      console.warn('Background music resume failed:', error);
    }
  }

  destroy() {
    if (!this.isInitialized) return;

    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    window.removeEventListener('focus', this.handleWindowFocus);

    if (this.resumeTimeout) {
      clearTimeout(this.resumeTimeout);
      this.resumeTimeout = null;
    }

    if (this.kickInterval) {
      clearInterval(this.kickInterval);
      this.kickInterval = null;
    }

    this.isInitialized = false;
  }
}

export const audioRecovery = new AudioRecovery();
