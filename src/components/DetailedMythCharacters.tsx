import React, { useContext } from 'react';
import type { ProfileCharacterId, ZeusVariant } from '../data/characters';
import type { CharacterExpression } from '../data/myths';

interface DetailedCharacterProps {
  id: ProfileCharacterId;
  expression?: CharacterExpression;
  variant?: ZeusVariant;
  isSpeaking?: boolean;
}

const SpeakingContext = React.createContext(false);

type BeardStyle = 'none' | 'short_neat' | 'medium_full' | 'long_rough' | 'braided_short';

const SculptedFace: React.FC<{
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;
  skin: string;
  skinShadow: string;
  eyeColor: string;
  browColor: string;
  hairColor: string;
  beard?: BeardStyle;
  expression: CharacterExpression;
  isCyclops?: boolean;
  scar?: boolean;
  wrinkles?: boolean;
}> = ({
  cx = 0,
  cy = -95,
  rx = 11.5,
  ry = 13.5,
  skin,
  skinShadow,
  eyeColor,
  browColor,
  hairColor,
  beard = 'none',
  expression,
  isCyclops = false,
  scar = false,
  wrinkles = false,
}) => {
  const isSpeaking = useContext(SpeakingContext);
  const eyeY = cy - 1.5;
  const mouthY = cy + 6.5;

  return (
    <g>
      {/* Neck & collarbone shadow */}
      <rect x={cx - 4.5} y={cy + ry - 3} width="9" height="10" rx="3" fill={skinShadow} />
      {/* Ears */}
      <ellipse cx={cx - rx + 0.5} cy={eyeY + 1} rx="2" ry="3.5" fill={skinShadow} />
      <ellipse cx={cx + rx - 0.5} cy={eyeY + 1} rx="2" ry="3.5" fill={skinShadow} />
      {/* Sculpted Jawline & Face */}
      <path
        d={`M${cx - rx} ${cy - 4} Q${cx - rx} ${cy - ry} ${cx} ${cy - ry} Q${cx + rx} ${cy - ry} ${cx + rx} ${cy - 4} Q${cx + rx - 1.5} ${cy + ry * 0.72} ${cx} ${cy + ry} Q${cx - rx + 1.5} ${cy + ry * 0.72} ${cx - rx} ${cy - 4} Z`}
        fill={skin}
        stroke={skinShadow}
        strokeWidth="0.6"
      />
      {/* Cheekbone & jawline subtle shading */}
      <path
        d={`M${cx - rx + 2} ${cy + 3} Q${cx} ${cy + ry - 1} ${cx + rx - 2} ${cy + 3}`}
        fill="none"
        stroke={skinShadow}
        strokeWidth="0.8"
        opacity="0.45"
      />
      {/* Nose bridge */}
      <path
        d={`M${cx - 0.6} ${eyeY - 1} L${cx - 1.2} ${eyeY + 4.8} Q${cx} ${eyeY + 5.6} ${cx + 1.4} ${eyeY + 4.8}`}
        fill="none"
        stroke={skinShadow}
        strokeWidth="1.05"
        strokeLinecap="round"
      />
      {scar && (
        <path
          d={`M${cx + 3} ${eyeY - 5} L${cx + 6.5} ${eyeY + 5}`}
          stroke="#7f1d1d"
          strokeWidth="0.9"
          opacity="0.7"
        />
      )}
      {wrinkles && (
        <path
          d={`M${cx - 5} ${eyeY - 6.5} Q${cx} ${eyeY - 7.5} ${cx + 5} ${eyeY - 6.5}`}
          fill="none"
          stroke={skinShadow}
          strokeWidth="0.65"
          opacity="0.6"
        />
      )}

      {/* Eyes (blinking) */}
      <g className="anim-blink" style={{ transformOrigin: `${cx}px ${eyeY}px` }}>
        {isCyclops ? (
          <g>
            <ellipse
              cx={cx}
              cy={eyeY - 2}
              rx={expression === 'fear' ? 6.2 : 5.4}
              ry={expression === 'fierce' ? 3.8 : 4.5}
              fill="#fef9c3"
              stroke="#451a03"
              strokeWidth="1.1"
            />
            <circle cx={cx} cy={eyeY - 2} r={expression === 'fierce' ? 2.8 : 2.5} fill={eyeColor} />
            <circle cx={cx} cy={eyeY - 2} r="1.15" fill="#1c1917" />
            <circle cx={cx - 0.9} cy={eyeY - 2.9} r="0.6" fill="#ffffff" opacity="0.85" />
          </g>
        ) : (
          <g>
            {[-4.2, 4.2].map((ox) => (
              <g key={ox}>
                <ellipse
                  cx={cx + ox}
                  cy={eyeY}
                  rx={expression === 'fear' ? 2.7 : 2.4}
                  ry={expression === 'fear' ? 2.3 : expression === 'fierce' ? 1.35 : 1.75}
                  fill="#ffffff"
                />
                <circle
                  cx={cx + ox}
                  cy={eyeY}
                  r={expression === 'fear' ? 1.2 : 1.4}
                  fill={eyeColor}
                />
                <circle cx={cx + ox} cy={eyeY} r="0.65" fill="#0f172a" />
              </g>
            ))}
          </g>
        )}
      </g>

      {/* Expressive Eyebrows */}
      {isCyclops ? (
        <path
          d={
            expression === 'fierce'
              ? `M${cx - 7.5} ${eyeY - 8.5} Q${cx} ${eyeY - 6.5} ${cx + 7.5} ${eyeY - 8.5}`
              : `M${cx - 7.5} ${eyeY - 7.5} Q${cx} ${eyeY - 9.5} ${cx + 7.5} ${eyeY - 7.5}`
          }
          fill="none"
          stroke={browColor}
          strokeWidth="2.1"
          strokeLinecap="round"
        />
      ) : (
        <g stroke={browColor} strokeWidth="1.45" strokeLinecap="round" fill="none">
          {expression === 'fierce' && (
            <>
              <path d={`M${cx - 7} ${eyeY - 4.8} L${cx - 1.8} ${eyeY - 2.9}`} />
              <path d={`M${cx + 7} ${eyeY - 4.8} L${cx + 1.8} ${eyeY - 2.9}`} />
            </>
          )}
          {expression === 'sorrow' && (
            <>
              <path d={`M${cx - 7} ${eyeY - 3.2} Q${cx - 4.2} ${eyeY - 5.2} ${cx - 1.8} ${eyeY - 4.4}`} />
              <path d={`M${cx + 7} ${eyeY - 3.2} Q${cx + 4.2} ${eyeY - 5.2} ${cx + 1.8} ${eyeY - 4.4}`} />
            </>
          )}
          {expression === 'fear' && (
            <>
              <path d={`M${cx - 7} ${eyeY - 4.6} Q${cx - 4.2} ${eyeY - 7} ${cx - 1.8} ${eyeY - 5}`} />
              <path d={`M${cx + 7} ${eyeY - 4.6} Q${cx + 4.2} ${eyeY - 7} ${cx + 1.8} ${eyeY - 5}`} />
            </>
          )}
          {expression === 'wise' && (
            <>
              <path d={`M${cx - 7} ${eyeY - 4} Q${cx - 4} ${eyeY - 5.6} ${cx - 1.8} ${eyeY - 4}`} />
              <path d={`M${cx + 1.8} ${eyeY - 4.8} Q${cx + 4.4} ${eyeY - 6.8} ${cx + 7} ${eyeY - 4.6}`} />
            </>
          )}
          {(expression === 'serene' || expression === 'triumph') && (
            <>
              <path d={`M${cx - 7} ${eyeY - 4} Q${cx - 4.2} ${eyeY - 5.8} ${cx - 1.8} ${eyeY - 4}`} />
              <path d={`M${cx + 1.8} ${eyeY - 4} Q${cx + 4.2} ${eyeY - 5.8} ${cx + 7} ${eyeY - 4}`} />
            </>
          )}
        </g>
      )}

      {/* Beard (rendered under mouth line if full, or framing chin) */}
      {beard === 'short_neat' && (
        <path
          d={`M${cx - rx + 1.2} ${cy + 2} Q${cx - rx + 1} ${cy + ry + 1} ${cx} ${cy + ry + 3} Q${cx + rx - 1} ${cy + ry + 1} ${cx + rx - 1.2} ${cy + 2} Q${cx + 6} ${cy + 8.5} ${cx} ${cy + 8.5} Q${cx - 6} ${cy + 8.5} ${cx - rx + 1.2} ${cy + 2} Z`}
          fill={hairColor}
        />
      )}
      {beard === 'medium_full' && (
        <path
          d={`M${cx - rx + 0.5} ${cy + 1} Q${cx - rx} ${cy + ry + 5} ${cx} ${cy + ry + 9} Q${cx + rx} ${cy + ry + 5} ${cx + rx - 0.5} ${cy + 1} Q${cx + 5} ${cy + 7} ${cx} ${cy + 7} Q${cx - 5} ${cy + 7} ${cx - rx + 0.5} ${cy + 1} Z`}
          fill={hairColor}
        />
      )}
      {beard === 'long_rough' && (
        <path
          d={`M${cx - rx} ${cy + 1} L${cx - 10} ${cy + ry + 10} L${cx - 4} ${cy + ry + 16} L${cx} ${cy + ry + 13} L${cx + 4} ${cy + ry + 16} L${cx + 10} ${cy + ry + 10} L${cx + rx} ${cy + 1} Q${cx + 5} ${cy + 7} ${cx} ${cy + 7} Q${cx - 5} ${cy + 7} ${cx - rx} ${cy + 1} Z`}
          fill={hairColor}
        />
      )}
      {beard === 'braided_short' && (
        <g fill={hairColor}>
          <path d={`M${cx - 9} ${cy + 3} Q${cx} ${cy + ry + 4} ${cx + 9} ${cy + 3} Q${cx} ${cy + 8} ${cx - 9} ${cy + 3} Z`} />
          <path d={`M${cx - 3.5} ${cy + ry} L${cx} ${cy + ry + 10} L${cx + 3.5} ${cy + ry} Z`} />
        </g>
      )}

      {/* Expressive or Speaking Animated Mouth */}
      {isSpeaking ? (
        <ellipse
          cx={cx}
          cy={mouthY + 0.4}
          rx="3.1"
          ry="2.3"
          fill="#3a1610"
          stroke="#7c2d12"
          strokeWidth="0.6"
          className="anim-mouth-talk"
          style={{ transformOrigin: `${cx}px ${mouthY + 0.4}px` }}
        />
      ) : (
        <>
          {expression === 'triumph' && (
            <path
              d={`M${cx - 3.8} ${mouthY - 0.8} Q${cx} ${mouthY + 2.8} ${cx + 3.8} ${mouthY - 0.8}`}
              fill="none"
              stroke="#431c14"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
          )}
          {(expression === 'serene' || expression === 'wise') && (
            <path
              d={`M${cx - 3.2} ${mouthY} Q${cx} ${mouthY + 1.6} ${cx + 3.2} ${mouthY}`}
              fill="none"
              stroke="#431c14"
              strokeWidth="1.15"
              strokeLinecap="round"
            />
          )}
          {expression === 'fierce' && (
            <path
              d={`M${cx - 3.8} ${mouthY + 0.8} Q${cx} ${mouthY - 1.4} ${cx + 3.8} ${mouthY + 0.8}`}
              fill="none"
              stroke="#431c14"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          )}
          {expression === 'sorrow' && (
            <>
              <path
                d={`M${cx - 3.2} ${mouthY + 1} Q${cx} ${mouthY - 1.2} ${cx + 3.2} ${mouthY + 1}`}
                fill="none"
                stroke="#431c14"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <circle cx={cx + 5} cy={eyeY + 3.5} r="1" fill="#93c5fd" opacity="0.88" />
            </>
          )}
          {expression === 'fear' && (
            <ellipse cx={cx} cy={mouthY + 0.5} rx="2.4" ry="2" fill="#2a160c" />
          )}
        </>
      )}
    </g>
  );
};

const AnatomicalLegs: React.FC<{
  skin: string;
  footwear: string;
  mode: 'sandals' | 'boots';
  widthScale?: number;
}> = ({ skin, footwear, mode, widthScale = 1 }) => {
  const lx = -6.2 * widthScale;
  const rx = 6.2 * widthScale;
  return (
    <g>
      {[lx, rx].map((x, idx) => (
        <g key={idx}>
          <rect x={x - 3.2 * widthScale} y="-34" width={6.4 * widthScale} height="30" rx="2.8" fill={skin} />
          {mode === 'boots' ? (
            <>
              <path
                d={`M${x - 3.6 * widthScale} -20 L${x + 3.6 * widthScale} -20 L${x + 4 * widthScale} 0 L${x - 4 * widthScale} 0 Z`}
                fill={footwear}
              />
              <line
                x1={x - 3.4 * widthScale}
                y1="-14"
                x2={x + 3.4 * widthScale}
                y2="-14"
                stroke="#b08a4f"
                strokeWidth="1.1"
              />
            </>
          ) : (
            <>
              <path
                d={`M${x - 3.2 * widthScale} -12 L${x + 3.2 * widthScale} -3 M${x + 3.2 * widthScale} -12 L${x - 3.2 * widthScale} -3`}
                stroke={footwear}
                strokeWidth="1.1"
              />
              <rect x={x - 4 * widthScale} y="-3.5" width={8.4 * widthScale} height="3.5" rx="1.5" fill={footwear} />
            </>
          )}
        </g>
      ))}
    </g>
  );
};

const SculptedChitonArmor: React.FC<{
  tunicColor: string;
  tunicFold: string;
  cloakColor: string;
  armorColor?: string;
  trimColor: string;
  beltColor: string;
  skin: string;
  widthScale?: number;
  longDress?: boolean;
}> = ({
  tunicColor,
  tunicFold,
  cloakColor,
  armorColor,
  trimColor,
  beltColor,
  skin,
  widthScale = 1,
  longDress = false,
}) => {
  const sw = 17 * widthScale;
  const ww = 12 * widthScale;
  const hw = longDress ? 22 * widthScale : 19 * widthScale;

  return (
    <g>
      {/* Back Flowing Cloak */}
      <path
        d={`M${-sw - 3} -76 Q${-sw - 9} -38 ${-hw - 5} -3 Q0 1 ${hw + 5} -3 Q${sw + 9} -38 ${sw + 3} -76 Z`}
        fill={cloakColor}
        className="anim-sway"
      />
      <path
        d={`M${-sw - 2} -75 Q${-sw - 7} -38 ${-hw - 4} -3`}
        fill="none"
        stroke={trimColor}
        strokeWidth="1.3"
        opacity="0.85"
      />

      {/* Tunic / Peplos Skirt & Upper Torso */}
      <path
        d={`M${-sw} -76 L${sw} -76 L${ww} -46 L${hw} ${longDress ? -2 : -22} Q0 ${longDress ? 1 : -19} ${-hw} ${longDress ? -2 : -22} L${-ww} -46 Z`}
        fill={tunicColor}
      />
      {/* Vertical drape folds */}
      <g stroke={tunicFold} strokeWidth="1" opacity="0.55">
        <line x1={-6 * widthScale} y1="-44" x2={-9 * widthScale} y2={longDress ? -4 : -22} />
        <line x1="0" y1="-44" x2="0" y2={longDress ? -3 : -21} />
        <line x1={6 * widthScale} y1="-44" x2={9 * widthScale} y2={longDress ? -4 : -22} />
      </g>

      {/* Armor Cuirass + Shoulder Pauldrons if armored */}
      {armorColor && (
        <g>
          <path
            d={`M${-sw + 1} -76 L${sw - 1} -76 L${ww} -48 L${-ww} -48 Z`}
            fill={armorColor}
            stroke={trimColor}
            strokeWidth="1"
          />
          {/* Pectoral line & center crest */}
          <path
            d={`M${-sw + 5} -64 Q${-5 * widthScale} -60 0 -64 Q${5 * widthScale} -60 ${sw - 5} -64`}
            fill="none"
            stroke={trimColor}
            strokeWidth="1.2"
          />
          {/* Pauldrons */}
          <ellipse cx={-sw + 1} cy="-73" rx="6" ry="4.5" fill={armorColor} stroke={trimColor} strokeWidth="1.1" />
          <ellipse cx={sw - 1} cy="-73" rx="6" ry="4.5" fill={armorColor} stroke={trimColor} strokeWidth="1.1" />
          {/* Pteruges strips */}
          {[-9, -3, 3, 9].map((px) => (
            <rect
              key={px}
              x={px * widthScale - 2.2}
              y="-46"
              width="4.4"
              height="13"
              rx="1"
              fill={armorColor}
              stroke={trimColor}
              strokeWidth="0.6"
            />
          ))}
        </g>
      )}

      {/* Waist Belt & Clasp */}
      <rect x={-ww} y="-49" width={ww * 2} height="4.5" rx="1.2" fill={beltColor} />
      <circle cx="0" cy="-46.8" r="2.6" fill={trimColor} />

      {/* Left Arm resting/braced */}
      <path
        d={`M${-sw + 1} -73 Q${-sw - 7} -58 ${-sw - 3} -42`}
        fill="none"
        stroke={skin}
        strokeWidth="5.2"
        strokeLinecap="round"
      />
      {/* Right Arm */}
      <path
        d={`M${sw - 1} -73 Q${sw + 7} -58 ${sw + 4} -44`}
        fill="none"
        stroke={skin}
        strokeWidth="5.2"
        strokeLinecap="round"
      />
    </g>
  );
};

export const DetailedCharacterFigure: React.FC<DetailedCharacterProps> = ({
  id,
  expression = 'serene',
  variant = 'warrior',
  isSpeaking = false,
}) => (
  <SpeakingContext.Provider value={isSpeaking}>
    {isSpeaking && (
      <ellipse
        cx="0"
        cy="-68"
        rx="34"
        ry="68"
        fill="#fde68a"
        opacity="0.18"
        className="anim-speaking-aura"
      />
    )}
    <CharacterFigureInner id={id} expression={expression} variant={variant} />
  </SpeakingContext.Provider>
);

const CharacterFigureInner: React.FC<Omit<DetailedCharacterProps, 'isSpeaking'>> = ({
  id,
  expression = 'serene',
  variant = 'warrior',
}) => {
  // CHAR-01 — ZEUS (4 versions: child, young, warrior, king)
  if (id === 'zeus') {
    if (variant === 'child') {
      return (
        <g className="anim-zeus-cradle" style={{ transformOrigin: '0px -14px' }}>
          {/* Sacred stone cradle & soft white swaddling cloth */}
          <ellipse cx="0" cy="-14" rx="22" ry="12" fill="#e5dec9" stroke="#b08a4f" strokeWidth="1.4" />
          <path d="M-19 -14 Q0 -4 19 -14 L15 -4 Q0 2 -15 -4 Z" fill="#a8a29e" />
          <path d="M-16 -18 Q0 -26 16 -18 Q18 -8 0 -6 Q-18 -8 -16 -18 Z" fill="#f8f4ea" stroke="#d4a040" strokeWidth="1" />
          {/* Soft dark-haired infant Zeus */}
          <ellipse cx="-2" cy="-28" rx="9" ry="9.5" fill="#ebd0b5" />
          <path d="M-11 -30 Q-2 -40 7 -30 Q2 -34 -2 -34 Q-7 -34 -11 -30 Z" fill="#1c1917" />
          <g className="anim-blink" style={{ transformOrigin: '-2px -28px' }}>
            <circle cx="-5" cy="-28" r="1.2" fill="#2563eb" />
            <circle cx="1" cy="-28" r="1.2" fill="#2563eb" />
          </g>
          <path d="M-4 -23 Q-2 -21 0 -23" fill="none" stroke="#5c2b21" strokeWidth="1" />
          {/* Tiny spark above fingers */}
          <polygon points="10,-32 7,-26 11,-26 8,-20 14,-27 10,-27" fill="#7dd3fc" className="anim-zeus-palm" style={{ transformOrigin: '10px -26px' }} />
        </g>
      );
    }

    const hasBeard = variant !== 'young';
    const hasArmor = variant === 'warrior' || variant === 'king';
    const isKing = variant === 'king';
    const showSparks = variant === 'warrior' || isKing || expression === 'fierce';

    return (
      <g>
        <AnatomicalLegs skin="#e2b492" footwear="#5c3a21" mode="sandals" widthScale={1.04} />
        <SculptedChitonArmor
          tunicColor={isKing ? '#fcfaf2' : '#f4eee3'}
          tunicFold="#cbd5e1"
          cloakColor={isKing ? '#1e3a8a' : '#233876'}
          armorColor={hasArmor ? '#b47d34' : undefined}
          trimColor="#eab308"
          beltColor="#4a2e1d"
          skin="#e2b492"
          widthScale={1.04}
          longDress={isKing}
        />

        {/* Electric arcs gathering along Zeus's right arm into his palm (CHAR-01) */}
        {showSparks && (
          <g>
            <circle cx="24" cy="-44" r="6" fill="#7dd3fc" opacity="0.45" className="anim-zeus-palm" />
            <path
              d="M19 -68 L23 -61 L19 -56 L24 -48"
              fill="none"
              stroke="#e0f2fe"
              strokeWidth="1.6"
              strokeLinecap="round"
              className="anim-zeus-spark-1"
            />
            <path
              d="M25 -65 L21 -58 L26 -52 L22 -45"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.4"
              strokeLinecap="round"
              className="anim-zeus-spark-2"
            />
          </g>
        )}

        {/* Branching White-Blue Divine Thunderbolt (Warrior & King) */}
        {(variant === 'warrior' || isKing) && (
          <g className="anim-zeus-bolt" style={{ transformOrigin: '24px -44px' }}>
            <path
              d="M24 -44 L31 -74 L23 -74 L35 -108 L26 -108 L36 -130"
              fill="none"
              stroke="#e0f2fe"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M24 -44 L31 -74 L23 -74 L35 -108 L26 -108 L36 -130"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="6.5"
              strokeOpacity="0.32"
              strokeLinecap="round"
            />
            <path d="M29 -86 L40 -96 M27 -104 L18 -114" stroke="#bae6fd" strokeWidth="1.6" strokeLinecap="round" />
          </g>
        )}

        {/* King Scepter */}
        {isKing && (
          <g className="anim-hera-scepter" style={{ transformOrigin: '-24px -52px' }}>
            <line x1="-24" y1="0" x2="-24" y2="-114" stroke="#eab308" strokeWidth="2.8" />
            <circle cx="-24" cy="-118" r="5" fill="#fef08a" stroke="#b45309" strokeWidth="1.2" />
          </g>
        )}

        {/* Shoulder-length Curly Dark-Brown Hair */}
        <g className="anim-hair" style={{ transformOrigin: '0px -96px' }}>
          <path
            d="M-15 -104 Q-20 -82 -14 -72 Q-9 -70 -8 -78 L8 -78 Q9 -70 14 -72 Q20 -82 15 -104 Q8 -113 0 -113 Q-8 -113 -15 -104 Z"
            fill="#2b1d17"
          />
          <circle cx="-13" cy="-82" r="3.5" fill="#2b1d17" />
          <circle cx="13" cy="-82" r="3.5" fill="#2b1d17" />
        </g>

        <SculptedFace
          skin="#e5ba9b"
          skinShadow="#c99674"
          eyeColor="#64748b"
          browColor="#241712"
          hairColor="#2b1d17"
          beard={hasBeard ? 'short_neat' : 'none'}
          expression={expression}
        />

        {/* Hair crown volume + Gold Laurel Wreath (King) */}
        <path d="M-12 -102 Q0 -114 12 -102 Q5 -107 0 -107 Q-5 -107 -12 -102 Z" fill="#2b1d17" />
        {isKing && (
          <path
            d="M-13 -103 Q0 -111 13 -103"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="3"
            strokeDasharray="3 1.5"
          />
        )}
      </g>
    );
  }

  // CHAR-02 — CRONUS
  if (id === 'cronus') {
    return (
      <g>
        <AnatomicalLegs skin="#c4916e" footwear="#3b2d23" mode="boots" widthScale={1.14} />
        <SculptedChitonArmor
          tunicColor="#3a2c22"
          tunicFold="#1c140f"
          cloakColor="#6d1919"
          armorColor="#4a3a2d"
          trimColor="#5e6e5c"
          beltColor="#3b2d23"
          skin="#c4916e"
          widthScale={1.14}
        />
        {/* Massive Curved War Sickle (Harpe) — predatory sweep */}
        <g className="anim-cronus-sickle" style={{ transformOrigin: '25px -44px' }}>
          <line x1="25" y1="-114" x2="25" y2="0" stroke="#4a3728" strokeWidth="3.4" />
          <path
            d="M25 -114 C25 -134 2 -134 -2 -120 C10 -124 20 -119 22 -106 Z"
            fill="#cbd5e1"
            stroke="#64748b"
            strokeWidth="1"
          />
          <path d="M21 -124 C13 -128 5 -126 1 -121" fill="none" stroke="#f8fafc" strokeWidth="1" opacity="0.8" />
        </g>
        {/* Silver-streaked Black Wild Hair */}
        <g className="anim-hair" style={{ transformOrigin: '0px -96px' }}>
          <path d="M-16 -104 Q-22 -78 -15 -68 L15 -68 Q22 -78 16 -104 Q0 -116 -16 -104 Z" fill="#1c1917" />
          <path d="M-14 -92 Q-16 -80 -12 -72 M14 -92 Q16 -80 12 -72" stroke="#94a3b8" strokeWidth="1.6" fill="none" />
        </g>
        <SculptedFace
          skin="#c99572"
          skinShadow="#9e6d4d"
          eyeColor="#b45309"
          browColor="#1c1917"
          hairColor="#1c1917"
          beard="long_rough"
          expression={expression}
          wrinkles
        />
        {/* Jagged Metal Plate Crown */}
        <polygon
          points="-13,-104 -10,-118 -5,-108 0,-121 5,-108 10,-118 13,-104"
          fill="#57534e"
          stroke="#94a3b8"
          strokeWidth="0.9"
        />
      </g>
    );
  }

  // CHAR-03 — RHEA
  if (id === 'rhea') {
    return (
      <g>
        <SculptedChitonArmor
          tunicColor="#f5efe4"
          tunicFold="#d6ccb8"
          cloakColor="#b4533c"
          trimColor="#d9a441"
          beltColor="#a16207"
          skin="#ebc5a8"
          widthScale={0.96}
          longDress
        />
        {/* Fertility necklace */}
        <path d="M-7 -76 Q0 -69 7 -76" fill="none" stroke="#d9a441" strokeWidth="1.6" />
        {/* Swaddled Infant / Stone Bundle */}
        <g className="anim-rhea-cradle" style={{ transformOrigin: '11px -52px' }}>
          <ellipse cx="11" cy="-52" rx="10.5" ry="6.2" fill="#f7f1e3" stroke="#c7923e" strokeWidth="1.2" />
          <path d="M4 -53 Q11 -48 18 -53" fill="none" stroke="#c7923e" strokeWidth="1" />
        </g>
        {/* Two thick braided chestnut-copper plaits + soft curls */}
        <g className="anim-hair" style={{ transformOrigin: '0px -95px' }}>
          <path d="M-14 -102 Q-18 -84 -13 -64 L-9 -64 Q-12 -84 -10 -100 Z" fill="#7a4228" />
          <path d="M14 -102 Q18 -84 13 -64 L9 -64 Q12 -84 10 -100 Z" fill="#7a4228" />
          <path d="M-12 -102 Q0 -114 12 -102 Z" fill="#7a4228" />
        </g>
        <SculptedFace
          skin="#ecc7a8"
          skinShadow="#cf9e7a"
          eyeColor="#92400e"
          browColor="#5c3a21"
          hairColor="#7a4228"
          expression={expression}
        />
        <path d="M-12 -102 Q0 -112 12 -102 Q4 -106 0 -106 Q-4 -106 -12 -102 Z" fill="#7a4228" />
      </g>
    );
  }

  // CHAR-04 — GAIA
  if (id === 'gaia') {
    return (
      <g>
        <SculptedChitonArmor
          tunicColor="#2d5a3c"
          tunicFold="#1b3a25"
          cloakColor="#6b4423"
          trimColor="#34d399"
          beltColor="#d4a040"
          skin="#d9b392"
          widthScale={1.04}
          longDress
        />
        {/* Glowing Earth Crystal */}
        <g className="anim-gaia-orb" style={{ transformOrigin: '-24px -64px' }}>
          <circle cx="-24" cy="-64" r="10" fill="#10b981" opacity="0.22" />
          <circle cx="-24" cy="-64" r="7.5" fill="#10b981" opacity="0.88" />
          <circle cx="-24" cy="-64" r="4" fill="#a7f3d0" />
        </g>
        {/* Vine & Flower Root Hair */}
        <g className="anim-hair" style={{ transformOrigin: '0px -95px' }}>
          <path d="M-16 -102 Q-22 -74 -15 -58 L15 -58 Q22 -74 16 -102 Q0 -116 -16 -102 Z" fill="#3b4d2b" />
          <circle cx="-9" cy="-106" r="2.2" fill="#fde047" />
          <circle cx="0" cy="-109" r="2.4" fill="#f9a8d4" />
          <circle cx="9" cy="-106" r="2.2" fill="#fde047" />
        </g>
        <SculptedFace
          skin="#d9b392"
          skinShadow="#b38967"
          eyeColor="#059669"
          browColor="#2f3e1e"
          hairColor="#3b4d2b"
          expression={expression}
        />
        <path d="M-12 -101 Q0 -112 12 -101 Q0 -106 -12 -101 Z" fill="#3b4d2b" />
      </g>
    );
  }

  // CHAR-05 — URANUS
  if (id === 'uranus') {
    return (
      <g className="anim-float">
        <SculptedChitonArmor
          tunicColor="#1e254d"
          tunicFold="#0f172a"
          cloakColor="#14224a"
          trimColor="#fde047"
          beltColor="#94a3b8"
          skin="#4b5e96"
          widthScale={1.06}
          longDress
        />
        {/* Constellations on Star Cloak */}
        <circle cx="-6" cy="-34" r="1.4" fill="#fde047" className="anim-star-twinkle" style={{ transformOrigin: '-6px -34px' }} />
        <circle cx="7" cy="-22" r="1.6" fill="#fef08a" className="anim-star-twinkle" style={{ transformOrigin: '7px -22px', animationDelay: '0.9s' }} />
        <circle cx="-3" cy="-14" r="1.2" fill="#e2e8f0" className="anim-star-twinkle" style={{ transformOrigin: '-3px -14px', animationDelay: '1.7s' }} />
        {/* Star Scepter */}
        <line x1="25" y1="-120" x2="25" y2="0" stroke="#cbd5e1" strokeWidth="2.4" />
        <circle cx="25" cy="-123" r="4.5" fill="#fde047" className="anim-star-twinkle" style={{ transformOrigin: '25px -123px' }} />
        {/* Cloud-like Silver-Blue Hair & Orbiting Armillary Rings Crown */}
        <path d="M-15 -104 Q-20 -78 -13 -68 L13 -68 Q20 -78 15 -104 Z" fill="#94a3b8" className="anim-hair" />
        <g className="anim-uranus-ring" style={{ transformOrigin: '0px -98px' }}>
          <circle cx="0" cy="-98" r="20" fill="none" stroke="#fde047" strokeWidth="1.2" strokeOpacity="0.7" strokeDasharray="10 4" />
          <ellipse cx="0" cy="-104" rx="18" ry="5" fill="none" stroke="#fde047" strokeWidth="1.2" strokeOpacity="0.88" />
          <circle cx="20" cy="-98" r="1.8" fill="#fef08a" />
          <circle cx="-20" cy="-98" r="1.5" fill="#e2e8f0" />
        </g>
        <SculptedFace
          skin="#687bb5"
          skinShadow="#3b4d82"
          eyeColor="#f8fafc"
          browColor="#cbd5e1"
          hairColor="#94a3b8"
          beard="medium_full"
          expression={expression}
        />
        <path d="M-12 -103 Q0 -113 12 -103 Z" fill="#cbd5e1" />
      </g>
    );
  }

  // CHAR-06 — METIS
  if (id === 'metis') {
    return (
      <g>
        <SculptedChitonArmor
          tunicColor="#0f766e"
          tunicFold="#134e4a"
          cloakColor="#cbd5e1"
          trimColor="#94a3b8"
          beltColor="#b45309"
          skin="#ebd0b5"
          widthScale={0.92}
          longDress
        />
        {/* Herb pouches & Ceramic Potion Jar with rising vapor */}
        <rect x="-13" y="-48" width="5" height="6.5" rx="1" fill="#92400e" />
        <g className="anim-metis-elixir" style={{ transformOrigin: '22px -50px' }}>
          <path d="M18 -56 L26 -56 L24 -46 L20 -46 Z" fill="#b45309" stroke="#fde047" strokeWidth="0.8" />
          <circle cx="22" cy="-61" r="3.2" fill="#5eead4" opacity="0.85" className="anim-herb-wisp" />
          <circle cx="20" cy="-65" r="2.2" fill="#99f6e4" opacity="0.7" className="anim-herb-wisp" style={{ animationDelay: '1.1s' }} />
        </g>
        {/* Low neat chignon bun */}
        <circle cx="-11" cy="-88" r="5" fill="#2b1d17" />
        <SculptedFace
          skin="#ebd0b5"
          skinShadow="#c9a585"
          eyeColor="#10b981"
          browColor="#1f1612"
          hairColor="#2b1d17"
          expression={expression}
        />
        <path d="M-12 -101 Q0 -112 12 -101 Q5 -106 0 -106 Q-5 -106 -12 -101 Z" fill="#2b1d17" />
      </g>
    );
  }

  // CHAR-07 — POSEIDON
  if (id === 'poseidon') {
    return (
      <g>
        <AnatomicalLegs skin="#cf946d" footwear="#b48342" mode="sandals" widthScale={1.08} />
        <SculptedChitonArmor
          tunicColor="#0e4d7a"
          tunicFold="#082f49"
          cloakColor="#115e59"
          armorColor="#b48342"
          trimColor="#e2e8f0"
          beltColor="#78350f"
          skin="#cf946d"
          widthScale={1.08}
        />
        {/* Three-Pronged Bright Metal Trident + Spinning Water Vortex */}
        <g className="anim-poseidon-trident" style={{ transformOrigin: '25px -56px' }}>
          <line x1="25" y1="-114" x2="25" y2="0" stroke="#e2e8f0" strokeWidth="3" />
          <path d="M17 -126 L17 -112 L33 -112 L33 -126" fill="none" stroke="#f8fafc" strokeWidth="2.4" />
          <line x1="25" y1="-132" x2="25" y2="-112" stroke="#f8fafc" strokeWidth="2.4" />
          <circle
            cx="25"
            cy="-120"
            r="12"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.6"
            strokeDasharray="6 3"
            className="anim-water-vortex"
            style={{ transformOrigin: '25px -120px' }}
          />
        </g>
        <path d="M-15 -104 Q-20 -82 -14 -72 L14 -72 Q20 -82 15 -104 Z" fill="#1f3a44" className="anim-hair" />
        <SculptedFace
          skin="#cf946d"
          skinShadow="#a36c48"
          eyeColor="#0284c7"
          browColor="#1e293b"
          hairColor="#1f3a44"
          beard="medium_full"
          expression={expression}
        />
        <path d="M-12 -102 Q0 -114 12 -102 Q0 -107 -12 -102 Z" fill="#1f3a44" />
      </g>
    );
  }

  // CHAR-08 — HADES
  if (id === 'hades') {
    return (
      <g>
        <AnatomicalLegs skin="#cbd5e1" footwear="#1e2430" mode="boots" widthScale={0.98} />
        <SculptedChitonArmor
          tunicColor="#1e2430"
          tunicFold="#0f172a"
          cloakColor="#3b1d6a"
          armorColor="#1e2430"
          trimColor="#cbd5e1"
          beltColor="#475569"
          skin="#cbd5e1"
          widthScale={0.98}
        />
        {/* Two-pronged Bident & Orbiting Underworld Soul Wisps */}
        <g className="anim-hera-scepter" style={{ transformOrigin: '24px -52px' }}>
          <line x1="24" y1="-114" x2="24" y2="0" stroke="#94a3b8" strokeWidth="2.6" />
          <path d="M18 -128 L18 -113 L30 -113 L30 -128" fill="none" stroke="#cbd5e1" strokeWidth="2.4" />
        </g>
        <circle cx="-22" cy="-64" r="4.2" fill="#a78bfa" opacity="0.72" className="anim-hades-wisp" />
        <circle cx="24" cy="-94" r="2.8" fill="#c4b5fd" opacity="0.65" className="anim-hades-wisp" style={{ animationDelay: '1.8s' }} />
        <path d="M-14 -102 Q-17 -78 -12 -68 L12 -68 Q17 -78 14 -102 Z" fill="#111827" className="anim-hair" />
        <SculptedFace
          skin="#cbd5e1"
          skinShadow="#94a3b8"
          eyeColor="#94a3b8"
          browColor="#0f172a"
          hairColor="#111827"
          beard="short_neat"
          expression={expression}
        />
        {/* Silver-Engraved Dark Greek Helm of Darkness (not horned demon!) */}
        <path
          d="M-12.5 -101 Q-12 -117 0 -117 Q12 -117 12.5 -101 Z"
          fill="#1e2430"
          stroke="#cbd5e1"
          strokeWidth="1.2"
        />
        <path d="M-3 -117 L0 -124 L3 -117 Z" fill="#cbd5e1" />
      </g>
    );
  }

  // CHAR-09 — HERA
  if (id === 'hera') {
    return (
      <g>
        <SculptedChitonArmor
          tunicColor="#faf5eb"
          tunicFold="#e2d7c1"
          cloakColor="#1e3a8a"
          trimColor="#fbbf24"
          beltColor="#d97706"
          skin="#f0cbb0"
          widthScale={0.95}
          longDress
        />
        {/* Peacock Scepter */}
        <g className="anim-hera-scepter" style={{ transformOrigin: '23px -52px' }}>
          <line x1="23" y1="-114" x2="23" y2="0" stroke="#eab308" strokeWidth="2.5" />
          <ellipse cx="23" cy="-120" rx="5.5" ry="7.5" fill="#0d9488" stroke="#fbbf24" strokeWidth="1.4" />
          <circle cx="23" cy="-120" r="2.5" fill="#1d4ed8" />
        </g>
        {/* Elaborate Updo + Side Curls */}
        <circle cx="0" cy="-114" r="6" fill="#2b1d17" />
        <path d="M-14 -100 Q-16 -84 -11 -76 M14 -100 Q16 -84 11 -76" stroke="#2b1d17" strokeWidth="3.2" fill="none" />
        <SculptedFace
          skin="#f0cbb0"
          skinShadow="#cfa488"
          eyeColor="#92400e"
          browColor="#2b1d17"
          hairColor="#2b1d17"
          expression={expression}
        />
        <path d="M-12 -101 Q0 -111 12 -101 Z" fill="#2b1d17" />
        {/* Ornate Gold Diadem */}
        <polygon
          points="-12,-103 -9,-114 -4,-107 0,-118 4,-107 9,-114 12,-103"
          fill="#fbbf24"
          stroke="#b45309"
          strokeWidth="0.7"
        />
      </g>
    );
  }

  // CHAR-10 — DEMETER
  if (id === 'demeter') {
    return (
      <g>
        <SculptedChitonArmor
          tunicColor="#e7dec3"
          tunicFold="#b8a982"
          cloakColor="#4d7c0f"
          trimColor="#f59e0b"
          beltColor="#92400e"
          skin="#e5bd9c"
          widthScale={1.0}
          longDress
        />
        {/* Golden Wheat Sheaf swaying in harvest breeze */}
        <g className="anim-demeter-wheat" style={{ transformOrigin: '22px -44px' }}>
          <path d="M21 -44 L26 -86 M23 -44 L31 -84 M19 -44 L21 -84" stroke="#f59e0b" strokeWidth="2.2" />
          <ellipse cx="26" cy="-86" rx="4.5" ry="7.5" fill="#fbbf24" />
        </g>
        {/* Honey-Golden Wavy Hair */}
        <path d="M-15 -102 Q-20 -74 -13 -60 L13 -60 Q20 -74 15 -102 Z" fill="#b45309" className="anim-hair" />
        <SculptedFace
          skin="#e5bd9c"
          skinShadow="#c29570"
          eyeColor="#92400e"
          browColor="#78350f"
          hairColor="#b45309"
          expression={expression}
        />
        <path d="M-12 -101 Q0 -112 12 -101 Z" fill="#b45309" />
        {/* Wheat Crown */}
        <path d="M-12 -103 Q0 -111 12 -103" fill="none" stroke="#facc15" strokeWidth="3.2" strokeDasharray="3 2" />
      </g>
    );
  }

  // CHAR-11 — HESTIA
  if (id === 'hestia') {
    return (
      <g>
        <SculptedChitonArmor
          tunicColor="#f7f1e3"
          tunicFold="#d6ccb8"
          cloakColor="#9a3412"
          trimColor="#fde68a"
          beltColor="#b45309"
          skin="#ebd0b5"
          widthScale={0.94}
          longDress
        />
        {/* Sacred Hearth Flame Bowl & Warm Hearth Glow */}
        <g className="anim-float" style={{ transformOrigin: '20px -54px' }}>
          <circle cx="20" cy="-60" r="10" fill="#fb923c" opacity="0.28" className="anim-aura" style={{ transformOrigin: '20px -60px' }} />
          <path d="M14 -54 L26 -54 L24 -46 L16 -46 Z" fill="#d97706" />
          <path
            d="M20 -68 C24 -62 24 -56 20 -54 C16 -56 16 -62 20 -68 Z"
            fill="#fb923c"
            className="anim-flame"
            style={{ transformOrigin: '20px -54px' }}
          />
        </g>
        {/* Modest Head Veil */}
        <path
          d="M-16 -104 Q-20 -68 -14 -52 L14 -52 Q20 -68 16 -104 Q0 -118 -16 -104 Z"
          fill="#efe6d5"
          className="anim-hair"
          style={{ transformOrigin: '0px -104px' }}
        />
        <SculptedFace
          skin="#ebd0b5"
          skinShadow="#c7a588"
          eyeColor="#b45309"
          browColor="#5c3a21"
          hairColor="#5c3a21"
          expression={expression}
        />
        <path d="M-12 -100 Q0 -110 12 -100" fill="none" stroke="#5c3a21" strokeWidth="2.6" />
      </g>
    );
  }

  // CHAR-12/13/14 — BRONTES / STEROPES / ARGES (Three Distinct Cyclopes)
  if (id === 'brontes' || id === 'steropes' || id === 'arges') {
    const cfg = {
      brontes: {
        skin: '#8a7060',
        shadow: '#5c473a',
        hair: '#1c1917',
        eye: '#f59e0b',
        apron: '#5c361e',
        metal: '#78716c',
        ws: 1.24,
        beard: 'short_neat' as BeardStyle,
      },
      steropes: {
        skin: '#64748b',
        shadow: '#475569',
        hair: '#334155',
        eye: '#38bdf8',
        apron: '#1e293b',
        metal: '#94a3b8',
        ws: 1.06,
        beard: 'none' as BeardStyle,
      },
      arges: {
        skin: '#9a633c',
        shadow: '#6e4224',
        hair: '#7f1d1d',
        eye: '#facc15',
        apron: '#7c2d12',
        metal: '#d97706',
        ws: 1.15,
        beard: 'braided_short' as BeardStyle,
      },
    }[id];

    return (
      <g>
        <AnatomicalLegs skin={cfg.skin} footwear={cfg.apron} mode="boots" widthScale={cfg.ws} />
        <SculptedChitonArmor
          tunicColor={cfg.apron}
          tunicFold="#1c1917"
          cloakColor={cfg.apron}
          armorColor={id === 'arges' ? cfg.metal : undefined}
          trimColor={cfg.metal}
          beltColor="#451a03"
          skin={cfg.skin}
          widthScale={cfg.ws}
        />
        {id === 'steropes' ? (
          <g className="anim-steropes-tongs" style={{ transformOrigin: '27px -50px' }}>
            <line x1="27" y1="-102" x2="27" y2="-10" stroke="#94a3b8" strokeWidth="3.2" />
            <rect x="21" y="-110" width="12" height="7" rx="1.5" fill="#bae6fd" stroke="#0284c7" strokeWidth="1" />
            <polygon points="27,-120 24,-114 28,-114 25,-109 31,-115 27,-115" fill="#7dd3fc" className="anim-zeus-spark-1" />
          </g>
        ) : (
          <g className="anim-cyclops-hammer" style={{ transformOrigin: '28px -50px' }}>
            <line x1="28" y1="-108" x2="28" y2="0" stroke="#78350f" strokeWidth="4" />
            <rect
              x={id === 'brontes' ? 16 : 19}
              y="-122"
              width={id === 'brontes' ? 24 : 18}
              height={id === 'brontes' ? 14 : 11}
              rx="2"
              fill={cfg.metal}
              stroke="#fb923c"
              strokeWidth="1"
            />
          </g>
        )}
        <path d="M-15 -106 Q-18 -84 -14 -76 L14 -76 Q18 -84 15 -106 Z" fill={cfg.hair} />
        <SculptedFace
          cy={-97}
          rx={13.5}
          ry={15}
          skin={cfg.skin}
          skinShadow={cfg.shadow}
          eyeColor={cfg.eye}
          browColor={cfg.hair}
          hairColor={cfg.hair}
          beard={cfg.beard}
          expression={expression}
          isCyclops
          scar={id === 'brontes'}
        />
        <path d="M-14 -105 Q0 -118 14 -105 Z" fill={cfg.hair} />
      </g>
    );
  }

  // CHAR-15/16/17 — COTTUS / BRIAREUS / GYGES (Three Distinct Hecatoncheires)
  if (id === 'cottus' || id === 'briareus' || id === 'gyges') {
    const cfg = {
      cottus: { skin: '#78716c', shadow: '#44403c', hair: '#292524', eye: '#f59e0b', cloth: '#3f3a36', ws: 1.24 },
      briareus: { skin: '#475569', shadow: '#1e293b', hair: '#0f172a', eye: '#7dd3fc', cloth: '#1e293b', ws: 1.14 },
      gyges: { skin: '#7c3e32', shadow: '#451a03', hair: '#1c1917', eye: '#ef4444', cloth: '#57534e', ws: 1.18 },
    }[id];

    return (
      <g>
        {/* Multi-layered Asynchronous Fans of Stone Arms Holding Boulders */}
        <g className="anim-hecaton-l" style={{ transformOrigin: '-18px -60px' }}>
          <path d="M-18 -72 L-46 -98 L-41 -104 L-14 -78 Z" fill={cfg.skin} />
          <path d="M-20 -58 L-50 -68 L-47 -76 L-18 -66 Z" fill={cfg.shadow} />
          <path d="M-18 -46 L-44 -36 L-40 -44 L-16 -54 Z" fill={cfg.skin} />
          <polygon points="-49,-102 -42,-112 -35,-102 -42,-93" fill="#57534e" stroke="#292524" strokeWidth="1" />
        </g>
        <g className="anim-hecaton-r" style={{ transformOrigin: '18px -60px' }}>
          <path d="M18 -72 L46 -98 L41 -104 L14 -78 Z" fill={cfg.skin} />
          <path d="M20 -58 L50 -68 L47 -76 L18 -66 Z" fill={cfg.shadow} />
          <path d="M18 -46 L44 -36 L40 -44 L16 -54 Z" fill={cfg.skin} />
          <polygon points="35,-102 42,-112 49,-102 42,-93" fill="#57534e" stroke="#292524" strokeWidth="1" />
        </g>

        <AnatomicalLegs skin={cfg.skin} footwear={cfg.cloth} mode="boots" widthScale={cfg.ws} />
        <SculptedChitonArmor
          tunicColor={cfg.cloth}
          tunicFold="#1c1917"
          cloakColor={cfg.cloth}
          trimColor="#94a3b8"
          beltColor="#78716c"
          skin={cfg.skin}
          widthScale={cfg.ws}
        />

        {/* Secondary Multi-Tiered Shoulder Heads */}
        {[-17, 17].map((hx) => (
          <g key={hx}>
            <circle cx={hx} cy="-84" r="7.5" fill={cfg.skin} stroke={cfg.shadow} strokeWidth="0.8" />
            <circle cx={hx - 2.2} cy="-85" r="1.2" fill={cfg.eye} />
            <circle cx={hx + 2.2} cy="-85" r="1.2" fill={cfg.eye} />
          </g>
        ))}

        <SculptedFace
          cy={-97}
          rx={13}
          ry={14.5}
          skin={cfg.skin}
          skinShadow={cfg.shadow}
          eyeColor={cfg.eye}
          browColor={cfg.hair}
          hairColor={cfg.hair}
          beard={id === 'gyges' ? 'short_neat' : 'none'}
          expression={expression}
        />
        <path d="M-13 -104 Q0 -116 13 -104 Z" fill={cfg.hair} />
      </g>
    );
  }

  // CHAR-18 — CAMPE (Coiled Spiked Serpent Tail + Female Scaled Torso + Bat Wings + Serpent Hair + Fire Whip)
  if (id === 'campe') {
    return (
      <g>
        {/* Dark Bat-Dragon Wings */}
        <g className="anim-wing-l" style={{ transformOrigin: '-8px -64px' }}>
          <path d="M-8 -66 C-34 -102 -56 -100 -58 -76 C-42 -66 -24 -58 -8 -54 Z" fill="#2e1065" stroke="#22c55e" strokeWidth="1" />
        </g>
        <g className="anim-wing-r" style={{ transformOrigin: '8px -64px' }}>
          <path d="M8 -66 C34 -102 56 -100 58 -76 C42 -66 24 -58 8 -54 Z" fill="#2e1065" stroke="#22c55e" strokeWidth="1" />
        </g>
        {/* Massive Coiled Spiked Serpent Lower Body (undulating, NO human legs) */}
        <g className="anim-campe-coil" style={{ transformOrigin: '0px -10px' }}>
          <path
            d="M-12 -46 C-16 -26 -28 -8 -16 0 C-2 4 22 4 30 -6 C38 -16 24 -28 12 -22 C28 -18 42 -36 32 -48"
            fill="none"
            stroke="#0f292e"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M-12 -46 C-16 -26 -28 -8 -16 0 C-2 4 22 4 30 -6"
            fill="none"
            stroke="#22c55e"
            strokeWidth="1.6"
            strokeDasharray="3 5"
          />
        </g>
        {/* Female Scaled Upper Torso */}
        <path d="M-15 -76 L15 -76 L10 -44 L-10 -44 Z" fill="#0f292e" stroke="#22c55e" strokeWidth="0.9" />
        {/* Lashing Fire Whip */}
        <path
          d="M16 -58 C34 -54 38 -82 26 -90"
          fill="none"
          stroke="#f97316"
          strokeWidth="2.4"
          strokeLinecap="round"
          className="anim-campe-whip"
          style={{ transformOrigin: '16px -58px' }}
        />
        {/* Writhing Serpent Hair & Horns */}
        <g className="anim-serpent-hair" style={{ transformOrigin: '0px -95px' }}>
          <path d="M-10 -104 C-18 -114 -20 -124 -12 -126" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M10 -104 C18 -114 20 -124 12 -126" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
          <polygon points="-9,-104 -14,-120 -4,-107" fill="#0f292e" />
          <polygon points="9,-104 14,-120 4,-107" fill="#0f292e" />
        </g>
        <SculptedFace
          skin="#94a3b8"
          skinShadow="#64748b"
          eyeColor="#ea580c"
          browColor="#0f172a"
          hairColor="#0f172a"
          expression={expression}
        />
      </g>
    );
  }

  // CHAR-19 — PROMETHEUS
  if (id === 'prometheus') {
    return (
      <g>
        <AnatomicalLegs skin="#dfb695" footwear="#8c6239" mode="sandals" widthScale={0.98} />
        <SculptedChitonArmor
          tunicColor="#d6d3d1"
          tunicFold="#a8a29e"
          cloakColor="#8c6239"
          trimColor="#f59e0b"
          beltColor="#78350f"
          skin="#dfb695"
          widthScale={0.98}
          longDress
        />
        {/* Symbolic Foresight Torch */}
        <g className="anim-prometheus-torch" style={{ transformOrigin: '23px -46px' }}>
          <line x1="23" y1="-92" x2="23" y2="-40" stroke="#78350f" strokeWidth="2.8" />
          <path d="M23 -108 C28 -99 27 -92 23 -90 C19 -92 18 -99 23 -108 Z" fill="#fb923c" className="anim-flame" style={{ transformOrigin: '23px -90px' }} />
        </g>
        <SculptedFace
          skin="#dfb695"
          skinShadow="#b38865"
          eyeColor="#ca8a04"
          browColor="#29201b"
          hairColor="#29201b"
          beard="short_neat"
          expression={expression}
        />
        <path d="M-12 -101 Q0 -113 12 -101 Z" fill="#29201b" />
      </g>
    );
  }

  // CHAR-20 — AMALTHEA (Sacred White-Cream Goat with Ivory Horns & Bronze Bell)
  if (id === 'amalthea') {
    return (
      <g>
        {/* 4 Legs & Hooves */}
        {[-16, -9, 10, 17].map((lx) => (
          <g key={lx}>
            <rect x={lx - 2} y="-26" width="4" height="23" rx="1.5" fill="#f5efe0" />
            <rect x={lx - 2.3} y="-4" width="4.6" height="4" rx="1" fill="#3b2d23" />
          </g>
        ))}
        {/* Fleece Barrel Body */}
        <ellipse cx="0" cy="-34" rx="22" ry="13" fill="#faf6eb" stroke="#d6cbb0" strokeWidth="1" />
        {/* Tail */}
        <polygon points="-21,-38 -27,-45 -18,-42" fill="#faf6eb" />
        {/* Neck, Rope Collar & Ringing Bronze Bell */}
        <path d="M12 -42 L22 -64 L30 -60 L20 -34 Z" fill="#faf6eb" />
        <line x1="15" y1="-48" x2="25" y2="-43" stroke="#a68358" strokeWidth="2.6" />
        <polygon points="22,-42 19,-34 25,-34" fill="#d97706" className="anim-bell-ring" style={{ transformOrigin: '22px -42px' }} />
        {/* Curved Ivory Horns & Nodding Goat Head */}
        <g className="anim-goat-head" style={{ transformOrigin: '18px -54px' }}>
          <path d="M22 -67 C18 -82 6 -84 4 -76" fill="none" stroke="#e6dec5" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M25 -67 C22 -80 12 -82 9 -75" fill="none" stroke="#d6cbb0" strokeWidth="2.6" strokeLinecap="round" />
          <ellipse cx="26" cy="-61" rx="8.5" ry="6.5" fill="#faf6eb" stroke="#d6cbb0" strokeWidth="0.9" />
          <ellipse cx="33" cy="-59" rx="5" ry="3.8" fill="#f5efe0" />
          <g className="anim-blink" style={{ transformOrigin: '28px -62px' }}>
            <circle cx="28" cy="-62" r="1.5" fill="#a16207" />
          </g>
        </g>
      </g>
    );
  }

  // CHAR-21 — CURETES (Cretan Ritual Guardian Warrior: Bronze Helm, Leather Armor, Brick-Red Tunic, Round Shield & Spear)
  return (
    <g>
      <AnatomicalLegs skin="#dfb18e" footwear="#784f32" mode="sandals" widthScale={1.0} />
      <SculptedChitonArmor
        tunicColor="#9a3412"
        tunicFold="#7c2d12"
        cloakColor="#7c2d12"
        armorColor="#784f32"
        trimColor="#d97706"
        beltColor="#b45309"
        skin="#dfb18e"
        widthScale={1.0}
      />
      {/* Round Bronze Shield — ritual clash */}
      <g className="anim-curetes-shield" style={{ transformOrigin: '-18px -56px' }}>
        <circle cx="-18" cy="-56" r="14" fill="#c28a38" stroke="#fef08a" strokeWidth="1.4" />
        <circle cx="-18" cy="-56" r="5" fill="#9a6715" />
      </g>
      {/* Long Spear — war-dance thrust */}
      <g className="anim-curetes-spear" style={{ transformOrigin: '23px -56px' }}>
        <line x1="23" y1="-114" x2="23" y2="0" stroke="#784f32" strokeWidth="2.6" />
        <polygon points="23,-128 19,-113 27,-113" fill="#e2e8f0" />
      </g>
      <SculptedFace
        skin="#dfb18e"
        skinShadow="#b88965"
        eyeColor="#451a03"
        browColor="#3b2618"
        hairColor="#3b2618"
        beard="short_neat"
        expression={expression}
      />
      {/* Simple Cretan Bronze Helm */}
      <path d="M-12 -100 Q-12 -116 0 -116 Q12 -116 12 -100 Z" fill="#c28a38" stroke="#fef08a" strokeWidth="0.9" />
    </g>
  );
};
