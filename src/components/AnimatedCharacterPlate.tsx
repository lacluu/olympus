import React from 'react';
import type { ProfileCharacterId, ZeusVariant } from '../data/characters';
import type { CharacterExpression } from '../data/myths';
import { DetailedCharacterFigure } from './DetailedMythCharacters';

interface AnimatedCharacterPlateProps {
  character: ProfileCharacterId;
  variant?: ZeusVariant;
  expression?: CharacterExpression;
  mood?: 'calm' | 'dramatic' | 'wise' | 'sorrow';
  size?: 'compact' | 'large';
  className?: string;
}

const PALETTE_BY_CHAR: Record<
  ProfileCharacterId,
  { skyTop: string; skyBottom: string; aura: string; water: string }
> = {
  zeus: {
    skyTop: '#16203a',
    skyBottom: '#394f7d',
    aura: '#facc15',
    water: '#1e2c4a',
  },
  cronus: {
    skyTop: '#160d0d',
    skyBottom: '#4e1919',
    aura: '#d97706',
    water: '#2b1212',
  },
  rhea: {
    skyTop: '#241512',
    skyBottom: '#703628',
    aura: '#f5b041',
    water: '#3b1e18',
  },
  gaia: {
    skyTop: '#11241c',
    skyBottom: '#2d5c42',
    aura: '#34d399',
    water: '#1d402f',
  },
  uranus: {
    skyTop: '#0a1229',
    skyBottom: '#2b2459',
    aura: '#fde047',
    water: '#131d42',
  },
  metis: {
    skyTop: '#0d2226',
    skyBottom: '#1c5a5c',
    aura: '#5eead4',
    water: '#113c40',
  },
  poseidon: {
    skyTop: '#0b2238',
    skyBottom: '#1a5a85',
    aura: '#38bdf8',
    water: '#0e3c5c',
  },
  hades: {
    skyTop: '#090b12',
    skyBottom: '#2b1a4a',
    aura: '#a78bfa',
    water: '#101d2b',
  },
  hera: {
    skyTop: '#181e3a',
    skyBottom: '#3b4a7a',
    aura: '#fbbf24',
    water: '#1f294d',
  },
  demeter: {
    skyTop: '#1b2412',
    skyBottom: '#4d6b23',
    aura: '#facc15',
    water: '#283618',
  },
  hestia: {
    skyTop: '#24120c',
    skyBottom: '#6b2f16',
    aura: '#fb923c',
    water: '#3a1a0e',
  },
  brontes: {
    skyTop: '#1a110b',
    skyBottom: '#5e2912',
    aura: '#f59e0b',
    water: '#2b160c',
  },
  steropes: {
    skyTop: '#0f172a',
    skyBottom: '#1e3a5f',
    aura: '#7dd3fc',
    water: '#13243b',
  },
  arges: {
    skyTop: '#24110b',
    skyBottom: '#7c2d12',
    aura: '#fde047',
    water: '#3d190b',
  },
  cottus: {
    skyTop: '#171514',
    skyBottom: '#443c35',
    aura: '#f59e0b',
    water: '#26211e',
  },
  briareus: {
    skyTop: '#0f172a',
    skyBottom: '#334155',
    aura: '#7dd3fc',
    water: '#1e293b',
  },
  gyges: {
    skyTop: '#1f1010',
    skyBottom: '#5c261c',
    aura: '#ef4444',
    water: '#2e1512',
  },
  campe: {
    skyTop: '#14091f',
    skyBottom: '#331545',
    aura: '#22c55e',
    water: '#1c0e29',
  },
  prometheus: {
    skyTop: '#1c1816',
    skyBottom: '#574231',
    aura: '#fb923c',
    water: '#2e241c',
  },
  amalthea: {
    skyTop: '#142a22',
    skyBottom: '#3d7053',
    aura: '#fde68a',
    water: '#1e4234',
  },
  curetes: {
    skyTop: '#24140e',
    skyBottom: '#6b321d',
    aura: '#eab308',
    water: '#381b10',
  },
};

export const AnimatedCharacterPlate: React.FC<AnimatedCharacterPlateProps> = ({
  character,
  variant = 'warrior',
  expression = 'serene',
  mood = 'calm',
  size = 'compact',
  className = '',
}) => {
  const pal = PALETTE_BY_CHAR[character];
  const heightClass = size === 'large' ? 'h-64 w-52' : 'h-36 w-28';
  const figureScale =
    character === 'amalthea'
      ? 1.9
      : character === 'zeus' && variant === 'child'
        ? 2.2
        : character === 'cottus' || character === 'briareus' || character === 'gyges'
          ? 1.56
          : 1.72;
  const figureY = character === 'zeus' && variant === 'child' ? 228 : 262;

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-[#b08a4f]/45 bg-[#1a1511] shadow-sm shrink-0 ${heightClass} ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 220 280"
        className="h-full w-full block"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`bg-${character}-${size}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={pal.skyTop} />
            <stop offset="100%" stopColor={pal.skyBottom} />
          </linearGradient>
          <radialGradient id={`aura-${character}-${size}`} cx="50%" cy="46%" r="48%">
            <stop offset="0%" stopColor={pal.aura} stopOpacity="0.52" />
            <stop offset="65%" stopColor={pal.aura} stopOpacity="0.12" />
            <stop offset="100%" stopColor={pal.aura} stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="220" height="280" fill={`url(#bg-${character}-${size})`} />

        {/* Subtle drifting clouds */}
        <g className="anim-cloud" opacity="0.24">
          <ellipse cx="58" cy="56" rx="44" ry="13" fill="#f5efe4" />
          <ellipse cx="82" cy="50" rx="28" ry="11" fill="#f5efe4" />
        </g>
        <g className="anim-cloud-slow" opacity="0.18">
          <ellipse cx="164" cy="78" rx="46" ry="12" fill="#f5efe4" />
          <ellipse cx="142" cy="72" rx="24" ry="9" fill="#f5efe4" />
        </g>

        {/* Classical pillar silhouette */}
        <g opacity="0.18" fill="#f5efe4">
          <rect x="22" y="102" width="12" height="145" />
          <rect x="186" y="102" width="12" height="145" />
          <rect x="14" y="96" width="192" height="8" rx="2" />
        </g>

        {/* Divine aura */}
        <circle
          cx="110"
          cy="132"
          r={mood === 'dramatic' ? 88 : 76}
          fill={`url(#aura-${character}-${size})`}
          className="anim-aura"
        />

        {/* Rippling water / horizon base */}
        <g className="anim-water">
          <path
            d="M-15 246 Q 28 238 72 246 T 160 246 T 240 246 L 240 285 L -15 285 Z"
            fill={pal.water}
            opacity="0.86"
          />
          <path
            d="M-10 256 Q 40 250 90 256 T 190 256 T 235 256"
            fill="none"
            stroke="#f5efe4"
            strokeOpacity="0.22"
            strokeWidth="1.5"
          />
        </g>

        {/* Detailed Character Illustration */}
        <g transform={`translate(110, ${figureY}) scale(${figureScale})`}>
          <g className="anim-breathe">
            <ellipse cx="0" cy="3" rx="26" ry="4.5" fill="#0d0a07" opacity="0.45" />
            <DetailedCharacterFigure
              id={character}
              variant={variant}
              expression={expression}
            />
          </g>
        </g>

        {/* Ambient floating sparks */}
        <circle cx="44" cy="92" r="2.2" fill={pal.aura} className="anim-drift" />
        <circle cx="176" cy="64" r="1.8" fill="#fef08a" className="anim-drift" />
      </svg>

      <div className="pointer-events-none absolute inset-1 rounded border border-[#f5efe4]/15" />
    </div>
  );
};
