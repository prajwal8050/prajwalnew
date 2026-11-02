import React, { useState } from 'react';
import { Heart, Sparkles, X } from 'lucide-react';
import { LoveLetter } from '../../types/birthday';
import { sounds } from '../../utils/soundEffects';

interface LoveLetterModalProps {
  letter: LoveLetter;
  recipientName: string;
  senderName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const LoveLetterModal: React.FC<LoveLetterModalProps> = ({
  letter,
  recipientName,
  senderName,
  isOpen,
  onClose,
}) => {
  const [isSealBroken, setIsSealBroken] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleBreakSeal = () => {
    sounds.playEnvelopePop();
    sounds.playSparkle();
    setIsSealBroken(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full my-8 bg-[#fdfbf7] text-stone-900 rounded-xl shadow-2xl p-6 sm:p-10 border border-amber-200/50 transition-all duration-500"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundImage:
            'radial-gradient(#e5e7eb 0.75px, transparent 0.75px), radial-gradient(#e5e7eb 0.75px, #fdfbf7 0.75px)',
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0, 15px 15px',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 transition-colors"
          aria-label="Close letter"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSealBroken ? (
          /* Sealed Envelope State */
          <div className="py-12 sm:py-16 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-rose-600 fill-rose-600/30" />
            </div>

            <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
              A Confidential Letter for {recipientName}
            </h3>
            <p className="text-stone-600 text-sm max-w-sm mb-8 font-light">
              Sealed with affection, waiting for your touch on January 23rd.
            </p>

            {/* Wax Seal Button */}
            <button
              onClick={handleBreakSeal}
              className="relative group p-6 rounded-full cursor-pointer transition-transform hover:scale-105 active:scale-95"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #e11d48, #9f1239, #4c0519)',
                boxShadow: '0 10px 25px -5px rgba(190, 18, 60, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.4)',
              }}
            >
              <div className="w-20 h-20 rounded-full border-2 border-rose-300/40 flex flex-col items-center justify-center text-white">
                <Heart className="w-6 h-6 fill-white text-white mb-1" />
                <span className="text-[10px] uppercase font-bold tracking-widest">Break Seal</span>
              </div>
            </button>
            <span className="text-xs text-rose-700/80 mt-4 flex items-center gap-1 font-medium">
              <Sparkles className="w-3.5 h-3.5" /> Tap the wax seal to unfold
            </span>
          </div>
        ) : (
          /* Unfolded Letter State */
          <div className="animate-[fadeIn_0.6s_ease-out]">
            {/* Header / Date */}
            <div className="flex justify-between items-start border-b border-stone-200 pb-4 mb-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-rose-700 font-semibold">
                  Personal Birthday Epistle
                </span>
                <h3 className="font-serif-display text-2xl font-bold text-stone-900 mt-0.5">
                  {letter.salutation || `My Dearest ${recipientName},`}
                </h3>
              </div>
              <div className="text-right text-xs text-stone-500 font-serif">
                {letter.dateStamp || 'January 23rd'}
              </div>
            </div>

            {/* Letter Body */}
            <div className="space-y-4 text-stone-800 text-base sm:text-lg leading-relaxed font-editorial">
              {letter.opening && (
                <p className="font-medium text-stone-900 italic">
                  {letter.opening}
                </p>
              )}

              {letter.paragraphs.map((p, idx) => (
                <p key={idx} className="indent-4">
                  {p}
                </p>
              ))}
            </div>

            {/* Closing & Signature */}
            <div className="mt-8 pt-6 border-t border-stone-200/60 flex flex-col items-end">
              <p className="text-sm font-editorial italic text-stone-600 mb-1">
                {letter.closing || 'Forever and always yours,'}
              </p>
              <div className="font-handwriting text-3xl sm:text-4xl text-rose-800 font-bold">
                {letter.senderSignature || senderName || 'Your Love'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
