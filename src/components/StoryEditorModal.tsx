import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  BookOpen,
  Wand2,
  Check,
  FileText,
  Sliders,
} from 'lucide-react';
import type {
  Chapter,
  ChapterAtmosphere,
  CharacterExpression,
  SceneActor,
  SceneInteraction,
  StoryPage,
} from '../data/myths';
import type { StageCharacterId } from '../three/MythStage';
import type { ProfileCharacterId } from '../data/characters';
import {
  ATMOSPHERE_DEFAULT_BACKDROP,
  createChapterFromRawText,
  inferEnvironmentAssets,
} from '../utils/storyParser';

interface StoryEditorModalProps {
  open: boolean;
  customChapters: Chapter[];
  onSaveChapters: (chapters: Chapter[]) => void;
  onReadChapter: (chapterId: string) => void;
  onClose: () => void;
}

const CHARACTER_OPTIONS: Array<{
  id: StageCharacterId;
  label: string;
  hasProfile: ProfileCharacterId;
}> = [
  { id: 'zeus', label: 'Zeus', hasProfile: 'zeus' },
  { id: 'cronus', label: 'Cronus', hasProfile: 'cronus' },
  { id: 'rhea', label: 'Rhea', hasProfile: 'rhea' },
  { id: 'gaia', label: 'Gaia', hasProfile: 'gaia' },
  { id: 'uranus', label: 'Uranus', hasProfile: 'uranus' },
  { id: 'metis', label: 'Metis', hasProfile: 'metis' },
  { id: 'poseidon', label: 'Poseidon', hasProfile: 'poseidon' },
  { id: 'hades', label: 'Hades', hasProfile: 'hades' },
  { id: 'hera', label: 'Hera', hasProfile: 'hera' },
  { id: 'demeter', label: 'Demeter', hasProfile: 'demeter' },
  { id: 'hestia', label: 'Hestia', hasProfile: 'hestia' },
  { id: 'brontes', label: 'Brontes (Cyclopes)', hasProfile: 'brontes' },
  { id: 'steropes', label: 'Steropes (Cyclopes)', hasProfile: 'steropes' },
  { id: 'arges', label: 'Arges (Cyclopes)', hasProfile: 'arges' },
  { id: 'cottus', label: 'Cottus (Hecatoncheires)', hasProfile: 'cottus' },
  { id: 'briareus', label: 'Briareus (Hecatoncheires)', hasProfile: 'briareus' },
  { id: 'gyges', label: 'Gyges (Hecatoncheires)', hasProfile: 'gyges' },
  { id: 'campe', label: 'Campe', hasProfile: 'campe' },
  { id: 'prometheus', label: 'Prometheus', hasProfile: 'prometheus' },
  { id: 'amalthea', label: 'Amalthea', hasProfile: 'amalthea' },
  { id: 'curetes', label: 'Curetes', hasProfile: 'curetes' },
];

const ATMOSPHERE_OPTIONS: Array<{ id: ChapterAtmosphere; label: string }> = [
  { id: 'primordial', label: 'Kỷ Nguyên Nguyên Thủy (Đêm sao & Đất Mẹ)' },
  { id: 'othrys', label: 'Thành Lũy Núi Othrys (Mây bão & Đồng đen)' },
  { id: 'crete', label: 'Đảo Crete & Hang Đá Núi Ida (Nắng ấm)' },
  { id: 'tartarus', label: 'Vực Sâu Tartarus (Bóng tối & Xiềng xích)' },
  { id: 'battleground', label: 'Chiến Trường Đại Chiến (Sét & Mưa đá)' },
  { id: 'olympus', label: 'Đỉnh Olympus (Cẩm thạch & Vinh quang)' },
];

const INTERACTION_OPTIONS: Array<{ id: SceneInteraction; label: string }> = [
  { id: 'solo', label: 'Đứng một mình' },
  { id: 'converse', label: 'Đối thoại / Bàn mưu' },
  { id: 'gift', label: 'Trao thánh khí / Thảo dược' },
  { id: 'confront', label: 'Đối đầu trực diện' },
  { id: 'nurture', label: 'Che chở / Nuôi dưỡng' },
  { id: 'imprison', label: 'Giam cầm / Xiềng xích' },
  { id: 'battle', label: 'Giao chiến quyết liệt' },
  { id: 'triumph', label: 'Chiến thắng & Lên ngôi' },
];

const SAMPLE_LONG_STORY = `Trên đỉnh núi Olympus rực ánh bình minh, Zeus nâng cao Tia Sét Vàng vừa được ba anh em Cyclopes rèn tặng. Bên cạnh ngài, Poseidon nắm chặt cây Đinh Ba uy nghiêm còn Hades đội Chiếc Mũ Tàng Hình lặng lẽ quan sát chiến tuyến núi Othrys phía xa.

[Thoại: Zeus] «Mười năm chiến tranh đã đủ để thử thách lòng kiên định của chúng ta. Hôm nay, kỷ nguyên của các Titan sẽ khép lại!»

---

Dưới thung lũng Thessaly, các Hecatoncheires trăm tay vung lên những khối đá khổng lồ khiến cả bầu trời rung chuyển, mở đường cho cuộc tổng tiến công cuối cùng của chư thần Olympus.`;

export const StoryEditorModal: React.FC<StoryEditorModalProps> = ({
  open,
  customChapters,
  onSaveChapters,
  onReadChapter,
  onClose,
}) => {
  const [tab, setTab] = useState<'paste' | 'manage'>('paste');

  const [numberRoman, setNumberRoman] = useState('Ngoại Truyện');
  const [title, setTitle] = useState('Chương Truyện Của Tôi');
  const [subtitle, setSubtitle] = useState('Biên Niên Sử Tự Soạn');
  const [locationLabel, setLocationLabel] = useState('Đỉnh Olympus');
  const [atmosphere, setAtmosphere] = useState<ChapterAtmosphere>('olympus');
  const [paragraphsPerPage, setParagraphsPerPage] = useState(2);
  const [rawText, setRawText] = useState(SAMPLE_LONG_STORY);

  const [editingChapterId, setEditingChapterId] = useState<string | null>(
    customChapters[0]?.id ?? null,
  );
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  if (!open) return null;

  const editingChapter =
    customChapters.find((c) => c.id === editingChapterId) ??
    customChapters[0] ??
    null;

  const handleGenerateChapter = () => {
    const newChapter = createChapterFromRawText({
      numberRoman,
      title,
      subtitle,
      atmosphere,
      locationLabel,
      rawText,
      paragraphsPerPage,
    });
    const next = [...customChapters, newChapter];
    onSaveChapters(next);
    setEditingChapterId(newChapter.id);
    setStatusMsg(
      `Đã tạo "${newChapter.title}" gồm ${newChapter.pages.length} cảnh minh họa chuyển động!`,
    );
    setTab('manage');
  };

  const handleUpdatePage = (
    chapterId: string,
    pageIdx: number,
    patch: Partial<StoryPage>,
  ) => {
    const next = customChapters.map((ch) => {
      if (ch.id !== chapterId) return ch;
      const updatedPages = ch.pages.map((p, idx) => {
        if (idx !== pageIdx) return p;
        const merged = { ...p, ...patch };
        const profiles: ProfileCharacterId[] = [];
        merged.actors.forEach((a) => {
          const opt = CHARACTER_OPTIONS.find((o) => o.id === a.id);
          if (opt && !profiles.includes(opt.hasProfile)) {
            profiles.push(opt.hasProfile);
          }
        });
        merged.featuredProfiles = profiles;
        return merged;
      });
      return { ...ch, pages: updatedPages };
    });
    onSaveChapters(next);
  };

  const handleUpdateActorSlot = (
    chapterId: string,
    pageIdx: number,
    slotIdx: number,
    actorId: StageCharacterId | '',
    expression?: CharacterExpression,
  ) => {
    const targetChapter = customChapters.find((c) => c.id === chapterId);
    const page = targetChapter?.pages[pageIdx];
    if (!page) return;
    const nextActors: SceneActor[] = [...page.actors];

    if (actorId === '') {
      if (nextActors.length > 1 && slotIdx < nextActors.length) {
        nextActors.splice(slotIdx, 1);
      }
    } else if (slotIdx < nextActors.length) {
      nextActors[slotIdx] = {
        ...nextActors[slotIdx],
        id: actorId,
        expression: expression ?? nextActors[slotIdx].expression,
      };
    } else {
      nextActors.push({
        id: actorId,
        expression: expression ?? 'serene',
        role: slotIdx === 1 ? 'right' : slotIdx === 2 ? 'back-left' : 'back-right',
        motion: 'advance',
      });
    }

    handleUpdatePage(chapterId, pageIdx, { actors: nextActors });
  };

  const handleAddBlankPage = (chapterId: string) => {
    const next = customChapters.map((ch) => {
      if (ch.id !== chapterId) return ch;
      const backdrop = ATMOSPHERE_DEFAULT_BACKDROP[ch.atmosphere] ?? 'olympus_dawn_throne';
      const newPage: StoryPage = {
        id: `custom_p_${Date.now()}`,
        locationLabel: `${ch.title} · Cảnh ${ch.pages.length + 1}`,
        mood: 'calm',
        interaction: 'converse',
        backdrop,
        environmentAssets: inferEnvironmentAssets('', ch.atmosphere, backdrop),
        actors: [
          { id: 'zeus', expression: 'serene', role: 'left', motion: 'advance' },
          { id: 'hera', expression: 'serene', role: 'right', motion: 'advance' },
        ],
        featuredProfiles: ['zeus', 'hera'],
        paragraphs: ['Viết tiếp diễn biến mới của câu chuyện tại đây...'],
      };
      return { ...ch, pages: [...ch.pages, newPage] };
    });
    onSaveChapters(next);
  };

  const handleDeletePage = (chapterId: string, pageIdx: number) => {
    const next = customChapters.map((ch) => {
      if (ch.id !== chapterId || ch.pages.length <= 1) return ch;
      return {
        ...ch,
        pages: ch.pages.filter((_, idx) => idx !== pageIdx),
      };
    });
    onSaveChapters(next);
  };

  const handleDeleteChapter = (chapterId: string) => {
    const next = customChapters.filter((c) => c.id !== chapterId);
    onSaveChapters(next);
    if (editingChapterId === chapterId) {
      setEditingChapterId(next[0]?.id ?? null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/78 p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Xưởng Soạn Truyện Của Bạn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-[#b08a4f]/55 bg-[#f8f2e4] text-[#1e1914] shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-[#b08a4f]/25 px-6 py-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <FileText className="h-5 w-5 text-[#9a6715] shrink-0" />
            <div className="min-w-0">
              <h2 className="font-display text-2xl font-bold leading-tight text-[#1e1914] truncate">
                Xưởng Soạn Truyện Mở Rộng
              </h2>
              <p className="text-xs text-[#6a563d] truncate">
                Dán thêm ngoại truyện hoặc kịch bản của bạn để dựng thành cảnh sách chuyển động 2D & 3D
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#b08a4f]/30 text-[#4a3c2d] transition-colors hover:bg-[#e8dec8]"
            aria-label="Đóng xưởng soạn truyện"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 border-b border-[#b08a4f]/20 bg-[#efe7d4] px-6 py-2.5">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setTab('paste')}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
                tab === 'paste'
                  ? 'bg-[#2a2118] text-[#f8f2e4]'
                  : 'text-[#5a4936] hover:bg-[#e3d7be]'
              }`}
            >
              <Wand2 className="h-4 w-4" />
              Dán văn bản dài (Tự chia cảnh)
            </button>

            <button
              type="button"
              onClick={() => setTab('manage')}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
                tab === 'manage'
                  ? 'bg-[#2a2118] text-[#f8f2e4]'
                  : 'text-[#5a4936] hover:bg-[#e3d7be]'
              }`}
            >
              <Sliders className="h-4 w-4" />
              Chỉnh từng cảnh & nhân vật ({customChapters.length})
            </button>
          </div>

          {statusMsg && (
            <span className="hidden items-center gap-1.5 text-xs font-medium text-[#7c4d0e] md:flex">
              <Check className="h-3.5 w-3.5" />
              {statusMsg}
            </span>
          )}
        </div>

        <div className="parchment-scroll flex-1 overflow-y-auto px-6 py-5">
          {tab === 'paste' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <div>
                  <label className="block text-xs font-semibold text-[#5d4a35]">
                    Số chương / Nhãn
                  </label>
                  <input
                    type="text"
                    value={numberRoman}
                    onChange={(e) => setNumberRoman(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#b08a4f]/40 bg-[#fbf7ee] px-3 py-2 text-sm text-[#1e1914] focus:border-[#8c5214] focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[#5d4a35]">
                    Tên câu chuyện
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#b08a4f]/40 bg-[#fbf7ee] px-3 py-2 text-sm text-[#1e1914] focus:border-[#8c5214] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#5d4a35]">
                    Phụ đề ngắn
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#b08a4f]/40 bg-[#fbf7ee] px-3 py-2 text-sm text-[#1e1914] focus:border-[#8c5214] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-[#5d4a35]">
                    Bối cảnh không gian 3D
                  </label>
                  <select
                    value={atmosphere}
                    onChange={(e) =>
                      setAtmosphere(e.target.value as ChapterAtmosphere)
                    }
                    className="mt-1 w-full rounded-lg border border-[#b08a4f]/40 bg-[#fbf7ee] px-3 py-2 text-sm text-[#1e1914] focus:border-[#8c5214] focus:outline-none"
                  >
                    {ATMOSPHERE_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5d4a35]">
                    Tên địa điểm mặc định
                  </label>
                  <input
                    type="text"
                    value={locationLabel}
                    onChange={(e) => setLocationLabel(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#b08a4f]/40 bg-[#fbf7ee] px-3 py-2 text-sm text-[#1e1914] focus:border-[#8c5214] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#5d4a35]">
                    Số đoạn văn mỗi cảnh
                  </label>
                  <select
                    value={paragraphsPerPage}
                    onChange={(e) =>
                      setParagraphsPerPage(Number(e.target.value))
                    }
                    className="mt-1 w-full rounded-lg border border-[#b08a4f]/40 bg-[#fbf7ee] px-3 py-2 text-sm text-[#1e1914] focus:border-[#8c5214] focus:outline-none"
                  >
                    <option value={1}>1 đoạn / cảnh (nhiều cảnh)</option>
                    <option value={2}>2 đoạn / cảnh (cân đối)</option>
                    <option value={3}>3 đoạn / cảnh (đọc dài)</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <label className="block text-xs font-semibold text-[#5d4a35]">
                    Nội dung truyện (dán trực tiếp, không giới hạn độ dài)
                  </label>
                  <span className="text-xs text-[#735d42]">
                    Dùng <code className="font-tabular">---</code> để ngắt cảnh, <code className="font-tabular">[Thoại: Tên] lời thoại</code> để tách khung thoại. Tự nhận đủ 21 nhân vật (Zeus, Cronus, Demeter, Hestia, Brontes, Briareus, Prometheus...).
                  </span>
                </div>
                <textarea
                  rows={10}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-[#b08a4f]/45 bg-[#fbf7ee] p-4 font-prose text-sm leading-relaxed text-[#1e1914] focus:border-[#8c5214] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleGenerateChapter}
                  className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-[#2a2118] px-5 py-2.5 text-sm font-medium text-[#f8f2e4] transition-colors hover:bg-[#3f3124]"
                >
                  <Wand2 className="h-4 w-4 text-[#e0b863]" />
                  Tạo Chương Truyện Từ Văn Bản Này
                </button>
              </div>
            </div>
          ) : customChapters.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="font-display text-2xl font-bold text-[#2c2218]">
                Chưa có chương mở rộng nào
              </p>
              <p className="mt-2 max-w-md text-sm text-[#6a563d]">
                Toàn bộ 6 chương (22 cảnh) của The Titanomachy đã sẵn sàng trong sách. Bạn có thể dán thêm ngoại truyện ở tab bên cạnh bất cứ lúc nào.
              </p>
              <button
                type="button"
                onClick={() => setTab('paste')}
                className="mt-5 rounded-lg bg-[#2a2118] px-5 py-2.5 text-sm font-medium text-[#f8f2e4] hover:bg-[#3f3124]"
              >
                Bắt đầu dán văn bản
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#b08a4f]/25 pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  {customChapters.map((ch) => {
                    const active = ch.id === editingChapter?.id;
                    return (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => setEditingChapterId(ch.id)}
                        className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                          active
                            ? 'border-[#8c5214] bg-[#2a2118] text-[#f8f2e4]'
                            : 'border-[#b08a4f]/40 bg-[#efe6d2] text-[#3b2f23] hover:bg-[#e5d8bd]'
                        }`}
                      >
                        {ch.title} ({ch.pages.length} cảnh)
                      </button>
                    );
                  })}
                </div>

                {editingChapter && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onReadChapter(editingChapter.id);
                        onClose();
                      }}
                      className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#8c5214] px-4 py-2 text-sm font-medium text-[#f8f2e4] hover:bg-[#70400d]"
                    >
                      <BookOpen className="h-4 w-4" />
                      Đọc chương này ngay
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteChapter(editingChapter.id)}
                      className="flex items-center gap-1 whitespace-nowrap rounded-lg border border-[#b08a4f]/40 bg-[#efe6d2] px-3 py-2 text-sm font-medium text-[#7f2d22] hover:bg-[#e7d6c8]"
                    >
                      <Trash2 className="h-4 w-4" />
                      Xóa chương
                    </button>
                  </div>
                )}
              </div>

              {editingChapter && (
                <div className="space-y-4">
                  {editingChapter.pages.map((page, pIdx) => (
                    <div
                      key={page.id}
                      className="rounded-xl border border-[#b08a4f]/35 bg-[#fbf7ee] p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-display text-lg font-bold text-[#8c5214]">
                          Cảnh {pIdx + 1}
                        </span>

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={page.locationLabel}
                            onChange={(e) =>
                              handleUpdatePage(editingChapter.id, pIdx, {
                                locationLabel: e.target.value,
                              })
                            }
                            aria-label="Tên cảnh"
                            className="rounded border border-[#b08a4f]/35 bg-[#f8f2e4] px-2.5 py-1 text-xs text-[#2c2218]"
                          />
                          {editingChapter.pages.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                handleDeletePage(editingChapter.id, pIdx)
                              }
                              className="rounded p-1.5 text-[#7f2d22] hover:bg-[#efe2d8]"
                              aria-label="Xóa cảnh này"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-4">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#6a563d]">
                            Nhân vật 1
                          </label>
                          <select
                            value={page.actors[0]?.id ?? 'zeus'}
                            onChange={(e) =>
                              handleUpdateActorSlot(
                                editingChapter.id,
                                pIdx,
                                0,
                                e.target.value as StageCharacterId,
                              )
                            }
                            className="mt-1 w-full rounded border border-[#b08a4f]/35 bg-[#f8f2e4] px-2.5 py-1.5 text-xs"
                          >
                            {CHARACTER_OPTIONS.map((opt) => (
                              <option key={opt.id} value={opt.id}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#6a563d]">
                            Nhân vật 2
                          </label>
                          <select
                            value={page.actors[1]?.id ?? ''}
                            onChange={(e) =>
                              handleUpdateActorSlot(
                                editingChapter.id,
                                pIdx,
                                1,
                                e.target.value
                                  ? (e.target.value as StageCharacterId)
                                  : '',
                              )
                            }
                            className="mt-1 w-full rounded border border-[#b08a4f]/35 bg-[#f8f2e4] px-2.5 py-1.5 text-xs"
                          >
                            <option value="">(Chỉ 1 nhân vật)</option>
                            {CHARACTER_OPTIONS.map((opt) => (
                              <option key={opt.id} value={opt.id}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#6a563d]">
                            Nhân vật 3
                          </label>
                          <select
                            value={page.actors[2]?.id ?? ''}
                            onChange={(e) =>
                              handleUpdateActorSlot(
                                editingChapter.id,
                                pIdx,
                                2,
                                e.target.value
                                  ? (e.target.value as StageCharacterId)
                                  : '',
                              )
                            }
                            className="mt-1 w-full rounded border border-[#b08a4f]/35 bg-[#f8f2e4] px-2.5 py-1.5 text-xs"
                          >
                            <option value="">(Không thêm)</option>
                            {CHARACTER_OPTIONS.map((opt) => (
                              <option key={opt.id} value={opt.id}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[#6a563d]">
                            Kiểu tương tác & chuyển động
                          </label>
                          <select
                            value={page.interaction}
                            onChange={(e) =>
                              handleUpdatePage(editingChapter.id, pIdx, {
                                interaction: e.target.value as SceneInteraction,
                              })
                            }
                            className="mt-1 w-full rounded border border-[#b08a4f]/35 bg-[#f8f2e4] px-2.5 py-1.5 text-xs"
                          >
                            {INTERACTION_OPTIONS.map((opt) => (
                              <option key={opt.id} value={opt.id}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#6a563d]">
                          Văn bản cảnh truyện
                        </label>
                        <textarea
                          rows={4}
                          value={page.paragraphs.join('\n\n')}
                          onChange={(e) =>
                            handleUpdatePage(editingChapter.id, pIdx, {
                              paragraphs: e.target.value
                                .split(/\n\s*\n+/)
                                .map((s) => s.trim())
                                .filter(Boolean),
                            })
                          }
                          className="mt-1 w-full rounded border border-[#b08a4f]/35 bg-[#f8f2e4] p-2.5 font-prose text-sm leading-relaxed text-[#1e1914]"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => handleAddBlankPage(editingChapter.id)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[#b08a4f]/55 bg-[#efe7d4]/60 py-2.5 text-sm font-medium text-[#5d4a35] transition-colors hover:bg-[#e7dcc2]"
                  >
                    <Plus className="h-4 w-4" />
                    Thêm cảnh mới vào chương này
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
