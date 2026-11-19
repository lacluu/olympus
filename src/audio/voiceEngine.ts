import type { ZeusVariant } from '../data/characters';
import type { StageCharacterId } from '../three/MythStage';

interface VoiceProfile {
  pitch: number;
  rate: number;
}

const CHARACTER_VOICE_PROFILES: Record<StageCharacterId, VoiceProfile> = {
  zeus: { pitch: 0.94, rate: 0.98 },
  cronus: { pitch: 0.76, rate: 0.9 },
  rhea: { pitch: 1.15, rate: 0.96 },
  gaia: { pitch: 1.12, rate: 0.93 },
  uranus: { pitch: 0.8, rate: 0.91 },
  metis: { pitch: 1.18, rate: 0.98 },
  poseidon: { pitch: 0.88, rate: 0.97 },
  hades: { pitch: 0.78, rate: 0.91 },
  hera: { pitch: 1.16, rate: 0.97 },
  demeter: { pitch: 1.14, rate: 0.95 },
  hestia: { pitch: 1.2, rate: 0.94 },
  brontes: { pitch: 0.72, rate: 0.88 },
  steropes: { pitch: 0.75, rate: 0.9 },
  arges: { pitch: 0.76, rate: 0.89 },
  cottus: { pitch: 0.7, rate: 0.88 },
  briareus: { pitch: 0.72, rate: 0.89 },
  gyges: { pitch: 0.74, rate: 0.88 },
  campe: { pitch: 1.06, rate: 1.04 },
  prometheus: { pitch: 0.92, rate: 0.95 },
  amalthea: { pitch: 1.22, rate: 0.95 },
  curetes: { pitch: 0.9, rate: 1.02 },
};

function sanitizeSpeechText(line: string): string {
  return line.replace(/[«»"“”]/g, '').trim();
}

function pickVietnameseVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const exactVi = voices.find((v) => v.lang.toLowerCase() === 'vi-vn');
  if (exactVi) return exactVi;

  const anyVi = voices.find((v) => v.lang.toLowerCase().startsWith('vi'));
  return anyVi ?? null;
}

class CharacterVoiceEngine {
  private muted = false;
  private fallbackTimer: number | null = null;
  private activeSessionId = 0;

  public setMuted(muted: boolean): void {
    this.muted = muted;
    if (muted) {
      this.stop();
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public stop(): void {
    this.activeSessionId += 1;
    if (this.fallbackTimer !== null) {
      window.clearTimeout(this.fallbackTimer);
      this.fallbackTimer = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore browser speech synthesis cancellation errors
      }
    }
  }

  public speak(params: {
    speakerId: StageCharacterId;
    line: string;
    variant?: ZeusVariant;
    onStart?: (speakerId: StageCharacterId) => void;
    onEnd?: () => void;
  }): void {
    this.stop();
    if (this.muted || typeof window === 'undefined') {
      params.onEnd?.();
      return;
    }

    const cleanLine = sanitizeSpeechText(params.line);
    if (!cleanLine) {
      params.onEnd?.();
      return;
    }

    const sessionId = this.activeSessionId;
    const baseProfile = CHARACTER_VOICE_PROFILES[params.speakerId] ?? {
      pitch: 1.0,
      rate: 0.96,
    };

    let pitch = baseProfile.pitch;
    if (params.speakerId === 'zeus' && params.variant === 'child') {
      pitch = 1.28;
    } else if (params.speakerId === 'zeus' && params.variant === 'young') {
      pitch = 1.02;
    } else if (params.speakerId === 'zeus' && params.variant === 'king') {
      pitch = 0.88;
    }

    const estimatedMs = Math.max(
      2200,
      Math.min(7200, Math.round(cleanLine.length * 68)),
    );

    const finish = () => {
      if (sessionId !== this.activeSessionId) return;
      if (this.fallbackTimer !== null) {
        window.clearTimeout(this.fallbackTimer);
        this.fallbackTimer = null;
      }
      params.onEnd?.();
    };

    params.onStart?.(params.speakerId);

    const hasSpeechApi =
      'speechSynthesis' in window &&
      typeof SpeechSynthesisUtterance !== 'undefined';

    if (!hasSpeechApi) {
      this.fallbackTimer = window.setTimeout(finish, estimatedMs);
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(cleanLine);
      utterance.lang = 'vi-VN';
      utterance.pitch = pitch;
      utterance.rate = baseProfile.rate;
      utterance.volume = 0.92;

      const viVoice = pickVietnameseVoice();
      if (viVoice) {
        utterance.voice = viVoice;
      }

      let endedByApi = false;
      utterance.onend = () => {
        endedByApi = true;
        finish();
      };
      utterance.onerror = () => {
        // If TTS blocked or unavailable, keep visual speaking animation running for a short beat
        if (!endedByApi && this.fallbackTimer === null) {
          this.fallbackTimer = window.setTimeout(finish, Math.min(estimatedMs, 3200));
        }
      };

      // Safety timeout in case a browser stalls without firing onend
      this.fallbackTimer = window.setTimeout(finish, estimatedMs + 2500);
      window.speechSynthesis.speak(utterance);
    } catch {
      this.fallbackTimer = window.setTimeout(finish, estimatedMs);
    }
  }
}

export const voiceEngine = new CharacterVoiceEngine();
