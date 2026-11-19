import React from 'react';
import {
  Play,
  RotateCcw,
  BookOpen,
  Award,
  Home,
  ArrowRight,
} from 'lucide-react';
import { type Chapter, type StoryPage } from '../data/myths';

interface PauseModalProps {
  open: boolean;
  chapter: Chapter;
  allChapters: Chapter[];
  currentChapterIdx: number;
  onResume: () => void;
  onOpenCodex: () => void;
  onOpenEditor: () => void;
  onSelectChapter: (idx: number) => void;
  onReturnTitle: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  open,
  chapter,
  allChapters,
  currentChapterIdx,
  onResume,
  onOpenCodex,
  onOpenEditor,
  onSelectChapter,
  onReturnTitle,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Mục lục & Tạm dừng"
    >
      <div className="w-full max-w-md rounded-xl border border-[#b08a4f]/50 bg-[#f8f2e4] p-6 text-[#1e1914] shadow-2xl">
        <p className="text-xs font-semibold text-[#8c5214]">
          {chapter.numberRoman} · {chapter.title}
        </p>
        <h2 className="mt-1 font-display text-3xl font-bold text-[#1e1914]">
          Mục Lục Cuốn Sách
        </h2>

        {/* Direct chapter jump list */}
        <div className="parchment-scroll mt-4 max-h-52 space-y-1.5 overflow-y-auto pr-1">
          {allChapters.map((ch, idx) => {
            const active = idx === currentChapterIdx;
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => onSelectChapter(idx)}
                className={`flex w-full items-center justify-between rounded-lg border px-3.5 py-2.5 text-left text-sm transition-colors ${
                  active
                    ? 'border-[#8c5214] bg-[#efe2c6] font-semibold text-[#1e1914]'
                    : 'border-[#b08a4f]/30 bg-[#f3ecda] text-[#4a3b2a] hover:bg-[#eae0c7]'
                }`}
              >
                <span className="truncate pr-2">
                  {ch.numberRoman}: {ch.title}
                </span>
                <span className="shrink-0 font-tabular text-xs text-[#7a644a]">
                  {ch.pages.length} trang
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 space-y-2">
          <button
            type="button"
            onClick={onResume}
            className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#2a2118] px-4 py-2.5 text-sm font-medium text-[#f8f2e4] transition-colors hover:bg-[#3f3124]"
          >
            <Play className="h-4 w-4" />
            Tiếp tục đọc
          </button>

          <button
            type="button"
            onClick={onOpenEditor}
            className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[#b08a4f]/45 bg-[#efe6d2] px-4 py-2.5 text-sm font-medium text-[#2c2218] transition-colors hover:bg-[#e5d8bd]"
          >
            <BookOpen className="h-4 w-4 text-[#9a6715]" />
            Soạn truyện từ văn bản của tôi
          </button>

          <button
            type="button"
            onClick={onOpenCodex}
            className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[#b08a4f]/45 bg-[#efe6d2] px-4 py-2.5 text-sm font-medium text-[#2c2218] transition-colors hover:bg-[#e5d8bd]"
          >
            <BookOpen className="h-4 w-4 text-[#9a6715]" />
            Hồ sơ nhân vật thần thoại
          </button>

          <button
            type="button"
            onClick={onReturnTitle}
            className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[#b08a4f]/30 bg-transparent px-4 py-2.5 text-sm font-medium text-[#5e4b36] transition-colors hover:bg-[#ece3cf]"
          >
            <Home className="h-4 w-4" />
            Về trang bìa
          </button>
        </div>
      </div>
    </div>
  );
};

interface ChapterSummaryModalProps {
  open: boolean;
  chapter: Chapter;
  lastPage: StoryPage;
  hasNextChapter: boolean;
  onNextChapter: () => void;
  onReplayChapter: () => void;
}

export const ChapterSummaryModal: React.FC<ChapterSummaryModalProps> = ({
  open,
  chapter,
  lastPage,
  hasNextChapter,
  onNextChapter,
  onReplayChapter,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Khép lại chương"
    >
      <div className="w-full max-w-lg rounded-xl border border-[#b08a4f]/50 bg-[#f8f2e4] p-7 text-[#1e1914] shadow-2xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#8c5214]">
          <Award className="h-4 w-4" />
          <span>Hoàn thành {chapter.numberRoman}</span>
        </div>

        <h2 className="mt-1.5 font-display text-3xl font-bold text-[#1e1914]">
          {chapter.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#4f3f2f]">
          {chapter.summary}
        </p>

        {lastPage.relicUnlocked && (
          <div className="mt-4 rounded-lg border border-[#b08a4f]/40 bg-[#efe6d2] p-4">
            <p className="text-xs font-semibold text-[#8c5214]">
              Kỷ vật thần thoại đã lưu dấu
            </p>
            <p className="mt-0.5 font-display text-xl font-bold text-[#1e1914]">
              {lastPage.relicUnlocked.name}
            </p>
            <p className="mt-1 text-sm text-[#574532]">
              {lastPage.relicUnlocked.epithet}
            </p>
          </div>
        )}

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onReplayChapter}
            className="flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[#b08a4f]/45 bg-[#efe6d2] px-4 py-2.5 text-sm font-medium text-[#2c2218] transition-colors hover:bg-[#e5d8bd]"
          >
            <RotateCcw className="h-4 w-4" />
            Đọc lại chương
          </button>
          <button
            type="button"
            onClick={onNextChapter}
            className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#2a2118] px-4 py-2.5 text-sm font-medium text-[#f8f2e4] transition-colors hover:bg-[#3f3124]"
          >
            <span>
              {hasNextChapter ? 'Mở chương tiếp theo' : 'Khép lại cuốn sách'}
            </span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface VictoryModalProps {
  open: boolean;
  relics: Array<{ id: string; name: string; epithet: string }>;
  onPlayAgain: () => void;
  onOpenCodex: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  open,
  relics,
  onPlayAgain,
  onOpenCodex,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Hoàn thành Biên Niên Sử Olympus"
    >
      <div className="w-full max-w-xl rounded-xl border border-[#b08a4f]/60 bg-[#f8f2e4] p-7 text-[#1e1914] shadow-2xl">
        <p className="text-xs font-semibold text-[#8c5214]">
          Hồi Kết Cuốn Sách · 22 Cảnh Sử Thi
        </p>
        <h2 className="mt-1 font-display text-3xl font-bold text-[#1e1914]">
          Kỷ Nguyên Của Olympus
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#4b3c2c]">
          Bạn đã đọc trọn vẹn 6 chương (22 cảnh) của Đại Chiến Thần Linh — từ thuở Gaia và Uranus nguyên thủy, cuộc trốn chạy đảo Crete, hành trình giải cứu Tartarus đến ngày Zeus lên ngôi Vua Olympus.
        </p>

        <div className="mt-5">
          <p className="text-xs font-semibold text-[#6b5740]">
            Thánh khí & Dấu ấn đã thu thập ({relics.length}/6)
          </p>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {relics.map((r) => (
              <div
                key={r.id}
                className="rounded-lg border border-[#b08a4f]/35 bg-[#efe6d2] px-3 py-2"
              >
                <p className="font-display text-base font-bold text-[#1e1914]">
                  {r.name}
                </p>
                <p className="text-xs text-[#5d4a35]">{r.epithet}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenCodex}
            className="flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[#b08a4f]/45 bg-[#efe6d2] px-4 py-2.5 text-sm font-medium text-[#2c2218] transition-colors hover:bg-[#e5d8bd]"
          >
            <BookOpen className="h-4 w-4 text-[#9a6715]" />
            Character Bible
          </button>
          <button
            type="button"
            onClick={onPlayAgain}
            className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#2a2118] px-4 py-2.5 text-sm font-medium text-[#f8f2e4] transition-colors hover:bg-[#3f3124]"
          >
            <RotateCcw className="h-4 w-4" />
            Đọc lại từ đầu
          </button>
        </div>
      </div>
    </div>
  );
};
