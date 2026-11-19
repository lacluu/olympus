import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Sparkles,
  Users,
  Palette,
  Shield,
  Eye,
} from 'lucide-react';
import {
  CHARACTER_PROFILES,
  type ProfileCharacterId,
  type ZeusVariant,
} from '../data/characters';
import { AnimatedCharacterPlate } from './AnimatedCharacterPlate';

interface CharacterCodexModalProps {
  open: boolean;
  selectedId: ProfileCharacterId;
  onSelectId: (id: ProfileCharacterId) => void;
  onClose: () => void;
}

export const CharacterCodexModal: React.FC<CharacterCodexModalProps> = ({
  open,
  selectedId,
  onSelectId,
  onClose,
}) => {
  const [zeusVariant, setZeusVariant] = useState<ZeusVariant>('warrior');

  if (!open) return null;

  const profile =
    CHARACTER_PROFILES.find((p) => p.id === selectedId) ?? CHARACTER_PROFILES[0];
  const activeVariantSpec = profile.variants?.find((v) => v.id === zeusVariant);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/78 p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Hồ sơ thiết kế nhân vật — Character Bible"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-[#b08a4f]/55 bg-[#f7f1e3] text-[#1e1914] shadow-2xl">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-4 border-b border-[#b08a4f]/25 px-6 py-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <BookOpen className="h-5 w-5 text-[#9a6715] shrink-0" />
            <div className="min-w-0">
              <h2 className="font-display text-2xl font-bold tracking-tight text-[#1e1914] truncate">
                Phần II — Character Bible ({CHARACTER_PROFILES.length} Nhân Vật)
              </h2>
              <p className="text-xs text-[#6b5740] truncate">
                Thiết kế tạo hình chuyển thể và tiểu sử chư thần trong Đại Chiến Titanomachy
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#b08a4f]/30 text-[#4a3c2d] transition-colors hover:bg-[#e8dec8] focus-visible:outline-2 focus-visible:outline-[#9a6715]"
            aria-label="Đóng hồ sơ"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Character Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-[#b08a4f]/20 bg-[#efe7d4] px-6 py-2.5">
          {CHARACTER_PROFILES.map((item) => {
            const active = item.id === profile.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectId(item.id)}
                className={`whitespace-nowrap shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
                  active
                    ? 'bg-[#2a2118] text-[#f7f1e3] shadow-sm'
                    : 'text-[#5a4936] hover:bg-[#e3d7be] hover:text-[#1e1914]'
                }`}
              >
                <span className="font-tabular text-[11px] opacity-70 mr-1.5">
                  {item.code}
                </span>
                {item.name}
              </button>
            );
          })}
        </div>

        {/* Profile Detail Body */}
        <div className="parchment-scroll flex-1 overflow-y-auto px-6 py-6 md:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
            {/* Animated Character Portrait & Color Palette Swatches */}
            <div className="flex flex-col items-center md:items-start shrink-0 md:w-56">
              <AnimatedCharacterPlate
                character={profile.id}
                variant={profile.id === 'zeus' ? zeusVariant : undefined}
                mood="wise"
                size="large"
              />

              {/* Zeus Version Switcher (CHILD / YOUNG / WARRIOR / KING) */}
              {profile.variants && profile.variants.length > 0 && (
                <div className="mt-3 w-full space-y-2">
                  <p className="text-[11px] font-semibold text-[#8c5214]">
                    Các phiên bản tạo hình:
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {profile.variants.map((v) => {
                      const active = v.id === zeusVariant;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setZeusVariant(v.id)}
                          className={`rounded border px-2 py-1 text-[11px] font-tabular font-medium transition-colors ${
                            active
                              ? 'border-[#8c5214] bg-[#2a2118] text-[#f7f1e3]'
                              : 'border-[#b08a4f]/35 bg-[#efe7d4] text-[#4a3b2a] hover:bg-[#e5d8bd]'
                          }`}
                        >
                          {v.label}
                        </button>
                      );
                    })}
                  </div>
                  {activeVariantSpec && (
                    <p className="text-xs leading-relaxed text-[#5a4936]">
                      {activeVariantSpec.description}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-3 w-full text-center md:text-left">
                <p className="text-xs font-semibold text-[#8c5214]">
                  {profile.roleGroup}
                </p>
                <p className="mt-0.5 text-xs text-[#6b5740]">
                  {profile.chapterAppearance}
                </p>
                <p className="mt-0.5 text-xs text-[#6b5740]">{profile.realm}</p>
              </div>

              {/* Character Color Palette */}
              <div className="mt-4 w-full rounded-lg border border-[#b08a4f]/30 bg-[#efe7d4] p-3">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-[#4a3b2a]">
                  <Palette className="h-3.5 w-3.5 text-[#9a6715]" />
                  Bảng màu thiết kế
                </p>
                <div className="mt-2 space-y-1.5">
                  {profile.palette.map((sw) => (
                    <div
                      key={sw.name}
                      className="flex items-center gap-2 text-xs text-[#3b2f23]"
                    >
                      <span
                        className="h-3.5 w-3.5 shrink-0 rounded-sm border border-black/20"
                        style={{ backgroundColor: sw.hex }}
                      />
                      <span className="truncate">{sw.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Profile Information */}
            <div className="flex-1 min-w-0 space-y-5">
              <div>
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="font-tabular text-xs font-semibold tracking-wider text-[#8c5214]">
                    {profile.code}
                  </span>
                  <h3 className="font-display text-3xl font-bold tracking-tight text-[#1e1914]">
                    {profile.name}
                  </h3>
                  <span className="font-display text-lg italic text-[#8a6322]">
                    {profile.greekName}
                  </span>
                </div>
                <p className="mt-1 text-base font-semibold text-[#9a5514]">
                  {profile.title}
                </p>
                <p className="mt-1 text-xs text-[#6b5740]">{profile.lineage}</p>
              </div>

              {/* PHẦN II — VISUAL & PERSONALITY DESIGN GRID */}
              <div className="border-t border-[#b08a4f]/25 pt-4">
                <h4 className="flex items-center gap-2 font-display text-lg font-bold text-[#1e1914]">
                  <Eye className="h-4 w-4 text-[#9a6715]" />
                  Thiết kế tạo hình & Tính cách
                </h4>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-[#b08a4f]/25 bg-[#f2ebd9] p-3">
                    <p className="text-xs font-semibold text-[#8c5214]">
                      Ngoại hình tổng thể
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-[#2f271f]">
                      {profile.appearance}
                    </p>
                  </div>

                  <div className="rounded-lg border border-[#b08a4f]/25 bg-[#f2ebd9] p-3">
                    <p className="text-xs font-semibold text-[#8c5214]">
                      Khuôn mặt & Ánh nhìn
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-[#2f271f]">
                      {profile.face}
                    </p>
                  </div>

                  <div className="rounded-lg border border-[#b08a4f]/25 bg-[#f2ebd9] p-3">
                    <p className="text-xs font-semibold text-[#8c5214]">
                      Mái tóc & Diện mạo
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-[#2f271f]">
                      {profile.hair}
                    </p>
                  </div>

                  <div className="rounded-lg border border-[#b08a4f]/25 bg-[#f2ebd9] p-3">
                    <p className="text-xs font-semibold text-[#8c5214]">
                      Trang phục
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-[#2f271f]">
                      {profile.attire}
                    </p>
                  </div>

                  <div className="rounded-lg border border-[#b08a4f]/25 bg-[#f2ebd9] p-3">
                    <p className="text-xs font-semibold text-[#8c5214]">
                      Vũ khí & Bảo vật
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-[#2f271f]">
                      {profile.weaponOrArtifact}
                    </p>
                  </div>

                  <div className="rounded-lg border border-[#b08a4f]/25 bg-[#f2ebd9] p-3">
                    <p className="text-xs font-semibold text-[#8c5214]">
                      Tính cách
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-[#2f271f]">
                      {profile.personality}
                    </p>
                  </div>

                  <div className="rounded-lg border border-[#b08a4f]/25 bg-[#f2ebd9] p-3">
                    <p className="text-xs font-semibold text-[#8c5214]">
                      Đặc điểm nhận diện
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-[#2f271f]">
                      {profile.distinctiveTraits}
                    </p>
                  </div>
                </div>
              </div>

              {/* BIOGRAPHY */}
              <div className="border-t border-[#b08a4f]/25 pt-4">
                <h4 className="flex items-center gap-2 font-display text-lg font-bold text-[#1e1914]">
                  <Shield className="h-4 w-4 text-[#9a6715]" />
                  Tóm tắt tiểu sử
                </h4>
                <p className="mt-1.5 text-[15px] leading-relaxed text-[#2f271f]">
                  {profile.biography}
                </p>
              </div>

              {/* POWERS */}
              <div className="border-t border-[#b08a4f]/25 pt-4">
                <h4 className="flex items-center gap-2 font-display text-lg font-bold text-[#1e1914]">
                  <Sparkles className="h-4 w-4 text-[#9a6715]" />
                  Sức mạnh & Vai trò trong Titanomachy
                </h4>
                <p className="mt-1.5 text-[15px] leading-relaxed text-[#2f271f]">
                  {profile.powersAndRole}
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#6b5740]">
                  <span className="font-semibold text-[#4a3b2a]">Biểu tượng:</span>
                  {profile.sacredSymbols.map((sym, idx) => (
                    <React.Fragment key={sym}>
                      <span>{sym}</span>
                      {idx < profile.sacredSymbols.length - 1 && (
                        <span aria-hidden="true">·</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* RELATED FIGURES */}
              <div className="border-t border-[#b08a4f]/25 pt-4">
                <h4 className="flex items-center gap-2 font-display text-lg font-bold text-[#1e1914]">
                  <Users className="h-4 w-4 text-[#9a6715]" />
                  Các vị thần & Nhân vật liên quan
                </h4>
                <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {profile.relatedFigures.map((rel) =>
                    rel.profileId ? (
                      <button
                        key={rel.name}
                        type="button"
                        onClick={() => onSelectId(rel.profileId!)}
                        className="flex items-center justify-between rounded-lg border border-[#b08a4f]/30 bg-[#efe7d4] px-3 py-2 text-left transition-colors hover:bg-[#e5d8bd]"
                      >
                        <span className="text-sm font-semibold text-[#1e1914]">
                          {rel.name}
                        </span>
                        <span className="text-xs text-[#6b5740]">
                          {rel.relation}
                        </span>
                      </button>
                    ) : (
                      <div
                        key={rel.name}
                        className="flex items-center justify-between rounded-lg border border-[#b08a4f]/20 bg-[#f2ebd9] px-3 py-2"
                      >
                        <span className="text-sm font-medium text-[#2f271f]">
                          {rel.name}
                        </span>
                        <span className="text-xs text-[#6b5740]">
                          {rel.relation}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
