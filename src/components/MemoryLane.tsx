import React, { useState, useEffect } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Maximize2, X, MapPin, Calendar, Heart, Sparkles, PlusCircle } from 'lucide-react';
import { Memory } from '../types/birthday';
import { sounds } from '../utils/soundEffects';

interface MemoryLaneProps {
  memories: Memory[];
  onOpenAdminToAddPhoto: () => void;
}

export const MemoryLane: React.FC<MemoryLaneProps> = ({
  memories,
  onOpenAdminToAddPhoto,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'slideshow' | 'polaroids'>('slideshow');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [lightboxMemory, setLightboxMemory] = useState<Memory | null>(null);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const filteredMemories = memories.filter((m) => {
    if (activeFilter === 'All') return true;
    return m.tag === activeFilter;
  });

  const activeMemory = filteredMemories[currentIndex] || filteredMemories[0] || memories[0];

  // Auto-play interval for slideshow
  useEffect(() => {
    if (!isPlaying || filteredMemories.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredMemories.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPlaying, filteredMemories.length]);

  // Handle keyboard navigation for slideshow and lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'Escape' && lightboxMemory) {
        setLightboxMemory(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxMemory, filteredMemories.length]);

  const goToNext = () => {
    sounds.playSparkle();
    setCurrentIndex((prev) => (prev + 1) % filteredMemories.length);
  };

  const goToPrev = () => {
    sounds.playSparkle();
    setCurrentIndex((prev) => (prev - 1 + filteredMemories.length) % filteredMemories.length);
  };

  const toggleFlipCard = (id: string) => {
    sounds.playSparkle();
    setFlippedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const tags = ['All', 'Sweet Moments', 'Adventures', 'Us'];

  return (
    <section id="memories" className="py-20 px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Memory Lane</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
            Our Chapters Together
          </h2>
          <p className="text-stone-400 text-sm md:text-base mt-2 max-w-xl">
            A visual anthology of our smiles, quiet mornings, spontaneous journeys, and every little moment that made us fall deeper in love.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="p-1 bg-stone-900 border border-stone-800 rounded-lg flex items-center gap-1">
            <button
              onClick={() => {
                setViewMode('slideshow');
                sounds.playSparkle();
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'slideshow'
                  ? 'bg-rose-950/80 text-rose-200 border border-rose-800'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Cinematic Slideshow
            </button>
            <button
              onClick={() => {
                setViewMode('polaroids');
                sounds.playSparkle();
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === 'polaroids'
                  ? 'bg-rose-950/80 text-rose-200 border border-rose-800'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Polaroid Wall
            </button>
          </div>
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => {
              setActiveFilter(tag);
              setCurrentIndex(0);
              sounds.playSparkle();
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeFilter === tag
                ? 'bg-stone-800 text-rose-300 border border-stone-700'
                : 'text-stone-400 hover:text-stone-200 bg-transparent'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      {filteredMemories.length === 0 ? (
        <div className="text-center py-20 bg-stone-900/50 rounded-2xl border border-stone-800">
          <p className="text-stone-400 text-sm">No memories in this category yet.</p>
          <button
            onClick={onOpenAdminToAddPhoto}
            className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-medium"
          >
            Add a Photo Memory
          </button>
        </div>
      ) : viewMode === 'slideshow' ? (
        /* Cinematic Slideshow Mode */
        <div className="relative rounded-2xl overflow-hidden bg-stone-900/80 border border-stone-800 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[520px]">
            {/* Visual Container */}
            <div className="relative lg:col-span-7 bg-stone-950 overflow-hidden group">
              {activeMemory && (
                <img
                  src={activeMemory.imageUrl}
                  alt={activeMemory.title || 'Memory'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover min-h-[380px] lg:min-h-[540px] max-h-[600px] transition-transform duration-700 ease-out group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:hidden" />

              {/* Fullscreen Button */}
              {activeMemory && (
                <button
                  onClick={() => setLightboxMemory(activeMemory)}
                  className="absolute top-4 right-4 p-2.5 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-black/90 transition-colors focus:outline-none"
                  aria-label="View photo in fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              )}

              {/* Slideshow Progress Bar */}
              {isPlaying && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-stone-800/80">
                  <div
                    key={currentIndex}
                    className="h-full bg-rose-500 animate-[pulse_5.5s_linear]"
                    style={{ animationDuration: '5.5s' }}
                  />
                </div>
              )}
            </div>

            {/* Story & Context Details */}
            <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between bg-stone-900/90 backdrop-blur-sm">
              <div>
                {/* Meta details */}
                <div className="flex items-center gap-3 text-xs text-stone-400 mb-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-rose-400" />
                    <span>{activeMemory?.date}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{activeMemory?.location}</span>
                  </span>
                </div>

                <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-white mb-4">
                  {activeMemory?.title}
                </h3>

                <p className="font-editorial italic text-rose-200/90 text-lg sm:text-xl mb-6 leading-relaxed">
                  "{activeMemory?.caption}"
                </p>

                <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
                  {activeMemory?.story}
                </p>
              </div>

              {/* Bottom Controls */}
              <div className="pt-8 border-t border-stone-800 flex items-center justify-between">
                <div className="text-xs text-stone-400 font-mono tabular-nums">
                  {currentIndex + 1} / {filteredMemories.length}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                    title={isPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={goToPrev}
                    className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                    aria-label="Previous memory"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={goToNext}
                    className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                    aria-label="Next memory"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Polaroid Wall Mode with Flip Card effect */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMemories.map((mem, idx) => {
            const isFlipped = flippedCards[mem.id] || false;
            // slight organic rotation angle for scrapbook feel
            const rotationDegree = (idx % 3 === 0 ? -1.5 : idx % 3 === 1 ? 1.8 : -0.8);

            return (
              <div
                key={mem.id}
                style={{ transform: `rotate(${rotationDegree}deg)` }}
                className="relative cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:z-20 group"
                onClick={() => toggleFlipCard(mem.id)}
              >
                {/* Washi tape sticker */}
                <div className="w-20 h-6 bg-white/20 backdrop-blur-sm mx-auto mb-[-12px] relative z-10 shadow-sm rotate-2 rounded-sm" />

                <div className="bg-stone-100 text-stone-900 p-4 pb-6 rounded-sm shadow-xl transition-all">
                  {!isFlipped ? (
                    /* Front side of polaroid */
                    <div>
                      <div className="aspect-[4/3] w-full overflow-hidden bg-stone-200 mb-4 rounded-[2px] relative">
                        <img
                          src={mem.imageUrl}
                          alt={mem.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px]">
                          Click to read note
                        </div>
                      </div>

                      <div className="px-1 text-center">
                        <h4 className="font-handwriting text-2xl text-stone-900 leading-tight">
                          {mem.title}
                        </h4>
                        <p className="text-[11px] text-stone-500 font-sans mt-1">
                          {mem.location} · {mem.date}
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Back side of polaroid */
                    <div className="aspect-[4/3] flex flex-col justify-between p-3 bg-stone-50 border border-stone-200 rounded-[2px]">
                      <div>
                        <div className="flex items-center justify-between text-xs text-rose-600 mb-2 font-handwriting text-lg">
                          <span>A Secret Note</span>
                          <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                        </div>
                        <p className="font-editorial text-stone-800 text-sm leading-relaxed italic">
                          "{mem.story}"
                        </p>
                      </div>
                      <div className="text-right text-[11px] text-stone-500 pt-2 border-t border-stone-200">
                        {mem.date}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxMemory && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightboxMemory(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-stone-900 rounded-2xl overflow-hidden border border-stone-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxMemory(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
              aria-label="Close fullscreen"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[75vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={lightboxMemory.imageUrl}
                alt={lightboxMemory.title}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] w-auto object-contain mx-auto"
              />
            </div>

            <div className="p-6 bg-stone-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-stone-800">
              <div>
                <h3 className="font-serif-display text-xl font-bold text-white">
                  {lightboxMemory.title}
                </h3>
                <p className="text-sm text-stone-400 mt-1">
                  {lightboxMemory.location} · {lightboxMemory.date}
                </p>
              </div>
              <p className="font-editorial italic text-rose-300 text-sm max-w-md">
                "{lightboxMemory.caption}"
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
