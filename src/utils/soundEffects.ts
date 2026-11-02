/**
 * Synthesizes romantic sounds and ambient melodies using the Web Audio API.
 * 100% self-contained: no external MP3 dependencies, works offline and instantly.
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientTimer: number | null = null;
  private isAmbientPlaying: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isAmbientPlaying) {
      this.stopAmbientMelody();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsAmbientPlaying(): boolean {
    return this.isAmbientPlaying;
  }

  // Play a soft sweet chime note
  public playChime(freq: number, duration: number = 1.2, type: OscillatorType = 'sine', volume: number = 0.15) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio might be blocked before user gesture
    }
  }

  // Celebration fanfare when box is opened or candles blown
  public playCelebrationChime() {
    if (this.isMuted) return;
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4, E4, G4, C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playChime(freq, 1.8, 'sine', 0.18);
      }, idx * 110);
    });
  }

  // Soft sparkle when clicking a memory or heart
  public playSparkle() {
    if (this.isMuted) return;
    const notes = [587.33, 739.99, 880.00, 1174.66];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playChime(freq, 0.6, 'sine', 0.08);
      }, idx * 60);
    });
  }

  // Candle blowing whoosh sound
  public playCandleBlow() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * 0.8;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.8);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 0.8);
    } catch {
      // Audio block fallback
    }
  }

  // Wax seal pop / envelope open
  public playEnvelopePop() {
    this.playChime(320, 0.15, 'triangle', 0.2);
    setTimeout(() => {
      this.playChime(480, 0.3, 'sine', 0.15);
    }, 50);
  }

  // Scratch card scratch sound
  public playScratchSound() {
    if (this.isMuted) return;
    this.playChime(400 + Math.random() * 200, 0.04, 'triangle', 0.04);
  }

  // Gentle music box background arpeggio
  public startAmbientMelody() {
    if (this.isAmbientPlaying || this.isMuted) return;
    this.isAmbientPlaying = true;

    // Romantic music box sequence (notes in Hz: C4, G4, C5, E5, G5, D5, B4, C5)
    const melody = [
      261.63, 392.00, 523.25, 659.25, 523.25, 392.00,
      329.63, 392.00, 523.25, 587.33, 523.25, 392.00,
      293.66, 392.00, 493.88, 587.33, 493.88, 392.00,
      261.63, 329.63, 392.00, 523.25, 659.25, 783.99
    ];

    let step = 0;
    this.ambientTimer = window.setInterval(() => {
      if (this.isMuted || !this.isAmbientPlaying) return;
      const freq = melody[step % melody.length];
      this.playChime(freq, 1.4, 'sine', 0.07);
      step++;
    }, 450);
  }

  public stopAmbientMelody() {
    this.isAmbientPlaying = false;
    if (this.ambientTimer !== null) {
      clearInterval(this.ambientTimer);
      this.ambientTimer = null;
    }
  }

  public toggleAmbientMelody(): boolean {
    if (this.isAmbientPlaying) {
      this.stopAmbientMelody();
      return false;
    } else {
      this.startAmbientMelody();
      return true;
    }
  }
}

export const sounds = new SoundManager();
