/**
 * Procedural Greek Lyre (Kithara) & Storybook Audio Engine
 * Zero external audio assets — pure Web Audio API synthesis.
 */

class LyreAudioEngine {
  private ctx: AudioContext | null = null;
  private muted = false;

  private ensureContext(): AudioContext | null {
    if (this.muted) return null;
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  /**
   * Plucks a single ancient Greek kithara string with warm overtones.
   */
  public pluckString(freq: number, delay = 0, duration = 1.4, volume = 0.08): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    overtone.type = 'sine';
    overtone.frequency.setValueAtTime(freq * 2, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2400, now);
    filter.frequency.exponentialRampToValueAtTime(420, now + duration);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    const overGain = ctx.createGain();
    overGain.gain.setValueAtTime(volume * 0.28, now);
    overGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.6);

    osc.connect(filter);
    overtone.connect(overGain);
    overGain.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    overtone.start(now);
    osc.stop(now + duration + 0.05);
    overtone.stop(now + duration + 0.05);
  }

  /**
   * Gentle Dorian-mode lyre arpeggio when starting a chapter or opening the book.
   */
  public playChapterChord(
    mood: 'primordial' | 'othrys' | 'crete' | 'tartarus' | 'battleground' | 'olympus' = 'olympus',
  ): void {
    const scales: Record<typeof mood, number[]> = {
      primordial: [261.63, 293.66, 392.0, 440.0, 523.25],
      othrys: [220.0, 246.94, 293.66, 349.23, 440.0],
      crete: [293.66, 329.63, 392.0, 493.88, 587.33],
      tartarus: [196.0, 233.08, 293.66, 311.13, 392.0],
      battleground: [293.66, 349.23, 440.0, 523.25, 659.25],
      olympus: [293.66, 369.99, 440.0, 554.37, 587.33],
    };
    const notes = scales[mood];
    notes.forEach((f, idx) => {
      this.pluckString(f, idx * 0.085, 1.55, 0.065);
    });
  }

  /**
   * Soft tactile parchment page-turn rustle + quiet chime.
   */
  public playPageTurn(): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const bufferSize = Math.floor(ctx.sampleRate * 0.16);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const env = Math.sin((i / bufferSize) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * env * 0.18;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(1400, now);
    bandpass.Q.setValueAtTime(1.1, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
  }

  /**
   * Choice selection feedback scaled by virtue/tone.
   */
  public playChoice(tone: 'wisdom' | 'valor' | 'compassion' = 'wisdom'): void {
    if (tone === 'wisdom') {
      this.pluckString(440, 0, 0.85, 0.06);
      this.pluckString(587.33, 0.07, 1.0, 0.06);
    } else if (tone === 'valor') {
      this.pluckString(293.66, 0, 0.9, 0.07);
      this.pluckString(440, 0.06, 1.05, 0.07);
    } else {
      this.pluckString(329.63, 0, 0.9, 0.06);
      this.pluckString(493.88, 0.08, 1.1, 0.06);
    }
  }

  /**
   * Radiant triad when earning a Mythological Relic or completing a chapter.
   */
  public playRelicFanfare(): void {
    const chord = [392.0, 493.88, 587.33, 783.99];
    chord.forEach((f, i) => {
      this.pluckString(f, i * 0.09, 1.9, 0.07);
    });
  }
}

export const lyreAudio = new LyreAudioEngine();
