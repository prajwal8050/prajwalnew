import React, { useState, useEffect } from 'react';
import { Gift, Heart, Calendar, Clock, ChevronDown } from 'lucide-react';
import { BirthdayConfig } from '../types/birthday';
import { sounds } from '../utils/soundEffects';

interface HeroSectionProps {
  config: BirthdayConfig;
  onOpenSurprise: () => void;
  onExploreMemories: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  config,
  onOpenSurprise,
  onExploreMemories,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isBirthdayToday: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isBirthdayToday: false,
  });

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const currentYear = now.getFullYear();

      // Birthday is January 23
      let targetDate = new Date(currentYear, 0, 23, 0, 0, 0);

      // If Jan 23 has already passed this year (e.g. today is in Feb-Dec), target next year
      if (now.getTime() > targetDate.getTime() + 86400000) {
        targetDate = new Date(currentYear + 1, 0, 23, 0, 0, 0);
      }

      const diff = targetDate.getTime() - now.getTime();
      const isToday = now.getMonth() === 0 && now.getDate() === 23;

      if (isToday || diff <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isBirthdayToday: true,
        });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
          isBirthdayToday: false,
        });
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSurpriseClick = () => {
    sounds.playCelebrationChime();
    onOpenSurprise();
  };

  const handleMemoriesClick = () => {
    sounds.playSparkle();
    onExploreMemories();
  };

  return (
    <section id="hero" className="relative min-h-[92vh] flex flex-col items-center justify-center pt-24 pb-16 px-6 text-center overflow-hidden">
      {/* Warm ambient radial backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-rose-950/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-2xl pointer-events-none -z-10" />

      {/* Date Kicker */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900/90 border border-stone-800 text-stone-300 text-xs mb-8">
        <Calendar className="w-3.5 h-3.5 text-rose-400" />
        <span>Celebration Date: {config.birthdayDate}</span>
        <span className="text-stone-600">·</span>
        <span className="text-rose-300 font-medium">To {config.nickname || config.recipientName}</span>
      </div>

      {/* Main Headline */}
      <h1 className="font-serif-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-tight md:leading-tight mb-6">
        {config.heroHeadline || 'To The One Who Makes My Entire World Bloom'}
      </h1>

      {/* Subheadline */}
      <p className="text-stone-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8 font-light">
        {config.heroSubheadline}
      </p>

      {/* Featured Couple Photo */}
      {config.featuredHeroPhoto && (
        <div className="relative mb-10">
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1.5 bg-gradient-to-tr from-rose-500 via-amber-400 to-rose-300 shadow-2xl mx-auto overflow-hidden">
            <img
              src={config.featuredHeroPhoto}
              alt="Prajwal & Aradhana"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-full transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="mt-2.5 inline-flex items-center gap-1.5 bg-stone-900/90 border border-stone-800 px-3 py-1 rounded-full text-xs font-serif-display text-rose-200 shadow-md">
            <span>Prajwal</span>
            <Heart className="w-3 h-3 fill-rose-500 text-rose-500 inline" />
            <span>Aradhana</span>
          </div>
        </div>
      )}

      {/* Live Countdown Grid or Celebration Badge */}
      <div className="mb-12">
        {timeLeft.isBirthdayToday ? (
          <div className="px-6 py-4 rounded-2xl bg-gradient-to-r from-rose-950/80 via-stone-900/90 to-amber-950/80 border border-rose-800/60 shadow-xl max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2 text-rose-300 text-sm font-medium mb-1">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-bounce" />
              <span>TODAY IS YOUR SPECIAL DAY!</span>
            </div>
            <p className="text-xl md:text-2xl font-serif-display font-semibold text-white">
              Happy Birthday, {config.recipientName}!
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-xs text-stone-400 mb-3 uppercase tracking-wider">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>Countdown to January 23</span>
            </div>
            <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-sm sm:max-w-md mx-auto">
              <div className="bg-stone-900/90 border border-stone-800 p-3 sm:p-4 rounded-xl">
                <span className="block font-serif-display text-2xl sm:text-3xl font-bold text-rose-200 tabular-nums">
                  {timeLeft.days}
                </span>
                <span className="text-[11px] text-stone-400 uppercase tracking-wider">Days</span>
              </div>
              <div className="bg-stone-900/90 border border-stone-800 p-3 sm:p-4 rounded-xl">
                <span className="block font-serif-display text-2xl sm:text-3xl font-bold text-rose-200 tabular-nums">
                  {timeLeft.hours}
                </span>
                <span className="text-[11px] text-stone-400 uppercase tracking-wider">Hours</span>
              </div>
              <div className="bg-stone-900/90 border border-stone-800 p-3 sm:p-4 rounded-xl">
                <span className="block font-serif-display text-2xl sm:text-3xl font-bold text-rose-200 tabular-nums">
                  {timeLeft.minutes}
                </span>
                <span className="text-[11px] text-stone-400 uppercase tracking-wider">Mins</span>
              </div>
              <div className="bg-stone-900/90 border border-stone-800 p-3 sm:p-4 rounded-xl">
                <span className="block font-serif-display text-2xl sm:text-3xl font-bold text-rose-200 tabular-nums">
                  {timeLeft.seconds}
                </span>
                <span className="text-[11px] text-stone-400 uppercase tracking-wider">Secs</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
        <button
          onClick={handleSurpriseClick}
          className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm transition-all shadow-lg shadow-rose-950/50 hover:shadow-rose-600/30 cursor-pointer"
        >
          <Gift className="w-4 h-4" />
          <span>Unwrap Digital Surprise Box</span>
        </button>

        <button
          onClick={handleMemoriesClick}
          className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-stone-700 text-stone-200 font-medium text-sm transition-all cursor-pointer"
        >
          <Heart className="w-4 h-4 text-rose-400" />
          <span>Explore Memory Lane</span>
        </button>
      </div>

      {/* Romantic Quote */}
      {config.romanticQuote && (
        <div className="max-w-xl mx-auto border-t border-stone-800/80 pt-6">
          <p className="font-editorial italic text-stone-400 text-base md:text-lg">
            "{config.romanticQuote}"
          </p>
        </div>
      )}

      {/* Subtle Scroll Down Prompt */}
      <button
        onClick={handleMemoriesClick}
        aria-label="Scroll down to memories"
        className="mt-12 text-stone-500 hover:text-rose-300 transition-colors focus:outline-none"
      >
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </button>
    </section>
  );
};
