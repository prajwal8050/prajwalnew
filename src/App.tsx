/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BirthdayConfig } from './types/birthday';
import { loadBirthdayConfig, saveBirthdayConfig } from './utils/storage';
import { FloatingPetals } from './components/FloatingPetals';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { StorySection } from './components/StorySection';
import { MemoryLane } from './components/MemoryLane';
import { SurpriseBox } from './components/SurpriseBox/SurpriseBox';
import { AdminPortal } from './components/AdminPortal';
import { Footer } from './components/Footer';

export default function App() {
  const [config, setConfig] = useState<BirthdayConfig>(() => loadBirthdayConfig());
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Check URL query parameters, hash, or path on mount for admin mode or shared link
  useEffect(() => {
    const checkUrlTriggers = () => {
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();

      if (
        search.includes('admin') ||
        hash.includes('admin') ||
        path.includes('/admin') ||
        path.endsWith('admin')
      ) {
        setIsAdminOpen(true);
      }
    };

    checkUrlTriggers();
    window.addEventListener('hashchange', checkUrlTriggers);
    window.addEventListener('popstate', checkUrlTriggers);

    // Secret shortcut: Cmd+Shift+A or Ctrl+Shift+A toggles admin
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkUrlTriggers);
      window.removeEventListener('popstate', checkUrlTriggers);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleUpdateConfig = (updated: BirthdayConfig) => {
    setConfig(updated);
    saveBirthdayConfig(updated);
  };

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 relative selection:bg-rose-500 selection:text-white">
      {/* Delicate floating rose petals particle background */}
      <FloatingPetals />

      {/* Top Bar Navigation (3-zone contract) */}
      <Navigation
        onOpenAdmin={() => setIsAdminOpen(true)}
        isAdminActive={isAdminOpen}
        onNavigateSection={scrollToSection}
      />

      <main className="relative z-20">
        {/* Hero Section & January 23 Countdown */}
        <HeroSection
          config={config}
          onOpenSurprise={() => scrollToSection('surprise')}
          onExploreMemories={() => scrollToSection('memories')}
        />

        {/* Our Story Milestone Chapters */}
        <StorySection config={config} />

        {/* Interactive Memory Lane Slideshow & Polaroid Wall */}
        <MemoryLane
          memories={config.memories}
          onOpenAdminToAddPhoto={() => setIsAdminOpen(true)}
        />

        {/* Personalized Digital Surprise Box */}
        <SurpriseBox
          config={config}
          onUpdateConfig={handleUpdateConfig}
        />
      </main>

      {/* Clean Footer */}
      <Footer
        config={config}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Admin Management Portal Modal */}
      <AdminPortal
        config={config}
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          // Clean hash if it was #admin
          if (window.location.hash === '#admin') {
            history.pushState('', document.title, window.location.pathname + window.location.search);
          }
        }}
        onSaveConfig={handleUpdateConfig}
      />
    </div>
  );
}
