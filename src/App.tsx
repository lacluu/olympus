import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Volume2,
  VolumeX,
  Eye,
  BookOpen,
  List,
  ChevronUp,
  ChevronDown,
  PenTool,
} from 'lucide-react';
import { CHAPTERS, type Chapter, type SceneActor } from './data/myths';
import { CHARACTER_PROFILES, type ProfileCharacterId } from './data/characters';
import { MythStage, type StageCharacterId, type StageViewMode } from './three/MythStage';
import { lyreAudio } from './audio/lyreAudio';
import { voiceEngine } from './audio/voiceEngine';
import { normalizeEnvironmentAssets, resolveSpeakerId } from './utils/storyParser';
import { StorybookPanel } from './components/StorybookPanel';
import { CharacterCodexModal } from './components/CharacterCodexModal';
import { StoryEditorModal } from './components/StoryEditorModal';
import {
  ChapterSummaryModal,
  PauseModal,
  VictoryModal,
} from './components/GameModals';

type GameState =
  | 'TITLE_MENU'
  | 'PLAYING'
  | 'PAUSED'
  | 'CHAPTER_SUMMARY'
  | 'GAME_OVER';

const STORAGE_KEY = 'titanomachy_custom_chapters_v1';
const VALID_CHARACTER_IDS = new Set<string>(CHARACTER_PROFILES.map((p) => p.id));

function normalizeCharacterId(rawId: unknown): StageCharacterId | null {
  if (typeof rawId !== 'string') return null;
  if (rawId === 'cyclopes') return 'brontes';
  if (rawId === 'hecatoncheires') return 'briareus';
  return VALID_CHARACTER_IDS.has(rawId) ? (rawId as StageCharacterId) : null;
}

function loadCustomChapters(): Chapter[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (ch): ch is Chapter =>
          Boolean(ch) &&
          Array.isArray(ch.pages) &&
          ch.pages.length > 0 &&
          ch.pages.every(
            (p: unknown) =>
              Boolean(p) &&
              typeof p === 'object' &&
              p !== null &&
              'backdrop' in p &&
              Array.isArray((p as { actors?: unknown[] }).actors) &&
              ((p as { actors?: unknown[] }).actors?.length ?? 0) > 0,
          ),
      )
      .map((ch) => ({
        ...ch,
        pages: ch.pages.map((p) => {
          const normalizedActors: SceneActor[] = p.actors
            .map((a): SceneActor | null => {
              const id = normalizeCharacterId((a as { id?: unknown }).id);
              if (!id) return null;
              return { ...a, id };
            })
            .filter((a): a is SceneActor => a !== null);

          const safeActors: SceneActor[] =
            normalizedActors.length > 0
              ? normalizedActors
              : [{ id: 'zeus', expression: 'serene', role: 'center', motion: 'pace' }];

          const normalizedProfiles = Array.isArray(p.featuredProfiles)
            ? p.featuredProfiles
                .map((id) => normalizeCharacterId(id))
                .filter((id): id is ProfileCharacterId => id !== null)
            : [];

          const safeProfiles: ProfileCharacterId[] =
            normalizedProfiles.length > 0
              ? Array.from(new Set(normalizedProfiles))
              : Array.from(new Set(safeActors.map((a) => a.id as ProfileCharacterId)));

          const safeEnvironmentAssets = normalizeEnvironmentAssets(
            p.environmentAssets,
            Array.isArray(p.paragraphs) ? p.paragraphs.join(' ') : '',
            ch.atmosphere ?? 'olympus',
            p.backdrop,
          );

          return {
            ...p,
            environmentAssets: safeEnvironmentAssets,
            actors: safeActors,
            featuredProfiles: safeProfiles,
          };
        }),
      }));
  } catch {
    return [];
  }
}

export default function App() {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<MythStage | null>(null);

  const [customChapters, setCustomChapters] = useState<Chapter[]>(() =>
    typeof window !== 'undefined' ? loadCustomChapters() : [],
  );

  const allChapters = useMemo(
    () => [...CHAPTERS, ...customChapters],
    [customChapters],
  );

  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [chapterIdx, setChapterIdx] = useState(0);
  const [pageIdx, setPageIdx] = useState(0);
  const [relics, setRelics] = useState<
    Array<{ id: string; name: string; epithet: string }>
  >([]);

  const [cinemaMode, setCinemaMode] = useState(false);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [muted, setMuted] = useState(false);
  const [autoVoice, setAutoVoice] = useState(true);
  const [activeSpeakerId, setActiveSpeakerId] = useState<StageCharacterId | null>(null);
  const [codexOpen, setCodexOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [codexCharId, setCodexCharId] = useState<ProfileCharacterId>('zeus');
  const [contextLost, setContextLost] = useState(false);

  const safeChapterIdx = Math.min(chapterIdx, allChapters.length - 1);
  const chapter = allChapters[safeChapterIdx];
  const currentPage = chapter.pages[pageIdx] ?? chapter.pages[0];

  const handleSaveCustomChapters = useCallback((next: Chapter[]) => {
    setCustomChapters(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage quota errors silently
    }
  }, []);

  // Mount Three.js stage once in isolated container
  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    const stage = new MythStage(mount, (lost) => setContextLost(lost));
    stageRef.current = stage;

    return () => {
      stage.dispose();
      stageRef.current = null;
    };
  }, []);

  // Sync 3D interacting characters, atmosphere, and camera mode with current book page
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let viewMode: StageViewMode = 'READING';
    if (gameState === 'TITLE_MENU') {
      viewMode = 'TITLE';
    } else if (cinemaMode || gameState === 'GAME_OVER') {
      viewMode = 'CINEMA';
    }

    stage.setScene(
      currentPage.actors,
      currentPage.backdrop,
      chapter.atmosphere,
      viewMode,
      currentPage.interaction,
      currentPage.environmentAssets,
    );
  }, [
    gameState,
    cinemaMode,
    currentPage.actors,
    currentPage.backdrop,
    currentPage.interaction,
    currentPage.environmentAssets,
    chapter.atmosphere,
  ]);

  useEffect(() => {
    stageRef.current?.setActiveSpeaker(activeSpeakerId);
  }, [activeSpeakerId]);

  const stopDialogueVoice = useCallback(() => {
    voiceEngine.stop();
    setActiveSpeakerId(null);
  }, []);

  const speakDialogueForPage = useCallback(
    (pageToSpeak = currentPage) => {
      if (!pageToSpeak.dialogue || muted) return;
      const speakerId =
        pageToSpeak.dialogue.speakerId ??
        resolveSpeakerId(pageToSpeak.dialogue.speaker, pageToSpeak.actors);
      const speakerActor = pageToSpeak.actors.find((a) => a.id === speakerId);
      stageRef.current?.triggerSceneAction();
      voiceEngine.speak({
        speakerId,
        line: pageToSpeak.dialogue.line,
        variant: speakerActor?.variant,
        onStart: (id) => setActiveSpeakerId(id),
        onEnd: () => setActiveSpeakerId(null),
      });
    },
    [currentPage, muted],
  );

  const handleReplaySceneAction = useCallback(() => {
    stageRef.current?.triggerSceneAction();
    if (!muted && currentPage.dialogue) {
      speakDialogueForPage(currentPage);
    }
  }, [muted, currentPage, speakDialogueForPage]);

  // Trigger scene action choreography & automatic character voice when entering or turning a page
  useEffect(() => {
    if (gameState !== 'PLAYING' || editorOpen) {
      stopDialogueVoice();
      return;
    }

    stageRef.current?.triggerSceneAction();
    if (autoVoice && !muted && currentPage.dialogue) {
      speakDialogueForPage(currentPage);
    } else {
      stopDialogueVoice();
    }
  }, [
    gameState,
    editorOpen,
    currentPage.id,
    autoVoice,
    muted,
    speakDialogueForPage,
    stopDialogueVoice,
    currentPage,
  ]);

  useEffect(() => {
    return () => {
      voiceEngine.stop();
    };
  }, []);

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      lyreAudio.setMuted(next);
      voiceEngine.setMuted(next);
      if (next) {
        setActiveSpeakerId(null);
      }
      return next;
    });
  }, []);

  const startBookAtChapter = useCallback(
    (startChapter = 0) => {
      const clamped = Math.max(0, Math.min(startChapter, allChapters.length - 1));
      const target = allChapters[clamped];
      setChapterIdx(clamped);
      setPageIdx(0);
      setCinemaMode(false);
      setGameState('PLAYING');
      lyreAudio.playChapterChord(target.atmosphere);
    },
    [allChapters],
  );

  const handleReadCustomChapterById = useCallback(
    (chapterId: string) => {
      const idx = allChapters.findIndex((c) => c.id === chapterId);
      if (idx >= 0) {
        startBookAtChapter(idx);
      }
    },
    [allChapters, startBookAtChapter],
  );

  const handleRestartFullBook = useCallback(() => {
    setRelics([]);
    startBookAtChapter(0);
  }, [startBookAtChapter]);

  const handlePrevPage = useCallback(() => {
    if (pageIdx > 0) {
      lyreAudio.playPageTurn();
      setPageIdx((p) => p - 1);
    } else if (safeChapterIdx > 0) {
      const prevChapIdx = safeChapterIdx - 1;
      const prevChap = allChapters[prevChapIdx];
      lyreAudio.playPageTurn();
      setChapterIdx(prevChapIdx);
      setPageIdx(prevChap.pages.length - 1);
    }
  }, [pageIdx, safeChapterIdx, allChapters]);

  const handleNextPage = useCallback(() => {
    lyreAudio.playPageTurn();
    stageRef.current?.triggerReaction();

    if (pageIdx + 1 < chapter.pages.length) {
      const nextPage = chapter.pages[pageIdx + 1];
      setPageIdx(pageIdx + 1);
      if (nextPage.relicUnlocked) {
        const awarded = nextPage.relicUnlocked;
        setRelics((prev) =>
          prev.some((r) => r.id === awarded.id) ? prev : [...prev, awarded],
        );
        window.setTimeout(() => lyreAudio.playRelicFanfare(), 240);
      }
    } else {
      if (currentPage.relicUnlocked) {
        const awarded = currentPage.relicUnlocked;
        setRelics((prev) =>
          prev.some((r) => r.id === awarded.id) ? prev : [...prev, awarded],
        );
      }
      lyreAudio.playRelicFanfare();
      setGameState('CHAPTER_SUMMARY');
    }
  }, [pageIdx, chapter.pages, currentPage.relicUnlocked]);

  const handleNextChapter = useCallback(() => {
    if (safeChapterIdx + 1 < allChapters.length) {
      startBookAtChapter(safeChapterIdx + 1);
    } else {
      setGameState('GAME_OVER');
      lyreAudio.playRelicFanfare();
    }
  }, [safeChapterIdx, allChapters.length, startBookAtChapter]);

  const openCodexFor = useCallback((charId: ProfileCharacterId) => {
    setCodexCharId(charId);
    setCodexOpen(true);
  }, []);

  // Global keyboard shortcuts (disabled while StoryEditorModal is open so typing works cleanly)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (editorOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setEditorOpen(false);
        }
        return;
      }

      if (codexOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setCodexOpen(false);
        }
        return;
      }

      if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        toggleMute();
        return;
      }

      if (gameState === 'TITLE_MENU') {
        if (e.key === 'Enter' || e.code === 'Space') {
          e.preventDefault();
          startBookAtChapter(safeChapterIdx);
        }
        return;
      }

      if (gameState === 'PLAYING') {
        if (e.key === 'Escape') {
          e.preventDefault();
          setGameState('PAUSED');
          return;
        }
        if (e.key.toLowerCase() === 'h') {
          e.preventDefault();
          setCinemaMode((prev) => !prev);
          return;
        }
      } else if (gameState === 'PAUSED' && e.key === 'Escape') {
        e.preventDefault();
        setGameState('PLAYING');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    gameState,
    codexOpen,
    editorOpen,
    safeChapterIdx,
    toggleMute,
    startBookAtChapter,
  ]);

  const canGoPrev = safeChapterIdx > 0 || pageIdx > 0;
  const lastPageOfChapter = chapter.pages[chapter.pages.length - 1];

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#120f0c]">
      {/* Isolated Full-Bleed Three.js 3D Living Stage */}
      <div
        ref={canvasMountRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      />

      {/* WebGL Context Lost Fallback Banner */}
      {contextLost && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#18130f]/95 p-6 text-center text-[#f5efe4]">
          <div className="max-w-md space-y-3">
            <h2 className="font-display text-2xl font-bold">
              Không gian 3D đang tạm khôi phục
            </h2>
            <p className="text-sm text-[#d6c9b4]">
              Trình duyệt vừa tạm ngắt ngữ cảnh đồ họa. Vui lòng đợi giây lát hoặc tải lại trang nếu cần.
            </p>
          </div>
        </div>
      )}

      {/* TITLE SCREEN */}
      {gameState === 'TITLE_MENU' && (
        <div className="relative z-10 flex h-full w-full items-center">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(14,11,9,0.92) 0%, rgba(14,11,9,0.68) 44%, rgba(14,11,9,0.12) 100%)',
            }}
          />

          <div className="relative z-10 flex max-w-xl flex-col justify-center px-7 py-10 md:px-14">
            <div className="mb-4 flex items-center gap-3 text-[#e0b863]">
              <svg
                width="42"
                height="26"
                viewBox="0 0 42 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M2 22 C8 14, 14 8, 21 4 C28 8, 34 14, 40 22"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M9 21 C14 15, 17 11, 21 8 C25 11, 28 15, 33 21"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeOpacity="0.65"
                />
                <circle cx="21" cy="4" r="2.2" fill="currentColor" />
              </svg>
              <span className="font-display text-sm tracking-[0.22em] uppercase text-[#e0b863]">
                Sử Thi Thần Thoại Hy Lạp · 6 Chương · 22 Cảnh
              </span>
            </div>

            <h1 className="font-display text-5xl font-bold leading-[1.04] tracking-tight text-[#f8f2e4] md:text-6xl [text-wrap:balance]">
              The Titanomachy
            </h1>
            <p className="mt-2 font-display text-xl font-semibold text-[#e0b863]">
              Đại Chiến Thần Linh — Zeus Và Sự Sụp Đổ Của Các Titan
            </p>

            <p className="mt-3 max-w-md font-prose text-base leading-relaxed text-[#d9cebc]">
              Theo dõi trọn vẹn 22 cảnh truyện theo trình tự thời gian từ thuở Gaia và Uranus nguyên thủy đến ngày Zeus lên ngôi Vua Olympus, cùng hồ sơ tạo hình Character Bible chi tiết.
            </p>

            {/* Chapter quick selector (6 Chapters / 22 Scenes + custom chapters) */}
            <div className="mt-5">
              <p className="text-xs font-medium text-[#b5a388]">
                Chọn chương để mở sách ({allChapters.length} chương)
              </p>
              <div className="parchment-scroll mt-2 grid max-h-48 grid-cols-2 gap-2 overflow-y-auto pr-1">
                {allChapters.map((ch, idx) => {
                  const selected = idx === safeChapterIdx;
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => {
                        setChapterIdx(idx);
                        setPageIdx(0);
                      }}
                      className={`rounded-lg border px-3 py-2 text-left transition-colors duration-150 ${
                        selected
                          ? 'border-[#e0b863] bg-[#e0b863]/16 text-[#f8f2e4]'
                          : 'border-[#f8f2e4]/18 bg-[#1c1713]/75 text-[#c9bc9f] hover:border-[#e0b863]/55 hover:text-[#f8f2e4]'
                      }`}
                    >
                      <span className="block text-[11px] font-medium text-[#e0b863]">
                        {ch.numberRoman} · {ch.pages.length} cảnh
                      </span>
                      <span className="block truncate font-display text-base font-semibold">
                        {ch.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => startBookAtChapter(safeChapterIdx)}
                className="whitespace-nowrap rounded-lg bg-[#e0b863] px-5 py-3 text-sm font-semibold text-[#1a140f] shadow-lg transition-colors duration-150 hover:bg-[#ecc97c] focus-visible:outline-2 focus-visible:outline-[#f8f2e4]"
              >
                Mở Sách Đọc Truyện
              </button>

              <button
                type="button"
                onClick={() => openCodexFor('zeus')}
                className="flex items-center gap-2 whitespace-nowrap rounded-lg border border-[#e0b863]/55 bg-[#251d16] px-4 py-3 text-sm font-medium text-[#f8f2e4] transition-colors duration-150 hover:bg-[#33271e]"
              >
                <BookOpen className="h-4 w-4 text-[#e0b863]" />
                Character Bible
              </button>

              <button
                type="button"
                onClick={() => setEditorOpen(true)}
                className="flex items-center gap-2 whitespace-nowrap rounded-lg border border-[#f8f2e4]/25 bg-[#1b1612]/80 px-4 py-3 text-sm font-medium text-[#f8f2e4] transition-colors duration-150 hover:border-[#e0b863]/60"
              >
                <PenTool className="h-4 w-4 text-[#e0b863]" />
                Soạn Thêm
              </button>

              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? 'Bật âm thanh' : 'Tắt âm thanh'}
                className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#f8f2e4]/20 bg-[#1b1612]/80 text-[#e8dcc6] transition-colors hover:border-[#e0b863]/60"
              >
                {muted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
            </div>

            <p className="mt-6 text-xs text-[#a3947e]">
              Enter / Space Bắt đầu · Phím ← / → Lật trang · H Ngắm cảnh 3D · M Âm thanh · Esc Mục lục
            </p>
          </div>
        </div>
      )}

      {/* ACTIVE STORYBOOK PLAY HUD */}
      {gameState !== 'TITLE_MENU' && (
        <div className="pointer-events-none relative z-10 flex h-full w-full flex-col justify-between p-4 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="pointer-events-auto rounded-lg border border-[#e0b863]/30 bg-[#18130f]/82 px-4 py-2 text-[#f5efe4]">
              <p className="text-xs font-medium text-[#e0b863]">
                {chapter.numberRoman} · {chapter.subtitle}
              </p>
              <p className="font-display text-lg font-bold leading-tight">
                {chapter.title}
              </p>
            </div>

            {cinemaMode && (
              <button
                type="button"
                onClick={() => setCinemaMode(false)}
                className="pointer-events-auto flex items-center gap-2 whitespace-nowrap rounded-lg border border-[#e0b863]/50 bg-[#18130f]/88 px-4 py-2.5 text-sm font-medium text-[#f8f2e4] shadow-lg transition-colors hover:bg-[#2a2118]"
              >
                <BookOpen className="h-4 w-4 text-[#e0b863]" />
                Mở lại trang sách (H)
              </button>
            )}
          </div>

          {/* Right-hand Linear Storybook Page */}
          {!cinemaMode && gameState === 'PLAYING' && !editorOpen && (
            <div className="pointer-events-none fixed inset-y-4 right-4 z-20 flex max-w-[calc(100vw-2rem)] items-center md:inset-y-6 md:right-6">
              <StorybookPanel
                chapter={chapter}
                page={currentPage}
                pageIndex={pageIdx}
                totalPages={chapter.pages.length}
                canGoPrev={canGoPrev}
                activeSpeakerId={activeSpeakerId}
                autoVoice={autoVoice}
                onPrevPage={handlePrevPage}
                onNextPage={handleNextPage}
                onOpenCodex={openCodexFor}
                onToggleAutoVoice={() => setAutoVoice((prev) => !prev)}
                onSpeakDialogue={() => speakDialogueForPage(currentPage)}
                onStopDialogue={stopDialogueVoice}
                onReplayAction={handleReplaySceneAction}
              />
            </div>
          )}

          {/* Bottom-Left Compact Collapsible Control Dock */}
          <div className="pointer-events-auto self-start">
            <button
              type="button"
              onClick={() => setDockCollapsed((p) => !p)}
              className="mb-1.5 flex items-center gap-1.5 rounded-md border border-[#e0b863]/30 bg-[#18130f]/85 px-2.5 py-1 text-xs text-[#dcd0bc] transition-colors hover:text-[#f8f2e4]"
            >
              {dockCollapsed ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5" />
                  Hiện bảng điều khiển
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5" />
                  Thu gọn
                </>
              )}
            </button>

            {!dockCollapsed && (
              <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-[#e0b863]/35 bg-[#18130f]/90 p-1.5 text-xs text-[#f5efe4] shadow-lg">
                <button
                  type="button"
                  onClick={() => setEditorOpen(true)}
                  className="flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-2 font-medium text-[#e0b863] transition-colors hover:bg-[#2b221a]"
                >
                  <PenTool className="h-3.5 w-3.5" />
                  Soạn truyện
                </button>

                <button
                  type="button"
                  onClick={() => setCinemaMode((p) => !p)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-2 font-medium transition-colors ${
                    cinemaMode
                      ? 'bg-[#e0b863] text-[#1a140f]'
                      : 'text-[#e8dcc6] hover:bg-[#2b221a]'
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  {cinemaMode ? 'Đang ngắm 3D' : 'Ngắm 3D (H)'}
                </button>

                <button
                  type="button"
                  onClick={() => openCodexFor(currentPage.featuredProfiles[0] ?? 'zeus')}
                  className="flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-2 font-medium text-[#e8dcc6] transition-colors hover:bg-[#2b221a]"
                >
                  <BookOpen className="h-3.5 w-3.5 text-[#e0b863]" />
                  Hồ Sơ
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  className="flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-2 font-medium text-[#e8dcc6] transition-colors hover:bg-[#2b221a]"
                >
                  {muted ? (
                    <VolumeX className="h-3.5 w-3.5 text-[#c78b62]" />
                  ) : (
                    <Volume2 className="h-3.5 w-3.5 text-[#e0b863]" />
                  )}
                  {muted ? 'Bật nhạc' : 'Đàn Lia'}
                </button>

                <button
                  type="button"
                  onClick={() => setGameState('PAUSED')}
                  className="flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-2 font-medium text-[#e8dcc6] transition-colors hover:bg-[#2b221a]"
                >
                  <List className="h-3.5 w-3.5" />
                  Mục lục
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODALS */}
      <PauseModal
        open={gameState === 'PAUSED'}
        chapter={chapter}
        allChapters={allChapters}
        currentChapterIdx={safeChapterIdx}
        onResume={() => setGameState('PLAYING')}
        onOpenCodex={() => openCodexFor(currentPage.featuredProfiles[0] ?? 'zeus')}
        onOpenEditor={() => {
          setGameState('PLAYING');
          setEditorOpen(true);
        }}
        onSelectChapter={(idx) => startBookAtChapter(idx)}
        onReturnTitle={() => {
          setCinemaMode(false);
          setGameState('TITLE_MENU');
        }}
      />

      <ChapterSummaryModal
        open={gameState === 'CHAPTER_SUMMARY'}
        chapter={chapter}
        lastPage={lastPageOfChapter}
        hasNextChapter={safeChapterIdx + 1 < allChapters.length}
        onNextChapter={handleNextChapter}
        onReplayChapter={() => startBookAtChapter(safeChapterIdx)}
      />

      <VictoryModal
        open={gameState === 'GAME_OVER'}
        relics={relics}
        onPlayAgain={handleRestartFullBook}
        onOpenCodex={() => openCodexFor('zeus')}
      />

      <CharacterCodexModal
        open={codexOpen}
        selectedId={codexCharId}
        onSelectId={(id) => setCodexCharId(id)}
        onClose={() => setCodexOpen(false)}
      />

      <StoryEditorModal
        open={editorOpen}
        customChapters={customChapters}
        onSaveChapters={handleSaveCustomChapters}
        onReadChapter={handleReadCustomChapterById}
        onClose={() => setEditorOpen(false)}
      />
    </div>
  );
}
