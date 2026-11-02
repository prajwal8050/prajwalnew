import React, { useState } from 'react';
import { Music, VolumeX, Shield, Sparkles } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface NavigationProps {
  onOpenAdmin: () => void;
  isAdminActive: boolean;
  onNavigateSection: (sectionId: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  onOpenAdmin,
  isAdminActive,
  onNavigateSection,
}) => {
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);

  const toggleMusic = () => {
    const isPlaying = sounds.toggleAmbientMelody();
    setIsPlayingMusic(isPlaying);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-stone-950/85 backdrop-blur-md border-b border-stone-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onNavigateSection('hero')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="font-serif-display text-lg md:text-xl font-bold tracking-tight text-rose-100 group-hover:text-rose-300 transition-colors whitespace-nowrap shrink-0">
            Forever January 23
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-300">
          <button
            onClick={() => onNavigateSection('story')}
            className="hover:text-rose-200 transition-colors whitespace-nowrap shrink-0 focus:outline-none"
          >
            Our Story
          </button>
          <button
            onClick={() => onNavigateSection('memories')}
            className="hover:text-rose-200 transition-colors whitespace-nowrap shrink-0 focus:outline-none"
          >
            Memory Lane
          </button>
          <button
            onClick={() => onNavigateSection('surprise')}
            className="hover:text-rose-200 transition-colors whitespace-nowrap shrink-0 focus:outline-none flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Surprise Box</span>
          </button>
          <button
            onClick={() => onNavigateSection('wishes')}
            className="hover:text-rose-200 transition-colors whitespace-nowrap shrink-0 focus:outline-none"
          >
            Make a Wish
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleMusic}
            title={isPlayingMusic ? 'Mute romantic ambient music' : 'Play romantic music box melody'}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-900 border border-stone-800 text-stone-200 hover:text-rose-200 hover:border-rose-900/50 transition-colors whitespace-nowrap cursor-pointer"
          >
            {isPlayingMusic ? (
              <>
                <Music className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span className="hidden sm:inline">Playing Melody</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                <span className="hidden sm:inline">Play Melody</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
