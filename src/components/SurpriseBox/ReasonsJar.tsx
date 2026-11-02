import React, { useState } from 'react';
import { Heart, Sparkles, Shuffle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ReasonToLove } from '../../types/birthday';
import { sounds } from '../../utils/soundEffects';

interface ReasonsJarProps {
  reasons: ReasonToLove[];
  recipientName: string;
}

export const ReasonsJar: React.FC<ReasonsJarProps> = ({ reasons, recipientName }) => {
  const [selectedReason, setSelectedReason] = useState<ReasonToLove | null>(null);
  const [readReasons, setReadReasons] = useState<Set<string>>(new Set());

  const handleSelect = (r: ReasonToLove) => {
    sounds.playSparkle();
    setSelectedReason(r);
    setReadReasons((prev) => new Set(prev).add(r.id));
  };

  const handleRandom = () => {
    if (reasons.length === 0) return;
    const randomIdx = Math.floor(Math.random() * reasons.length);
    handleSelect(reasons[randomIdx]);
  };

  const handleNext = () => {
    if (!selectedReason || reasons.length === 0) return;
    const currentIdx = reasons.findIndex((r) => r.id === selectedReason.id);
    const nextIdx = (currentIdx + 1) % reasons.length;
    handleSelect(reasons[nextIdx]);
  };

  const handlePrev = () => {
    if (!selectedReason || reasons.length === 0) return;
    const currentIdx = reasons.findIndex((r) => r.id === selectedReason.id);
    const prevIdx = (currentIdx - 1 + reasons.length) % reasons.length;
    handleSelect(reasons[prevIdx]);
  };

  return (
    <div className="relative bg-stone-900/90 rounded-2xl border border-stone-800 p-6 sm:p-8">
      {/* Jar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>Handwritten Origami Jar</span>
          </div>
          <h3 className="font-serif-display text-2xl font-bold text-white">
            Little Reasons Why I Adore You
          </h3>
          <p className="text-stone-400 text-xs sm:text-sm mt-1">
            {readReasons.size} of {reasons.length} notes unfolded so far
          </p>
        </div>

        <button
          onClick={handleRandom}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors w-fit"
        >
          <Shuffle className="w-3.5 h-3.5 text-rose-400" />
          <span>Pick a Random Star</span>
        </button>
      </div>

      {/* Floating Glass Jar Visual Container */}
      <div className="relative rounded-2xl bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 border-2 border-stone-800/80 p-8 min-h-[320px] flex flex-wrap items-center justify-center gap-4 shadow-inner overflow-hidden">
        {/* Soft magical fairy light glow behind jar */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(76,5,25,0.25),transparent_70%)] pointer-events-none" />

        {reasons.map((r, idx) => {
          const isRead = readReasons.has(r.id);
          return (
            <button
              key={r.id}
              onClick={() => handleSelect(r)}
              title={`Read Reason #${idx + 1}`}
              className={`group relative p-3 sm:p-4 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer flex flex-col items-center justify-center ${
                isRead
                  ? 'bg-stone-800/60 border border-stone-700/60 text-rose-200/70'
                  : 'bg-rose-950/50 border border-rose-800/80 text-rose-100 shadow-lg shadow-rose-950/40 animate-[bounce_4s_infinite_ease-in-out]'
              }`}
              style={{
                animationDelay: `${(idx % 5) * 0.4}s`,
              }}
            >
              <span className="text-xl sm:text-2xl mb-1 group-hover:scale-125 transition-transform">
                {r.emoji || '✨'}
              </span>
              <span className="text-[11px] font-mono font-medium text-stone-300">
                #{idx + 1}
              </span>
            </button>
          );
        })}
      </div>

      {/* Expanded Note Modal */}
      {selectedReason && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedReason(null)}
        >
          <div
            className="relative max-w-md w-full bg-[#fdfbf7] text-stone-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-amber-200 animate-[fadeIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedReason(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-600 transition-colors"
              aria-label="Close note"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Reason #{selectedReason.number || 1} of {reasons.length}</span>
            </div>

            <h4 className="font-serif-display text-xl sm:text-2xl font-bold text-stone-900 mb-3 leading-snug">
              {selectedReason.reason}
            </h4>

            {selectedReason.details && (
              <p className="font-editorial italic text-stone-700 text-base leading-relaxed mb-6">
                "{selectedReason.details}"
              </p>
            )}

            <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-stone-500 font-handwriting text-xl">
                <span>With all my love, always</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrev}
                  className="p-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 transition-colors"
                  aria-label="Previous reason"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 transition-colors"
                  aria-label="Next reason"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
