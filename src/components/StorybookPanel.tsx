import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Square,
  Play,
} from 'lucide-react';
import type { Chapter, StoryPage } from '../data/myths';
import {
  CHARACTER_PROFILES,
  type ProfileCharacterId,
} from '../data/characters';
import type { StageCharacterId } from '../three/MythStage';
import { AnimatedStoryScene } from './AnimatedStoryScene';

interface StorybookPanelProps {
  chapter: Chapter;
  page: StoryPage;
  pageIndex: number;
  totalPages: number;
  canGoPrev: boolean;
  activeSpeakerId: StageCharacterId | null;
  autoVoice: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
  onOpenCodex: (charId: ProfileCharacterId) => void;
  onToggleAutoVoice: () => void;
  onSpeakDialogue: () => void;
  onStopDialogue: () => void;
  onReplayAction: () => void;
}

export const StorybookPanel: React.FC<StorybookPanelProps> = ({
  chapter,
  page,
  pageIndex,
  totalPages,
  canGoPrev,
  activeSpeakerId,
  autoVoice,
  onPrevPage,
  onNextPage,
  onOpenCodex,
  onToggleAutoVoice,
  onSpeakDialogue,
  onStopDialogue,
  onReplayAction,
}) => {
  const fullText = page.paragraphs.join('\n\n');
  const [visibleChars, setVisibleChars] = useState(0);
  const proseScrollRef = React.useRef<HTMLDivElement | null>(null);
  const isRevealed = visibleChars >= fullText.length;

  useEffect(() => {
    if (proseScrollRef.current) {
      proseScrollRef.current.scrollTop = 0;
    }

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setVisibleChars(fullText.length);
      return;
    }

    setVisibleChars(0);
    const interval = window.setInterval(() => {
      setVisibleChars((prev) => {
        if (prev >= fullText.length) {
          window.clearInterval(interval);
          return prev;
        }
        return Math.min(fullText.length, prev + 7);
      });
    }, 14);

    return () => window.clearInterval(interval);
  }, [page.id, fullText]);

  const handleAdvanceAction = () => {
    if (!isRevealed) {
      setVisibleChars(fullText.length);
    } else {
      onNextPage();
    }
  };

  // Space / Enter / ArrowRight either finishes text reveal or turns to next page; ArrowLeft turns back
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space' || e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault();
        if (!isRevealed) {
          setVisibleChars(fullText.length);
        } else {
          onNextPage();
        }
      } else if (e.key === 'ArrowLeft' && canGoPrev) {
        e.preventDefault();
        onPrevPage();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isRevealed, fullText.length, onNextPage, onPrevPage, canGoPrev]);

  const revealedParagraphs = fullText
    .slice(0, visibleChars)
    .split('\n\n')
    .filter(Boolean);

  const isLastPageOfChapter = pageIndex === totalPages - 1;

  const getProfileName = (id: ProfileCharacterId) =>
    CHARACTER_PROFILES.find((p) => p.id === id)?.name ?? id;

  return (
    <aside
      aria-label="Trang sách truyện thần thoại"
      className="pointer-events-auto flex h-full w-full flex-col overflow-hidden rounded-xl border border-[#b08a4f]/55 bg-[#f8f2e4]/96 text-[#1e1914] shadow-2xl md:w-[510px] lg:w-[560px]"
    >
      {/* Book Chapter Header */}
      <div className="flex items-center justify-between gap-3 border-b border-[#b08a4f]/25 px-5 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-[#735d42]">
            <span className="font-semibold text-[#8c5214]">
              {chapter.numberRoman}
            </span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{chapter.title}</span>
          </div>
          <p className="mt-0.5 text-xs font-semibold text-[#3f3124] truncate">
            {page.locationLabel}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleAutoVoice}
            title={autoVoice ? 'Tắt tự động đọc thoại' : 'Bật tự động đọc thoại'}
            className={`flex items-center gap-1 whitespace-nowrap rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors ${
              autoVoice
                ? 'border-[#b08a4f]/55 bg-[#e6d5b1] text-[#5c3309]'
                : 'border-[#b08a4f]/30 bg-transparent text-[#735d42] hover:bg-[#efe6d2]'
            }`}
          >
            {autoVoice ? (
              <Volume2 className="h-3.5 w-3.5 text-[#8c5214]" />
            ) : (
              <VolumeX className="h-3.5 w-3.5" />
            )}
            Thoại
          </button>

          <button
            type="button"
            onClick={() => onOpenCodex(page.featuredProfiles[0] ?? 'zeus')}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-md border border-[#b08a4f]/40 bg-[#efe6d2] px-3 py-1.5 text-xs font-medium text-[#2c2218] transition-colors hover:bg-[#e4d6ba]"
          >
            <BookOpen className="h-3.5 w-3.5 text-[#9a6715]" />
            Character Bible
          </button>
        </div>
      </div>

      {/* Animated Picture-Book Scene */}
      <div className="border-b border-[#b08a4f]/20 bg-[#f2ead7]/70 px-5 pt-4 pb-3">
        <AnimatedStoryScene
          atmosphere={chapter.atmosphere}
          backdrop={page.backdrop}
          environmentAssets={page.environmentAssets}
          actors={page.actors}
          interaction={page.interaction}
          mood={page.mood}
          activeSpeakerId={activeSpeakerId}
          actionCue={page.dialogue?.actionCue}
        />

        {/* Quiet typographic character profile links for figures in this scene */}
        <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#6a563d]">
          <span>Nhân vật trong cảnh:</span>
          {page.featuredProfiles.map((pid, idx) => (
            <React.Fragment key={pid}>
              <button
                type="button"
                onClick={() => onOpenCodex(pid)}
                className="font-semibold text-[#8c5214] underline decoration-[#b08a4f]/50 underline-offset-2 transition-colors hover:text-[#5c3309]"
              >
                {getProfileName(pid)}
              </button>
              {idx < page.featuredProfiles.length - 1 && (
                <span aria-hidden="true">·</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Literary Storybook Prose & Character Dialogue */}
      <div
        ref={proseScrollRef}
        className="parchment-scroll flex-1 overflow-y-auto px-6 py-4 cursor-pointer"
        onClick={() => {
          if (!isRevealed) setVisibleChars(fullText.length);
        }}
        title={isRevealed ? undefined : 'Nhấn vào trang sách để hiện trọn đoạn'}
      >
        <div className="space-y-3.5 font-prose text-[15.5px] leading-[1.76] text-[#261f18]">
          {revealedParagraphs.map((para, idx) => (
            <p
              key={`${page.id}-p-${idx}`}
              className={
                idx === 0
                  ? 'first-letter:font-display first-letter:float-left first-letter:mr-2.5 first-letter:text-4xl first-letter:font-bold first-letter:leading-[0.88] first-letter:text-[#8c5214]'
                  : undefined
              }
            >
              {para}
            </p>
          ))}
        </div>

        {/* Character Dialogue & Scene Action Block */}
        {page.dialogue && (isRevealed || activeSpeakerId !== null) && (
          <div
            className={`mt-4 rounded-lg border px-4 py-3 transition-colors duration-200 ${
              activeSpeakerId !== null
                ? 'border-[#b08a4f] bg-[#efe1c2] shadow-sm'
                : 'border-[#b08a4f]/35 bg-[#efe6d2]/85'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <p className="font-display text-sm font-bold text-[#8c5214]">
                  {page.dialogue.speaker}
                </p>
                {activeSpeakerId !== null && (
                  <span className="text-[11px] font-medium text-[#9a6715]">
                    · Đang nói...
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {activeSpeakerId !== null ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStopDialogue();
                    }}
                    className="flex items-center gap-1 rounded border border-[#b08a4f]/45 bg-[#f8f2e4] px-2.5 py-1 text-[11px] font-medium text-[#5c3309] transition-colors hover:bg-[#e8dcc4]"
                  >
                    <Square className="h-3 w-3" />
                    Dừng
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSpeakDialogue();
                    }}
                    className="flex items-center gap-1 rounded border border-[#b08a4f]/45 bg-[#f8f2e4] px-2.5 py-1 text-[11px] font-medium text-[#5c3309] transition-colors hover:bg-[#e8dcc4]"
                  >
                    <Volume2 className="h-3 w-3 text-[#8c5214]" />
                    Đọc thoại
                  </button>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReplayAction();
                  }}
                  className="flex items-center gap-1 rounded border border-[#b08a4f]/35 bg-[#f8f2e4]/75 px-2.5 py-1 text-[11px] font-medium text-[#4a3928] transition-colors hover:bg-[#e8dcc4]"
                >
                  <Play className="h-3 w-3 text-[#8c5214]" />
                  Diễn cảnh
                </button>
              </div>
            </div>

            <p className="mt-1.5 font-prose text-[14.5px] italic leading-relaxed text-[#2c2218]">
              {page.dialogue.line}
            </p>
            {page.dialogue.actionCue && (
              <p className="mt-1.5 text-[11.5px] leading-snug text-[#6a563d]">
                Hành động: {page.dialogue.actionCue}
              </p>
            )}
          </div>
        )}

        {/* Chapter Relic Unlocked Notice */}
        {isRevealed && page.relicUnlocked && (
          <div className="mt-4 rounded-lg border border-[#b08a4f]/45 bg-[#efe6d1] p-3.5">
            <div className="flex items-start gap-2.5">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#9a6715]" />
              <div>
                <p className="font-display text-base font-bold text-[#1e1914]">
                  Cổ vật chương: {page.relicUnlocked.name}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-[#5c4a35]">
                  {page.relicUnlocked.epithet}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pure Book Page Navigation (Prev / Page Counter / Next) */}
      <div className="flex items-center justify-between gap-3 border-t border-[#b08a4f]/25 bg-[#f2ead7]/90 px-5 py-3.5">
        <button
          type="button"
          disabled={!canGoPrev}
          onClick={onPrevPage}
          className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-3.5 py-2.5 text-sm font-medium transition-colors duration-150 ${
            canGoPrev
              ? 'border-[#b08a4f]/45 bg-[#efe6d2] text-[#2c2218] hover:bg-[#e2d4b8]'
              : 'cursor-not-allowed border-[#b08a4f]/15 bg-transparent text-[#a3947e]'
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
          Trang trước
        </button>

        <span className="font-tabular text-xs font-medium text-[#6b5740]">
          Trang {pageIndex + 1} / {totalPages}
        </span>

        <button
          type="button"
          onClick={handleAdvanceAction}
          className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#2a2118] px-5 py-2.5 text-sm font-medium text-[#f8f2e4] shadow-sm transition-colors duration-150 hover:bg-[#3f3124]"
        >
          <span>
            {!isRevealed
              ? 'Đọc tiếp'
              : isLastPageOfChapter
                ? 'Hết chương'
                : 'Trang tiếp'}
          </span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
};
