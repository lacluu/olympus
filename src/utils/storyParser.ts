import type {
  Chapter,
  ChapterAtmosphere,
  CharacterExpression,
  EnvironmentAssetId,
  SceneActor,
  SceneBackdrop,
  SceneInteraction,
  StoryPage,
} from '../data/myths';
import type { ProfileCharacterId, ZeusVariant } from '../data/characters';
import type { StageCharacterId } from '../three/MythStage';

const CHARACTER_KEYWORDS: Array<{
  id: StageCharacterId;
  profileId: ProfileCharacterId;
  patterns: RegExp[];
}> = [
  { id: 'zeus', profileId: 'zeus', patterns: [/\bzeus\b/i, /thần sấm/i, /bão tố/i] },
  { id: 'cronus', profileId: 'cronus', patterns: [/cronus/i, /bạo chúa/i] },
  { id: 'rhea', profileId: 'rhea', patterns: [/rhea/i] },
  { id: 'gaia', profileId: 'gaia', patterns: [/gaia/i, /đất mẹ/i] },
  { id: 'uranus', profileId: 'uranus', patterns: [/uranus/i, /bầu trời/i] },
  { id: 'metis', profileId: 'metis', patterns: [/metis/i] },
  { id: 'poseidon', profileId: 'poseidon', patterns: [/poseidon/i, /đinh ba/i] },
  { id: 'hades', profileId: 'hades', patterns: [/hades/i, /âm phủ/i] },
  { id: 'hera', profileId: 'hera', patterns: [/hera/i] },
  { id: 'demeter', profileId: 'demeter', patterns: [/demeter/i, /mùa màng/i, /lúa mì/i] },
  { id: 'hestia', profileId: 'hestia', patterns: [/hestia/i, /bếp lửa/i] },
  { id: 'brontes', profileId: 'brontes', patterns: [/brontes/i, /cyclopes/i, /một mắt/i] },
  { id: 'steropes', profileId: 'steropes', patterns: [/steropes/i, /thợ rèn/i] },
  { id: 'arges', profileId: 'arges', patterns: [/arges/i] },
  { id: 'cottus', profileId: 'cottus', patterns: [/cottus/i] },
  { id: 'briareus', profileId: 'briareus', patterns: [/briareus/i, /hecatoncheires/i, /trăm tay/i] },
  { id: 'gyges', profileId: 'gyges', patterns: [/gyges/i] },
  { id: 'campe', profileId: 'campe', patterns: [/campe/i, /canh ngục/i] },
  { id: 'prometheus', profileId: 'prometheus', patterns: [/prometheus/i] },
  { id: 'amalthea', profileId: 'amalthea', patterns: [/amalthea/i, /dê thần/i] },
  { id: 'curetes', profileId: 'curetes', patterns: [/curetes/i] },
];

export const ATMOSPHERE_DEFAULT_BACKDROP: Record<ChapterAtmosphere, SceneBackdrop> = {
  primordial: 'cosmos_origin',
  othrys: 'twin_mountains',
  crete: 'crete_sacred_cave',
  tartarus: 'tartarus_descent',
  battleground: 'lightning_zenith',
  olympus: 'olympus_dawn_throne',
};

function inferExpression(text: string): CharacterExpression {
  if (/chiến|giận|phẫn nộ|sấm|sét|tiêu diệt/i.test(text)) return 'fierce';
  if (/sợ|kinh hoàng|sụp đổ|thất bại/i.test(text)) return 'fear';
  if (/buồn|đau|khóc|cô độc|từ biệt/i.test(text)) return 'sorrow';
  if (/thắng|lên ngôi|vinh quang|giải thoát/i.test(text)) return 'triumph';
  if (/trí tuệ|mưu|lời khuyên|tiên tri/i.test(text)) return 'wise';
  return 'serene';
}

function inferZeusVariant(text: string): ZeusVariant {
  if (/sơ sinh|trẻ thơ|hang động|amalthea|curetes/i.test(text)) return 'child';
  if (/ngai vàng|lên ngôi|vua olympus|vòng nguyệt quế/i.test(text)) return 'king';
  if (/ẩn náu|thuốc nôn|giải thoát anh chị/i.test(text)) return 'young';
  return 'warrior';
}

export function detectActorsInText(text: string): {
  actors: SceneActor[];
  featuredProfiles: ProfileCharacterId[];
} {
  const found: Array<{ id: StageCharacterId; profileId: ProfileCharacterId }> = [];

  for (const entry of CHARACTER_KEYWORDS) {
    if (entry.patterns.some((re) => re.test(text))) {
      found.push({ id: entry.id, profileId: entry.profileId });
    }
  }

  if (found.length === 0) {
    found.push({ id: 'zeus', profileId: 'zeus' });
  }

  const expr = inferExpression(text);
  const zeusVariant = inferZeusVariant(text);
  const capped = found.slice(0, 5);
  const rolesByCount: Record<number, SceneActor['role'][]> = {
    1: ['center'],
    2: ['left', 'right'],
    3: ['left', 'center', 'right'],
    4: ['left', 'back-left', 'center', 'right'],
    5: ['left', 'back-left', 'center', 'back-right', 'right'],
  };
  const roles = rolesByCount[capped.length] ?? ['center'];

  const actors: SceneActor[] = capped.map((f, idx) => ({
    id: f.id,
    expression: expr,
    role: roles[idx] ?? 'center',
    motion:
      capped.length === 1
        ? 'pace'
        : expr === 'fierce'
          ? 'lunge'
          : expr === 'fear'
            ? 'recoil'
            : idx === 0
              ? 'advance'
              : 'guard',
    ...(f.id === 'zeus' ? { variant: zeusVariant } : {}),
  }));

  const profiles: ProfileCharacterId[] = [];
  capped.forEach((f) => {
    if (!profiles.includes(f.profileId)) {
      profiles.push(f.profileId);
    }
  });

  return { actors, featuredProfiles: profiles };
}

export function resolveSpeakerId(
  speakerName: string,
  fallbackActors: SceneActor[],
): StageCharacterId {
  for (const entry of CHARACTER_KEYWORDS) {
    if (entry.patterns.some((re) => re.test(speakerName))) {
      return entry.id;
    }
  }
  return fallbackActors[0]?.id ?? 'zeus';
}

function inferInteraction(
  text: string,
  actorCount: number,
): SceneInteraction {
  if (actorCount <= 1) return 'solo';
  if (/chiến|tấn công|đánh|ném|sét|tiêu diệt|trận/i.test(text)) return 'battle';
  if (/đối đầu|lật đổ|chặn|phẫn nộ/i.test(text)) return 'confront';
  if (/giam|xiềng|nuốt|ngục/i.test(text)) return 'imprison';
  if (/trao|tặng|rèn|cốc|thuốc/i.test(text)) return 'gift';
  if (/nuôi|che chở|trốn|hang đá/i.test(text)) return 'nurture';
  if (/chiến thắng|lên ngôi|vinh quang|giải thoát/i.test(text)) return 'triumph';
  return 'converse';
}

function inferMood(text: string): StoryPage['mood'] {
  if (/sấm|sét|chiến|giận|lật đổ|quái vật|sụp đổ/i.test(text)) return 'dramatic';
  if (/buồn|đau đớn|sợ hãi|giam cầm|nuốt|vực sâu/i.test(text)) return 'sorrow';
  if (/trí tuệ|tiên tri|lời khuyên|mưu lược/i.test(text)) return 'wise';
  return 'calm';
}

const VALID_ENV_ASSET_IDS = new Set<EnvironmentAssetId>([
  'olympus-pillar',
  'othrys-pillar',
  'primordial-rock',
  'tartarus-rock',
  'crete-cave-wall',
  'sky-clouds',
  'storm-clouds',
  'oceanus-water',
  'olive-tree',
  'sacred-brazier',
  'cosmos-stars',
  'sickle-sky-rift',
  'othrys-throne',
  'omphalos-stone',
  'curetes-shields',
  'elixir-pedestal',
  'twin-mountains',
  'tartarus-gate',
  'cyclopes-forge',
  'boulder-storm',
  'lightning-arcs',
  'olympus-throne',
]);

const LEGACY_KIND_MAP: Record<string, EnvironmentAssetId> = {
  clouds: 'sky-clouds',
  rocks: 'primordial-rock',
  columns: 'olympus-pillar',
  water: 'oceanus-water',
  olive_tree: 'olive-tree',
  brazier: 'sacred-brazier',
  cosmos_stars: 'cosmos-stars',
  sickle_rift: 'sickle-sky-rift',
  othrys_throne: 'othrys-throne',
  omphalos_stone: 'omphalos-stone',
  crete_cave: 'crete-cave-wall',
  twin_peaks: 'twin-mountains',
  tartarus_gate: 'tartarus-gate',
  cyclopes_forge: 'cyclopes-forge',
  boulder_storm: 'boulder-storm',
  lightning_arcs: 'lightning-arcs',
  olympus_throne: 'olympus-throne',
};

export function normalizeEnvironmentAssets(
  rawAssets: unknown,
  text: string,
  atmosphere: ChapterAtmosphere,
  backdrop: SceneBackdrop,
): EnvironmentAssetId[] {
  if (Array.isArray(rawAssets) && rawAssets.length > 0) {
    const out: EnvironmentAssetId[] = [];
    rawAssets.forEach((item) => {
      if (typeof item === 'string' && VALID_ENV_ASSET_IDS.has(item as EnvironmentAssetId)) {
        const id = item as EnvironmentAssetId;
        if (!out.includes(id)) out.push(id);
      } else if (item && typeof item === 'object' && 'kind' in item) {
        const kind = String((item as { kind: unknown }).kind);
        let mapped = LEGACY_KIND_MAP[kind];
        if (kind === 'columns' && atmosphere === 'othrys') mapped = 'othrys-pillar';
        if (kind === 'rocks' && atmosphere === 'tartarus') mapped = 'tartarus-rock';
        if (kind === 'clouds' && (atmosphere === 'othrys' || atmosphere === 'battleground')) {
          mapped = 'storm-clouds';
        }
        if (mapped && !out.includes(mapped)) out.push(mapped);
      }
    });
    if (out.length > 0) return out;
  }
  return inferEnvironmentAssets(text, atmosphere, backdrop);
}

export function inferEnvironmentAssets(
  text: string,
  atmosphere: ChapterAtmosphere,
  backdrop: SceneBackdrop,
): EnvironmentAssetId[] {
  const assets: EnvironmentAssetId[] = [];
  const pushUnique = (id: EnvironmentAssetId) => {
    if (!assets.includes(id)) {
      assets.push(id);
    }
  };

  if (atmosphere === 'primordial') {
    pushUnique('cosmos-stars');
  } else if (atmosphere === 'othrys') {
    pushUnique('othrys-throne');
    pushUnique('othrys-pillar');
  } else if (atmosphere === 'crete') {
    pushUnique('crete-cave-wall');
    pushUnique('olive-tree');
  } else if (atmosphere === 'tartarus') {
    pushUnique('tartarus-gate');
    pushUnique('tartarus-rock');
  } else if (atmosphere === 'battleground') {
    pushUnique('twin-mountains');
    pushUnique('lightning-arcs');
  } else {
    pushUnique('olympus-throne');
    pushUnique('olympus-pillar');
    pushUnique('olive-tree');
  }

  if (/mây|bão|trời|giông/i.test(text) || atmosphere !== 'tartarus') {
    pushUnique(
      /bão|mù|đen|chiến/i.test(text) || atmosphere === 'othrys' || atmosphere === 'battleground'
        ? 'storm-clouds'
        : 'sky-clouds',
    );
  }
  if (/đá|núi|hang|vách|thung lũng/i.test(text) || atmosphere === 'battleground') {
    pushUnique(atmosphere === 'tartarus' ? 'tartarus-rock' : 'primordial-rock');
  }
  if (/biển|nước|sóng|đại dương|poseidon/i.test(text)) {
    pushUnique('oceanus-water');
  }
  if (/đền|cột|cung điện|điện|ngai/i.test(text)) {
    pushUnique(atmosphere === 'othrys' ? 'othrys-pillar' : 'olympus-pillar');
  }
  if (/lửa|lò rèn|đuốc|đài lửa/i.test(text) || backdrop === 'cyclopes_forge') {
    pushUnique('sacred-brazier');
  }
  if (/sấm|sét|chớp/i.test(text)) {
    pushUnique('lightning-arcs');
  }

  return assets;
}

export function parseStoryTextToPages(
  rawText: string,
  defaultLocation: string,
  paragraphsPerPage = 2,
  atmosphere: ChapterAtmosphere = 'olympus',
): StoryPage[] {
  const trimmed = rawText.trim();
  const defaultBackdrop = ATMOSPHERE_DEFAULT_BACKDROP[atmosphere] ?? 'olympus_dawn_throne';

  if (!trimmed) {
    return [
      {
        id: `page_${Date.now()}_0`,
        locationLabel: defaultLocation || 'Đỉnh Olympus',
        mood: 'calm',
        interaction: 'solo',
        backdrop: defaultBackdrop,
        environmentAssets: inferEnvironmentAssets('', atmosphere, defaultBackdrop),
        actors: [{ id: 'zeus', expression: 'serene', role: 'center', motion: 'pace' }],
        featuredProfiles: ['zeus'],
        paragraphs: ['Hãy nhập nội dung câu chuyện của bạn tại Xưởng Soạn Truyện.'],
      },
    ];
  }

  const hasManualDividers = /\n\s*---\s*\n/.test(trimmed);
  const rawChunks = hasManualDividers
    ? trimmed.split(/\n\s*---\s*\n/)
    : (() => {
        const paras = trimmed
          .split(/\n\s*\n+/)
          .map((p) => p.trim())
          .filter(Boolean);
        const groups: string[] = [];
        let current: string[] = [];
        let charCount = 0;

        for (const p of paras) {
          current.push(p);
          charCount += p.length;
          if (current.length >= paragraphsPerPage || charCount >= 640) {
            groups.push(current.join('\n\n'));
            current = [];
            charCount = 0;
          }
        }
        if (current.length > 0) {
          groups.push(current.join('\n\n'));
        }
        return groups;
      })();

  return rawChunks.map((chunk, idx) => {
    const lines = chunk
      .split(/\n\s*\n+/)
      .map((l) => l.trim())
      .filter(Boolean);

    let dialogue: StoryPage['dialogue'] | undefined;
    const paragraphs: string[] = [];

    for (const block of lines) {
      const match = block.match(/^\[Thoại:\s*([^\]]+)\]\s*(.+)$/i);
      if (match) {
        dialogue = {
          speaker: match[1].trim(),
          line: match[2].trim(),
        };
      } else {
        paragraphs.push(block);
      }
    }

    if (paragraphs.length === 0 && dialogue) {
      paragraphs.push(dialogue.line);
      dialogue = undefined;
    }

    const combinedText = paragraphs.join(' ') + ' ' + (dialogue?.line ?? '');
    const detected = detectActorsInText(combinedText);
    if (dialogue) {
      dialogue = {
        ...dialogue,
        speakerId: resolveSpeakerId(dialogue.speaker, detected.actors),
      };
    }

    return {
      id: `custom_p_${Date.now()}_${idx}`,
      locationLabel: `${defaultLocation || 'Hy Lạp Cổ Đại'} · Cảnh ${idx + 1}`,
      mood: inferMood(combinedText),
      interaction: inferInteraction(combinedText, detected.actors.length),
      backdrop: defaultBackdrop,
      environmentAssets: inferEnvironmentAssets(combinedText, atmosphere, defaultBackdrop),
      actors: detected.actors,
      featuredProfiles: detected.featuredProfiles,
      paragraphs,
      dialogue,
    };
  });
}

export function createChapterFromRawText(params: {
  id?: string;
  numberRoman: string;
  title: string;
  subtitle: string;
  atmosphere: ChapterAtmosphere;
  locationLabel: string;
  rawText: string;
  paragraphsPerPage: number;
}): Chapter {
  const pages = parseStoryTextToPages(
    params.rawText,
    params.locationLabel,
    params.paragraphsPerPage,
    params.atmosphere,
  );
  const firstLines = pages[0]?.paragraphs[0] ?? '';
  const summary =
    firstLines.length > 140 ? `${firstLines.slice(0, 140).trim()}...` : firstLines;

  return {
    id: params.id ?? `custom_ch_${Date.now()}`,
    numberRoman: params.numberRoman.trim() || 'Chương Riêng',
    title: params.title.trim() || 'Huyền Thoại Tự Soạn',
    subtitle: params.subtitle.trim() || 'Truyện Kể Của Bạn',
    atmosphere: params.atmosphere,
    summary,
    pages,
  };
}
