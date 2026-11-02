import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Gift, Sparkles, Mail, Ticket, Heart, Cake, RotateCcw } from 'lucide-react';
import { BirthdayConfig } from '../../types/birthday';
import { sounds } from '../../utils/soundEffects';
import { LoveLetterModal } from './LoveLetterModal';
import { ScratchCoupon } from './ScratchCoupon';
import { ReasonsJar } from './ReasonsJar';
import { BirthdayCake } from './BirthdayCake';
import giftBoxImg from '../../assets/images/romantic_gift_box_1793613227352.jpg';

interface SurpriseBoxProps {
  config: BirthdayConfig;
  onUpdateConfig: (updated: BirthdayConfig) => void;
}

export const SurpriseBox: React.FC<SurpriseBoxProps> = ({ config, onUpdateConfig }) => {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'letter' | 'coupons' | 'reasons' | 'cake'>('letter');
  const [isLetterModalOpen, setIsLetterModalOpen] = useState<boolean>(false);

  const handleOpenBox = () => {
    setIsOpened(true);
    sounds.playCelebrationChime();

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#e11d48', '#fda4af', '#fbbf24', '#f59e0b', '#ffffff'],
    });
  };

  const handleRedeemCoupon = (couponId: string) => {
    const updatedCoupons = config.surpriseBox.coupons.map((c) =>
      c.id === couponId ? { ...c, isRedeemed: true, isScratched: true } : c
    );
    onUpdateConfig({
      ...config,
      surpriseBox: {
        ...config.surpriseBox,
        coupons: updatedCoupons,
      },
    });
  };

  return (
    <section id="surprise" className="py-24 px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Gift className="w-3.5 h-3.5" />
          <span>The Birthday Gift Box</span>
        </div>
        <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
          Your Digital Surprise Box
        </h2>
        <p className="text-stone-400 text-sm md:text-base mt-3 font-light">
          A bespoke collection of tokens, handwritten promises, redeemable adventures, and birthday joy curated especially for you.
        </p>
      </div>

      {!isOpened ? (
        /* Unopened 3D Gift Box Stage */
        <div className="max-w-md mx-auto text-center">
          <div
            onClick={handleOpenBox}
            className="group relative cursor-pointer p-8 rounded-3xl bg-gradient-to-b from-stone-900 to-stone-950 border border-stone-800 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-rose-800/80 hover:shadow-rose-950/40"
          >
            {/* Soft pulsing back-glow */}
            <div className="absolute inset-0 bg-rose-500/10 rounded-3xl blur-2xl group-hover:bg-rose-500/20 transition-all pointer-events-none" />

            {/* Gift Box Graphic Container */}
            <div className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center">
              <img
                src={config.surpriseBox.boxImageUrl || giftBoxImg}
                alt="Luxury Gift Box"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-2xl shadow-xl transition-transform duration-500 group-hover:scale-105"
              />

              {/* Decorative Tag */}
              <div className="absolute -bottom-3 right-4 bg-stone-900/95 border border-rose-900/60 text-stone-200 px-3 py-1.5 rounded-lg shadow-lg text-left backdrop-blur-md">
                <span className="block text-[9px] uppercase tracking-wider text-stone-400 font-mono">
                  Gift For
                </span>
                <span className="text-xs font-serif-display font-semibold text-rose-300">
                  {config.recipientName}
                </span>
              </div>
            </div>

            {/* Action Prompt */}
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 group-hover:bg-rose-500 text-white font-medium text-sm transition-all shadow-lg shadow-rose-950/60">
              <Sparkles className="w-4 h-4" />
              <span>Tap to Untie & Open Box</span>
            </button>
            <p className="text-[11px] text-stone-500 mt-3 font-mono">
              Carefully packed with love for January 23
            </p>
          </div>
        </div>
      ) : (
        /* Opened Box Experience */
        <div className="animate-[fadeIn_0.5s_ease-out]">
          {/* Box Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 p-1.5 bg-stone-900/90 border border-stone-800 rounded-2xl max-w-xl mx-auto">
            <button
              onClick={() => {
                setActiveTab('letter');
                sounds.playSparkle();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'letter'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Love Letter</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('coupons');
                sounds.playSparkle();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'coupons'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Love Coupons ({config.surpriseBox.coupons.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('reasons');
                sounds.playSparkle();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'reasons'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Reasons Jar ({config.surpriseBox.reasons.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('cake');
                sounds.playSparkle();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'cake'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Cake className="w-3.5 h-3.5" />
              <span>Birthday Cake</span>
            </button>
          </div>

          {/* Compartment Content Panels */}
          {activeTab === 'letter' && (
            <div className="max-w-2xl mx-auto text-center py-6">
              <div className="p-8 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-xl">
                <div className="w-16 h-16 rounded-full bg-rose-950/80 border border-rose-800 flex items-center justify-center mx-auto mb-4 text-rose-400">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="font-serif-display text-2xl font-bold text-white mb-2">
                  A Wax-Sealed Birthday Letter
                </h3>
                <p className="text-stone-400 text-sm mb-6 max-w-md mx-auto">
                  Written straight from the heart, penned specifically for your birthday celebration.
                </p>
                <button
                  onClick={() => setIsLetterModalOpen(true)}
                  className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors shadow-lg shadow-rose-950/50"
                >
                  Unfold Letter & Break Wax Seal
                </button>
              </div>
            </div>
          )}

          {activeTab === 'coupons' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs text-stone-400">
                  Rub each card with cursor/finger to scratch off the gold layer and reveal your prize!
                </span>
                <span className="text-xs font-mono text-amber-400">
                  {config.surpriseBox.coupons.filter((c) => c.isRedeemed).length} of {config.surpriseBox.coupons.length} Redeemed
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {config.surpriseBox.coupons.map((coupon) => (
                  <ScratchCoupon
                    key={coupon.id}
                    coupon={coupon}
                    onRedeem={handleRedeemCoupon}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reasons' && (
            <ReasonsJar
              reasons={config.surpriseBox.reasons}
              recipientName={config.recipientName}
            />
          )}

          {activeTab === 'cake' && (
            <BirthdayCake recipientName={config.recipientName} />
          )}

          {/* Re-box button */}
          <div className="text-center mt-12 pt-6 border-t border-stone-900">
            <button
              onClick={() => {
                setIsOpened(false);
                sounds.playSparkle();
              }}
              className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-300 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Pack Gift Box Again</span>
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Love Letter Modal */}
      <LoveLetterModal
        letter={config.surpriseBox.letter}
        recipientName={config.recipientName}
        senderName={config.senderName}
        isOpen={isLetterModalOpen}
        onClose={() => setIsLetterModalOpen(false)}
      />
    </section>
  );
};
