import React from 'react';
import type {
  ActorMotion,
  ChapterAtmosphere,
  CharacterExpression,
  EnvironmentAssetId,
  SceneActor,
  SceneBackdrop,
  SceneInteraction,
} from '../data/myths';
import { CHARACTER_PROFILES } from '../data/characters';
import type { StageCharacterId } from '../three/MythStage';
import { DetailedCharacterFigure } from './DetailedMythCharacters';

interface AnimatedStorySceneProps {
  atmosphere: ChapterAtmosphere;
  backdrop: SceneBackdrop;
  environmentAssets?: EnvironmentAssetId[];
  actors: SceneActor[];
  interaction: SceneInteraction;
  mood: 'calm' | 'dramatic' | 'wise' | 'sorrow';
  activeSpeakerId?: StageCharacterId | null;
  actionCue?: string;
}

const EXPRESSION_LABELS: Record<CharacterExpression, string> = {
  serene: 'Hiền hòa',
  fierce: 'Quyết liệt',
  sorrow: 'Đau thương',
  wise: 'Suy tư',
  fear: 'Kinh hoàng',
  triumph: 'Hân hoan',
};

function getMotionClass(motion: ActorMotion): string {
  switch (motion) {
    case 'pace':
      return 'anim-move-pace';
    case 'advance':
    case 'offer':
      return 'anim-move-advance';
    case 'lunge':
      return 'anim-move-lunge';
    case 'recoil':
      return 'anim-move-recoil';
    case 'rally':
    case 'hover':
      return 'anim-move-rally';
    default:
      return 'anim-breathe';
  }
}

function computeActorPlacement(
  actor: SceneActor,
  total: number,
  index: number,
): { x: number; y: number; scale: number; flip: number } {
  if (total === 1) {
    return { x: 230, y: 198, scale: 1.06, flip: 1 };
  }
  if (total === 2) {
    const isRight = actor.role === 'right' || (actor.role !== 'left' && index === 1);
    return {
      x: isRight ? 314 : 146,
      y: 198,
      scale: 1,
      flip: isRight ? -1 : 1,
    };
  }

  // Multi-actor formation (3, 4, or 5 actors)
  const slotCoords: Record<SceneActor['role'], { x: number; y: number; scale: number; flip: number }> = {
    left: { x: 102, y: 201, scale: 0.94, flip: 1 },
    'back-left': { x: 168, y: 191, scale: 0.84, flip: 1 },
    center: { x: 232, y: 199, scale: 0.96, flip: 1 },
    'back-right': { x: 296, y: 191, scale: 0.84, flip: -1 },
    right: { x: 362, y: 201, scale: 0.94, flip: -1 },
  };
  return slotCoords[actor.role] ?? { x: 110 + index * 78, y: 198, scale: 0.9, flip: index >= total / 2 ? -1 : 1 };
}

const SceneActorFigure: React.FC<{
  actor: SceneActor;
  total: number;
  index: number;
  isSpeaking: boolean;
}> = ({ actor, total, index, isSpeaking }) => {
  const { id, expression, motion, variant } = actor;
  const { x, y, scale, flip } = computeActorPlacement(actor, total, index);
  const moveClass = getMotionClass(motion);
  const activeScale = isSpeaking ? scale * 1.05 : scale;

  return (
    <g transform={`translate(${x}, ${y}) scale(${flip * activeScale}, ${activeScale})`}>
      <g className={moveClass}>
        <g className="anim-breathe">
          <ellipse
            cx="0"
            cy="4"
            rx="26"
            ry="5"
            fill={isSpeaking ? '#fbbf24' : '#0d0a07'}
            opacity={isSpeaking ? 0.55 : 0.45}
          />
          <DetailedCharacterFigure
            id={id}
            expression={expression}
            variant={variant}
            isSpeaking={isSpeaking}
          />
        </g>
      </g>
    </g>
  );
};

const SceneEnvironmentalAssets: React.FC<{ backdrop: SceneBackdrop; accent: string }> = ({
  backdrop,
  accent,
}) => {
  switch (backdrop) {
    case 'cosmos_origin':
      return (
        <g>
          <g fill="#fde68a" opacity="0.82">
            <circle cx="52" cy="30" r="1.6" />
            <circle cx="132" cy="20" r="2.1" />
            <circle cx="230" cy="36" r="1.5" />
            <circle cx="320" cy="22" r="2" />
            <circle cx="408" cy="38" r="1.6" />
          </g>
          <circle cx="230" cy="76" r="56" fill="none" stroke="#34d399" strokeOpacity="0.24" strokeDasharray="5 4" />
        </g>
      );

    case 'sickle_sky_rift':
      return (
        <g>
          {/* Red-violet sky tear + glowing anvil behind Gaia */}
          <path d="M210 0 L240 48 L224 98 L252 150" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeOpacity="0.65" className="anim-lightning-flash" />
          <path d="M72 174 L106 174 L100 186 L78 186 Z" fill="#57534e" />
        </g>
      );

    case 'othrys_prophecy':
      return (
        <g>
          {/* Dark Othrys Throne + Glowing Hourglass of Prophecy */}
          <path d="M196 186 L204 114 L256 114 L264 186 Z" fill="#291d1d" opacity="0.72" />
          <g className="anim-float" opacity="0.65">
            <polygon points="218,52 242,52 230,72" fill="#f59e0b" />
            <polygon points="218,92 242,92 230,72" fill="#f59e0b" />
          </g>
        </g>
      );

    case 'othrys_banquet_dark':
      return (
        <g>
          {/* Smoking Bronze Braziers */}
          {[78, 382].map((bx) => (
            <g key={bx}>
              <rect x={bx - 8} y="156" width="16" height="30" fill="#45271d" />
              <path
                d={`M${bx} 126 C${bx + 10} 140 ${bx + 8} 152 ${bx} 156 C${bx - 8} 152 ${bx - 10} 140 ${bx} 126 Z`}
                fill="#ef4444"
                className="anim-flame"
                style={{ transformOrigin: `${bx}px 156px` }}
              />
            </g>
          ))}
        </g>
      );

    case 'crete_night_escape':
      return (
        <g>
          {/* Crescent Moon + Pine Silhouettes */}
          <path d="M368 32 A18 18 0 1 0 384 58 A14 14 0 1 1 368 32 Z" fill="#fef08a" opacity="0.88" />
          <g fill="#14332a" opacity="0.65">
            <polygon points="48,186 64,126 80,186" />
            <polygon points="392,186 410,122 428,186" />
          </g>
        </g>
      );

    case 'crete_sacred_cave':
      return (
        <g>
          {/* Cave stone arch + Warm campfire + Curetes bronze shields */}
          <path d="M0 0 L460 0 L460 95 Q230 22 0 95 Z" fill="#1b1917" opacity="0.72" />
          <circle cx="88" cy="156" r="14" fill="#d97706" stroke="#fde68a" strokeWidth="2" opacity="0.75" />
          <circle cx="372" cy="156" r="14" fill="#d97706" stroke="#fde68a" strokeWidth="2" opacity="0.75" />
          <g className="anim-flame" style={{ transformOrigin: '146px 186px' }}>
            <path d="M146 164 C153 174 152 184 146 186 C140 184 139 174 146 164 Z" fill="#fb923c" />
          </g>
        </g>
      );

    case 'crete_storm_cliff':
      return (
        <g>
          {/* Gathering Storm Clouds & Electric Arcs around solo Zeus */}
          <polygon points="150,24 140,62 154,62 144,96" fill="none" stroke="#fde047" strokeWidth="2.5" className="anim-lightning-flash" />
          <polygon points="310,28 322,64 308,64 318,98" fill="none" stroke="#fde047" strokeWidth="2.5" className="anim-lightning-flash" />
        </g>
      );

    case 'ocean_shore_elixir':
      return (
        <g>
          {/* Marble Alchemy Pedestal between Metis & Zeus */}
          <rect x="218" y="152" width="24" height="34" fill="#e5dec9" />
          <path d="M222 138 L238 138 L235 152 L225 152 Z" fill="#eab308" />
          <circle cx="230" cy="130" r="5" fill="#5eead4" className="anim-float" />
        </g>
      );

    case 'othrys_liberation':
      return (
        <g>
          {/* Fracturing Columns & Omphalos Stone */}
          <ellipse cx="305" cy="182" rx="14" ry="8" fill="#efe6d5" stroke="#d4a040" strokeWidth="1.5" />
          <circle cx="230" cy="88" r="48" fill="#fde047" opacity="0.16" className="anim-aura" />
        </g>
      );

    case 'twin_mountains':
      return (
        <g>
          {/* Left: Sunlit Marble Olympus; Right: Dark Jagged Othrys */}
          <polygon points="12,188 86,62 162,188" fill="#cbd5e1" opacity="0.34" />
          <polygon points="298,188 378,56 452,188" fill="#291515" opacity="0.72" />
        </g>
      );

    case 'thessaly_war_valley':
      return (
        <g>
          {/* War-torn valley embers + broken spears */}
          <line x1="196" y1="186" x2="212" y2="152" stroke="#b08a4f" strokeWidth="2.5" />
          <line x1="264" y1="186" x2="246" y2="154" stroke="#b08a4f" strokeWidth="2.5" />
          <circle cx="190" cy="112" r="3" fill="#f97316" className="anim-drift" />
          <circle cx="275" cy="96" r="3.5" fill="#facc15" className="anim-drift" />
        </g>
      );

    case 'olympus_gaia_oracle':
      return (
        <g>
          {/* Glowing emerald earth roots & prophecy runes */}
          <path d="M90 188 Q125 148 164 188" fill="none" stroke="#34d399" strokeWidth="2.5" strokeOpacity="0.65" />
          <circle cx="146" cy="110" r="32" fill="#10b981" opacity="0.16" className="anim-aura" />
        </g>
      );

    case 'tartarus_descent':
      return (
        <g>
          {/* Jagged stalactites + descending shadow steps */}
          <polygon points="62,0 78,44 94,0" fill="#111827" />
          <polygon points="364,0 382,52 402,0" fill="#111827" />
          <circle cx="180" cy="134" r="3.5" fill="#38bdf8" className="anim-float" />
          <circle cx="285" cy="118" r="3" fill="#38bdf8" className="anim-float" />
        </g>
      );

    case 'tartarus_gate_campe':
      return (
        <g>
          {/* Huge Iron Prison Gate + Hanging Chains */}
          <rect x="202" y="54" width="12" height="132" fill="#334155" />
          <rect x="246" y="54" width="12" height="132" fill="#334155" />
          <rect x="194" y="48" width="72" height="10" fill="#475569" />
          <g stroke="#64748b" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.65">
            <line x1="78" y1="0" x2="78" y2="112" />
            <line x1="382" y1="0" x2="382" y2="118" />
          </g>
        </g>
      );

    case 'tartarus_lightning':
      return (
        <g>
          <polygon points="228,14 214,68 232,68 218,118 250,58 232,58" fill="#fde047" className="anim-lightning-flash" />
          <circle cx="348" cy="148" r="14" fill="#22c55e" opacity="0.28" className="anim-aura" />
        </g>
      );

    case 'tartarus_freedom':
      return (
        <g>
          {/* Golden beam pouring into Tartarus + broken chains on floor */}
          <polygon points="180,0 280,0 320,192 140,192" fill="#fde68a" opacity="0.16" />
          <path d="M180 188 L208 184 M254 185 L284 188" stroke="#94a3b8" strokeWidth="3" strokeDasharray="5 3" />
        </g>
      );

    case 'cyclopes_forge':
      return (
        <g>
          {/* Subterranean Forge Anvil & Magma Glow */}
          <ellipse cx="145" cy="184" rx="44" ry="8" fill="#ea580c" opacity="0.55" className="anim-aura" />
          <polygon points="168,186 176,162 204,162 212,186" fill="#44403c" />
          <rect x="164" y="156" width="52" height="8" rx="2" fill="#78716c" />
        </g>
      );

    case 'othrys_siege':
      return (
        <g>
          {/* Othrys battlements + Tidal Wave Crest */}
          <rect x="332" y="88" width="96" height="98" fill="#291a1a" opacity="0.7" />
          <path d="M32 178 Q88 124 148 164" fill="none" stroke="#38bdf8" strokeWidth="5" strokeOpacity="0.6" className="anim-water" />
        </g>
      );

    case 'boulder_storm':
      return (
        <g>
          {/* Falling Meteoric Boulders across the sky */}
          {[
            { cx: 140, cy: 52, r: 9 },
            { cx: 224, cy: 38, r: 12 },
            { cx: 292, cy: 62, r: 10 },
          ].map((b, i) => (
            <circle
              key={i}
              cx={b.cx}
              cy={b.cy}
              r={b.r}
              fill="#57534e"
              stroke="#292524"
              strokeWidth="1.5"
              className="anim-boulder-fall"
            />
          ))}
        </g>
      );

    case 'lightning_zenith':
      return (
        <g>
          <polygon points="186,0 172,56 188,56 174,108 206,46 190,46" fill="#fde047" className="anim-lightning-flash" />
          <polygon points="282,12 268,64 286,64 274,114 304,54 288,54" fill="#fef08a" className="anim-lightning-flash" />
        </g>
      );

    case 'cronus_abyss_fall':
      return (
        <g>
          {/* Shattered Throne & Abyssal Pit Pit + Golden Chains */}
          <ellipse cx="355" cy="188" rx="48" ry="8" fill="#090d16" />
          <path d="M312 146 L396 164 M316 168 L392 144" stroke="#d97706" strokeWidth="3" strokeDasharray="6 4" />
        </g>
      );

    case 'olympus_dawn_throne':
      return (
        <g>
          {/* Golden Parthenon Pediment & Three Sacred Emblems */}
          <polygon points="130,52 230,18 330,52" fill="#f5efe4" opacity="0.28" />
          <g className="anim-float" opacity="0.85">
            {/* Lightning / Trident / Bident emblems */}
            <polygon points="230,32 224,46 232,46 226,60 238,42 231,42" fill="#fde047" />
            <path d="M168 42 L168 56 M162 42 L162 50 L174 50 L174 42" fill="none" stroke="#38bdf8" strokeWidth="2" />
            <path d="M286 42 L286 50 L296 50 L296 42 M291 50 L291 58" fill="none" stroke="#cbd5e1" strokeWidth="2" />
          </g>
        </g>
      );

    default:
      return <circle cx="230" cy="80" r="10" fill={accent} opacity="0.2" />;
  }
};

export const AnimatedStoryScene: React.FC<AnimatedStorySceneProps> = ({
  atmosphere,
  backdrop,
  environmentAssets,
  actors,
  interaction,
  mood,
  activeSpeakerId = null,
  actionCue,
}) => {
  const skyColors: Record<
    ChapterAtmosphere,
    { top: string; bottom: string; water: string; accent: string }
  > = {
    primordial: {
      top: '#0b122b',
      bottom: '#244b3c',
      water: '#12292d',
      accent: '#34d399',
    },
    othrys: {
      top: '#170d0c',
      bottom: '#5e211c',
      water: '#2b1615',
      accent: '#f59e0b',
    },
    crete: {
      top: '#163852',
      bottom: '#4f8266',
      water: '#184b61',
      accent: '#fde047',
    },
    tartarus: {
      top: '#080b12',
      bottom: '#1f1633',
      water: '#111d29',
      accent: '#22c55e',
    },
    battleground: {
      top: '#1a1118',
      bottom: '#733018',
      water: '#2d1c16',
      accent: '#facc15',
    },
    olympus: {
      top: '#19294d',
      bottom: '#8a5a32',
      water: '#223e5e',
      accent: '#fde047',
    },
  };

  const pal = skyColors[atmosphere];
  const hasMultiple = actors.length > 1;
  const assetSet = new Set<EnvironmentAssetId>(environmentAssets ?? []);
  const hasAssetList = assetSet.size > 0;

  const isStormCloud = assetSet.has('storm-clouds');
  const showClouds = hasAssetList ? isStormCloud || assetSet.has('sky-clouds') : true;
  const showOlympusPillar = assetSet.has('olympus-pillar');
  const showOthrysPillar = assetSet.has('othrys-pillar');
  const showColumns = hasAssetList
    ? showOlympusPillar || showOthrysPillar
    : atmosphere === 'olympus' || atmosphere === 'othrys';
  const showRocks = hasAssetList
    ? assetSet.has('primordial-rock') || assetSet.has('tartarus-rock') || assetSet.has('crete-cave-wall')
    : atmosphere !== 'olympus' && atmosphere !== 'othrys';
  const showWater = hasAssetList ? assetSet.has('oceanus-water') : true;
  const showOliveTree = hasAssetList ? assetSet.has('olive-tree') : false;
  const showBrazier = hasAssetList ? assetSet.has('sacred-brazier') : false;

  // Render back-row characters first so foreground actors overlap naturally
  const sortedActors = [...actors].sort((a, b) => {
    const aBack = a.role === 'back-left' || a.role === 'back-right' ? 0 : 1;
    const bBack = b.role === 'back-left' || b.role === 'back-right' ? 0 : 1;
    return aBack - bBack;
  });

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg border border-[#b08a4f]/45 bg-[#16120e] shadow-inner"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 460 225"
        className="block w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`scene-sky-${backdrop}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={pal.top} />
            <stop offset="100%" stopColor={pal.bottom} />
          </linearGradient>
          <radialGradient id={`scene-glow-${backdrop}`} cx="50%" cy="54%" r="48%">
            <stop offset="0%" stopColor={pal.accent} stopOpacity={mood === 'dramatic' ? '0.42' : '0.24'} />
            <stop offset="100%" stopColor={pal.accent} stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="460" height="225" fill={`url(#scene-sky-${backdrop})`} />

        {/* Celestial Sun / Storm Moon */}
        <circle
          cx={atmosphere === 'tartarus' ? 375 : 350}
          cy="52"
          r={atmosphere === 'olympus' ? 28 : 22}
          fill={atmosphere === 'tartarus' ? '#5eead4' : '#fde68a'}
          opacity={atmosphere === 'tartarus' ? 0.2 : 0.72}
          className="anim-aura"
        />

        {/* Drifting clouds */}
        {showClouds && (
          <>
            <g className="anim-cloud" opacity={isStormCloud ? 0.34 : 0.24} fill={isStormCloud ? '#94a3b8' : '#f8f2e4'}>
              <ellipse cx="95" cy="48" rx="54" ry="14" />
              <ellipse cx="128" cy="42" rx="34" ry="12" />
            </g>
            <g className="anim-cloud-slow" opacity={isStormCloud ? 0.28 : 0.2} fill={isStormCloud ? '#94a3b8' : '#f8f2e4'}>
              <ellipse cx="325" cy="64" rx="58" ry="14" />
              <ellipse cx="290" cy="58" rx="32" ry="10" />
            </g>
          </>
        )}

        {/* Mountain / Rock Silhouettes */}
        {showRocks && (
          <g opacity="0.3" fill={assetSet.has('tartarus-rock') ? '#090b12' : '#0f172a'}>
            <polygon points="0,190 78,86 160,190" />
            <polygon points="310,190 392,78 460,190" />
          </g>
        )}

        {/* Classical Temple Columns */}
        {showColumns && (
          <g opacity="0.24" fill={showOthrysPillar && !showOlympusPillar ? '#291c1a' : '#f5efe4'}>
            <rect x="34" y="64" width="14" height="126" />
            <rect x="86" y="64" width="14" height="126" />
            <rect x="360" y="64" width="14" height="126" />
            <rect x="412" y="64" width="14" height="126" />
            <rect x="24" y="54" width="88" height="10" rx="2" />
            <rect x="348" y="54" width="88" height="10" rx="2" />
          </g>
        )}

        {/* Olive Tree Silhouette */}
        {showOliveTree && (
          <g opacity="0.55">
            <path d="M402 186 Q398 158 405 138" stroke="#4b3b2c" strokeWidth="6" fill="none" strokeLinecap="round" />
            <ellipse cx="404" cy="128" rx="22" ry="14" fill="#6c845d" />
            <ellipse cx="390" cy="136" rx="14" ry="10" fill="#5b734d" />
          </g>
        )}

        {/* Sacred Bronze Brazier Flame */}
        {showBrazier && (
          <g>
            <rect x="52" y="166" width="10" height="22" fill="#7c5628" />
            <path
              d="M57 148 C63 156 62 165 57 166 C52 165 51 156 57 148 Z"
              fill="#fb923c"
              className="anim-flame"
              style={{ transformOrigin: '57px 166px' }}
            />
          </g>
        )}

        {/* Per-Scene Bespoke Environmental Assets */}
        <SceneEnvironmentalAssets backdrop={backdrop} accent={pal.accent} />

        {/* Flowing Horizon Water / Mist */}
        {showWater ? (
          <g className="anim-water">
            <path
              d="M-20 184 Q 55 174 130 184 T 280 184 T 480 184 L 480 230 L -20 230 Z"
              fill={pal.water}
            />
            <path
              d="M-10 198 Q 65 190 140 198 T 300 198 T 470 198"
              fill="none"
              stroke="#f5efe4"
              strokeOpacity="0.22"
              strokeWidth="1.6"
            />
          </g>
        ) : (
          <rect x="-20" y="184" width="500" height="46" fill={atmosphere === 'tartarus' ? '#11131c' : '#2b241f'} />
        )}

        {/* Stone Sanctuary Terrace */}
        <rect
          x="50"
          y="192"
          width="360"
          height="14"
          rx="3"
          fill={atmosphere === 'tartarus' || atmosphere === 'othrys' ? '#44403c' : '#dcd2bf'}
        />
        <rect
          x="70"
          y="186"
          width="320"
          height="7"
          rx="2"
          fill={atmosphere === 'tartarus' || atmosphere === 'othrys' ? '#57534e' : '#eee6d7'}
        />

        <ellipse cx="230" cy="145" rx="140" ry="70" fill={`url(#scene-glow-${backdrop})`} />

        {/* Interactive energy / offering / combat arc between characters */}
        {hasMultiple && interaction === 'gift' && (
          <g className="anim-gift-arc" style={{ transformOrigin: '230px 136px' }}>
            <circle cx="230" cy="136" r="7" fill="#fde047" opacity="0.9" />
            <circle cx="230" cy="136" r="12" fill={pal.accent} opacity="0.3" />
          </g>
        )}
        {hasMultiple && (interaction === 'battle' || interaction === 'confront') && (
          <g className="anim-lightning-flash">
            <polygon points="230,108 220,134 234,134 222,158 244,128 232,128" fill="#fde047" />
          </g>
        )}
        {hasMultiple && (interaction === 'converse' || interaction === 'nurture' || interaction === 'triumph') && (
          <g className="anim-drift">
            <circle cx="212" cy="126" r="2.8" fill={pal.accent} />
            <circle cx="230" cy="116" r="3.4" fill="#fef08a" />
            <circle cx="248" cy="128" r="2.4" fill={pal.accent} />
          </g>
        )}

        {/* All Actors in Scene (1, 2, 3, 4, or 5 characters simultaneously) */}
        {sortedActors.map((actor) => {
          const origIdx = actors.indexOf(actor);
          return (
            <SceneActorFigure
              key={`${actor.id}-${origIdx}`}
              actor={actor}
              total={actors.length}
              index={origIdx}
              isSpeaking={activeSpeakerId === actor.id}
            />
          );
        })}
      </svg>

      {/* Subtle corner expression & action tag strip */}
      <div className="pointer-events-none flex flex-col gap-0.5 border-t border-[#b08a4f]/25 bg-[#191410]/92 px-3 py-1.5 text-[11px] text-[#d6c8b2]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span>
            Hiện diện: <strong className="text-[#f3ead8]">{actors.length} nhân vật</strong>
          </span>
          <span className="truncate text-[#e0b863]">
            {actors
              .map((a) => {
                const label =
                  CHARACTER_PROFILES.find((p) => p.id === a.id)?.name ?? a.id;
                const speakingMark = activeSpeakerId === a.id ? ' · Đang nói' : '';
                return `${label} (${EXPRESSION_LABELS[a.expression]}${speakingMark})`;
              })
              .join(' · ')}
          </span>
        </div>
        {actionCue && (
          <p className="truncate text-[10.5px] italic text-[#bfb199]">
            Hành động cảnh: {actionCue}
          </p>
        )}
      </div>
    </div>
  );
};
