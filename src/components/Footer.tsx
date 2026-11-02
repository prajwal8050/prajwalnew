import React from 'react';
import { Heart, Shield } from 'lucide-react';
import { BirthdayConfig } from '../types/birthday';

interface FooterProps {
  config: BirthdayConfig;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onOpenAdmin }) => {
  let clickCount = 0;
  const handleSecretHeartClick = () => {
    clickCount++;
    if (clickCount >= 3) {
      clickCount = 0;
      onOpenAdmin();
    }
  };

  return (
    <footer className="border-t border-stone-800/80 bg-stone-950 py-12 px-6 text-center text-xs text-stone-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-stone-400">
          <span>Crafted with devotion by</span>
          <span className="text-rose-200 font-serif-display font-medium">
            {config.senderName}
          </span>
          <span>for</span>
          <span className="text-rose-300 font-serif-display font-medium">
            {config.recipientName}
          </span>
          <button
            onClick={handleSecretHeartClick}
            aria-label="Heart icon"
            className="cursor-default focus:outline-none"
          >
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline ml-1 hover:scale-125 transition-transform" />
          </button>
        </div>

        <div className="flex items-center gap-4 text-stone-400">
          <span>{config.birthdayDate} · Birthday Celebration</span>
        </div>
      </div>
    </footer>
  );
};
