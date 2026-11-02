import React from 'react';
import { Heart, Sparkles, Stars, Compass } from 'lucide-react';
import { BirthdayConfig } from '../types/birthday';

interface StorySectionProps {
  config: BirthdayConfig;
}

export const StorySection: React.FC<StorySectionProps> = ({ config }) => {
  const milestones = [
    {
      number: '01',
      title: 'The First Spark',
      description:
        'The moment our paths crossed and an ordinary conversation turned into hours of effortless laughter. I walked away that day with a feeling that everything was about to change.',
      icon: Sparkles,
    },
    {
      number: '02',
      title: 'Growing & Learning Together',
      description:
        'From late-night talks about the universe to quiet breakfasts on sleepy Sunday mornings. You taught me how beautiful it is to be understood without having to say a word.',
      icon: Compass,
    },
    {
      number: '03',
      title: 'Our Unbreakable Rhythm',
      description:
        'In a fast, busy world, you are my sanctuary of calm. Your warmth grounds me, your ambition inspires me, and your sweet smile remains my greatest joy.',
      icon: Stars,
    },
    {
      number: '04',
      title: 'January 23rd & Every Tomorrow',
      description: `Today we celebrate the most wonderful soul to ever exist. Happy Birthday, ${config.recipientName}. Here is to every adventure, dream, and journey waiting for us ahead.`,
      icon: Heart,
    },
  ];

  return (
    <section id="story" className="py-20 px-6 max-w-7xl mx-auto border-t border-stone-800/80">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Heart className="w-3.5 h-3.5 fill-rose-500/20 text-rose-400" />
          <span>Our Story So Far</span>
        </div>
        <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
          How We Got Here
        </h2>
        <p className="text-stone-400 text-sm md:text-base mt-3 font-light">
          A few reflections on the bond we have built, one shared laughter, gentle look, and quiet triumph at a time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {milestones.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.number}
              className="relative p-6 rounded-2xl bg-stone-900/60 border border-stone-800/90 flex flex-col justify-between group hover:border-rose-900/60 hover:bg-stone-900 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-rose-400 font-semibold tracking-wider">
                    {m.number}.
                  </span>
                  <div className="p-2 rounded-xl bg-stone-950 border border-stone-800 text-rose-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="font-serif-display text-lg font-bold text-white mb-2">
                  {m.title}
                </h3>

                <p className="text-stone-300 text-xs sm:text-sm leading-relaxed font-light">
                  {m.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-800/60 flex items-center justify-between text-[11px] text-stone-500">
                <span>With Love</span>
                <span className="text-rose-400/60">♥</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
