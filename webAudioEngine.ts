class WebAudioEngine {
  private context: AudioContext | null = null;
  private buffers: Map<string, AudioBuffer> = new Map();
  private masterGain: GainNode | null = null;
  private initialized = false;
  private isMuted = false;

  async init() {
    if (this.initialized) return;

    try {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.context.createGain();
      this.masterGain.connect(this.context.destination);
      this.initialized = true;
    } catch (error) {
      console.error('WebAudio initialization failed:', error);
    }
  }

  async resume() {
    if (this.context && this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  getMuted(): boolean {
    return this.isMuted;
  }

  async loadSound(key: string, url: string): Promise<void> {
    if (!this.context) {
      await this.init();
    }

    if (!this.context) return;

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      this.buffers.set(key, audioBuffer);
    } catch (error) {
      console.error(`Failed to load sound: ${key}`, error);
    }
  }

  play(key: string, volume: number = 1.0) {
    if (!this.context || !this.masterGain) return;
    if (this.isMuted) return;

    const buffer = this.buffers.get(key);
    if (!buffer) return;

    const source = this.context.createBufferSource();
    source.buffer = buffer;

    const gainNode = this.context.createGain();
    gainNode.gain.value = volume;

    source.connect(gainNode);
    gainNode.connect(this.masterGain);

    source.start(0);
  }

  isLoaded(key: string): boolean {
    return this.buffers.has(key);
  }

  warmUp(key: string) {
    if (!this.context || !this.masterGain) return;

    const buffer = this.buffers.get(key);
    if (!buffer) return;

    const source = this.context.createBufferSource();
    source.buffer = buffer;

    const gainNode = this.context.createGain();
    gainNode.gain.value = 0.01;

    source.connect(gainNode);
    gainNode.connect(this.masterGain);

    source.start(0);
    source.stop(0.01);
  }
}

export const audioEngine = new WebAudioEngine();
