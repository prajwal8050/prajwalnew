import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, RotateCcw, Flame } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface BirthdayCakeProps {
  recipientName: string;
}

export const BirthdayCake: React.FC<BirthdayCakeProps> = ({ recipientName }) => {
  const [candles, setCandles] = useState<boolean[]>([true, true, true, true, true]);
  const [isAllBlown, setIsAllBlown] = useState<boolean>(false);
  const [wishMade, setWishMade] = useState<boolean>(false);

  const blowSingleCandle = (index: number) => {
    if (!candles[index]) return;
    sounds.playCandleBlow();

    const updated = [...candles];
    updated[index] = false;
    setCandles(updated);

    if (updated.every((c) => !c)) {
      triggerAllBlownCelebration();
    }
  };

  const blowAllCandles = () => {
    sounds.playCandleBlow();
    setCandles([false, false, false, false, false]);
    triggerAllBlownCelebration();
  };

  const triggerAllBlownCelebration = () => {
    setIsAllBlown(true);
    setWishMade(true);
    sounds.playCelebrationChime();

    // Trigger fireworks confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fb7185', '#fbbf24', '#f59e0b', '#ffffff'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    }, 250);
  };

  const relightCandles = () => {
    sounds.playSparkle();
    setCandles([true, true, true, true, true]);
    setIsAllBlown(false);
  };

  return (
    <div id="wishes" className="relative bg-stone-900/90 rounded-2xl border border-stone-800 p-6 sm:p-10 text-center overflow-hidden">
      {/* Glow aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Celebration Ritual</span>
      </div>
      <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-white mb-2">
        Make a Wish, {recipientName}
      </h3>
      <p className="text-stone-400 text-xs sm:text-sm max-w-md mx-auto mb-10 font-light">
        Close your eyes, think of the deepest wish in your heart for the coming year, and blow out the candles.
      </p>

      {/* Birthday Cake Illustration & Candles */}
      <div className="relative max-w-xs mx-auto py-8">
        {/* Candle Row */}
        <div className="flex justify-center items-end gap-5 mb-1 relative z-20">
          {candles.map((isLit, idx) => (
            <div
              key={idx}
              onClick={() => blowSingleCandle(idx)}
              className="flex flex-col items-center cursor-pointer group"
              title={isLit ? 'Tap to blow out candle' : 'Candle blown'}
            >
              {/* Flame */}
              {isLit ? (
                <div className="candle-flame w-3.5 h-6 rounded-full bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-100 shadow-[0_0_14px_rgba(251,191,36,0.9)] mb-1 transition-transform group-hover:scale-125" />
              ) : (
                <div className="h-6 flex items-center justify-center mb-1">
                  {/* Subtle smoke wisp */}
                  <div className="w-1 h-3 bg-stone-500/60 rounded-full blur-sm animate-[pulse_1s_ease-out]" />
                </div>
              )}

              {/* Candle Body */}
              <div
                className={`w-3 h-14 rounded-t-sm shadow-md transition-all ${
                  idx % 2 === 0
                    ? 'bg-gradient-to-b from-rose-400 to-rose-600'
                    : 'bg-gradient-to-b from-amber-300 to-amber-500'
                }`}
              >
                {/* Diagonal stripes on candle */}
                <div className="w-full h-full opacity-30 bg-[repeating-linear-gradient(45deg,transparent,transparent_3px,rgba(255,255,255,0.7)_3px,rgba(255,255,255,0.7)_6px)]" />
              </div>
            </div>
          ))}
        </div>

        {/* Cake Tier 1 (Top) */}
        <div className="w-48 h-12 mx-auto bg-gradient-to-r from-rose-100 via-rose-50 to-rose-200 rounded-t-xl shadow-md border-b-2 border-rose-300/60 flex items-center justify-center relative">
          <div className="w-full px-2 flex justify-around">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-sm" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-sm" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
          </div>
        </div>

        {/* Cake Tier 2 (Middle) */}
        <div className="w-64 h-16 mx-auto bg-gradient-to-r from-stone-100 via-amber-50 to-stone-200 rounded-t-xl shadow-lg border-b-2 border-stone-300/80 flex items-center justify-center relative">
          <span className="font-serif-display text-rose-800 text-xs font-semibold tracking-wider uppercase">
            Happy Birthday
          </span>
        </div>

        {/* Cake Tier 3 (Base) */}
        <div className="w-72 h-14 mx-auto bg-gradient-to-r from-rose-200 via-rose-100 to-rose-300 rounded-t-xl shadow-xl flex items-center justify-center relative">
          <div className="w-full px-4 flex justify-between">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          </div>
        </div>

        {/* Cake Platter */}
        <div className="w-80 h-4 mx-auto bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 rounded-full shadow-2xl" />
      </div>

      {/* Celebration Message or Blow Action */}
      <div className="mt-6">
        {!isAllBlown ? (
          <button
            onClick={blowAllCandles}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Flame className="w-4 h-4" />
            <span>Blow Out All Candles</span>
          </button>
        ) : (
          <div className="animate-[fadeIn_0.5s_ease-out] max-w-md mx-auto">
            <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800/80 mb-4">
              <p className="font-serif-display text-lg text-rose-200 font-semibold mb-1">
                Your wish is soaring into the universe! 🌟
              </p>
              <p className="font-editorial text-sm text-stone-300 italic">
                "May your upcoming year be overflowing with laughter, good health, unforgettable journeys, and infinite love."
              </p>
            </div>

            <button
              onClick={relightCandles}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Relight Candles</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
