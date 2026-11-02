import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Plus,
  Trash2,
  Save,
  Download,
  Share2,
  RotateCcw,
  Sparkles,
  Image as ImageIcon,
  Heart,
  Mail,
  Ticket,
  FileCode,
  Check,
  Lock,
  Unlock,
  Camera,
  Gift,
} from 'lucide-react';
import { BirthdayConfig, Memory, LoveCoupon, ReasonToLove } from '../types/birthday';
import {
  saveBirthdayConfig,
  exportConfigAsJSON,
  generateShareUrl,
  compressImageFile,
  resetToDefaults,
} from '../utils/storage';
import { sounds } from '../utils/soundEffects';

interface AdminPortalProps {
  config: BirthdayConfig;
  isOpen: boolean;
  onClose: () => void;
  onSaveConfig: (newConfig: BirthdayConfig) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  config,
  isOpen,
  onClose,
  onSaveConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'photos' | 'girlfriend' | 'letter' | 'coupons' | 'reasons' | 'netlify'>('photos');
  const [formData, setFormData] = useState<BirthdayConfig>(config);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(true);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [copiedShareLink, setCopiedShareLink] = useState<boolean>(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');

  // Sync formData with config prop whenever config updates or modal opens
  useEffect(() => {
    setFormData(config);
  }, [config, isOpen]);

  // New Memory Draft State
  const [newPhotoPreview, setNewPhotoPreview] = useState<string>('');
  const [newPhotoTitle, setNewPhotoTitle] = useState<string>('');
  const [newPhotoDate, setNewPhotoDate] = useState<string>('January 23');
  const [newPhotoLocation, setNewPhotoLocation] = useState<string>('Our Special Place');
  const [newPhotoCaption, setNewPhotoCaption] = useState<string>('');
  const [newPhotoStory, setNewPhotoStory] = useState<string>('');
  const [newPhotoTag, setNewPhotoTag] = useState<'Firsts' | 'Adventures' | 'Sweet Moments' | 'Special Trips' | 'Us'>('Sweet Moments');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pinInput.trim().toLowerCase();
    if (
      clean === (formData.adminPin || 'jan23').toLowerCase() ||
      clean === 'prajwal' ||
      clean === '1234' ||
      clean === 'aradhana' ||
      clean === ''
    ) {
      setIsUnlocked(true);
      setPinError('');
      sounds.playSparkle();
    } else {
      setPinError('Incorrect PIN. (You can also type "prajwal" or "jan23")');
    }
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      setUploadError('');
      const compressedDataUrl = await compressImageFile(file);
      setNewPhotoPreview(compressedDataUrl);
    } catch {
      setUploadError('Could not process this image. Please try another file.');
    } finally {
      setIsUploading(false);
    }
  };

  // Upload Featured Hero Couple Photo (Prajwal & Aradhana)
  const handleHeroPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const compressed = await compressImageFile(file);
      const updated = { ...formData, featuredHeroPhoto: compressed };
      setFormData(updated);
      onSaveConfig(updated);
      saveBirthdayConfig(updated);
      sounds.playCelebrationChime();
      showSavedNotification('Couple photo updated on Hero section!');
    } catch {
      setUploadError('Failed to upload couple photo.');
    } finally {
      setIsUploading(false);
    }
  };

  // Upload Gift Box Cover Photo
  const handleGiftBoxPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const compressed = await compressImageFile(file);
      const updated = {
        ...formData,
        surpriseBox: {
          ...formData.surpriseBox,
          boxImageUrl: compressed,
        },
      };
      setFormData(updated);
      onSaveConfig(updated);
      saveBirthdayConfig(updated);
      sounds.playCelebrationChime();
      showSavedNotification('Gift box photo updated!');
    } catch {
      setUploadError('Failed to upload gift box photo.');
    } finally {
      setIsUploading(false);
    }
  };

  // Replace photo on an existing memory
  const handleReplaceMemoryPhoto = async (id: string, file: File) => {
    try {
      setIsUploading(true);
      const compressed = await compressImageFile(file);
      const updatedMemories = formData.memories.map((m) =>
        m.id === id ? { ...m, imageUrl: compressed } : m
      );
      const updated = { ...formData, memories: updatedMemories };
      setFormData(updated);
      onSaveConfig(updated);
      saveBirthdayConfig(updated);
      sounds.playCelebrationChime();
      showSavedNotification('Memory photo replaced and updated live!');
    } catch {
      setUploadError('Failed to replace photo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddMemory = () => {
    if (!newPhotoPreview) {
      setUploadError('Please select a photo from your computer/phone or enter an image URL.');
      return;
    }
    setUploadError('');

    const newMemory: Memory = {
      id: `mem-${Date.now()}`,
      title: newPhotoTitle.trim() || 'A Precious Memory with Aradhana',
      date: newPhotoDate.trim() || 'January 23',
      location: newPhotoLocation.trim() || 'Our Favorite Place',
      imageUrl: newPhotoPreview,
      caption: newPhotoCaption.trim() || 'One of the best moments with you.',
      story: newPhotoStory.trim() || 'Every second spent together is a treasure I hold close to my heart.',
      tag: newPhotoTag,
      favorite: true,
    };

    const updatedMemories = [newMemory, ...formData.memories];
    const updatedConfig = { ...formData, memories: updatedMemories };

    setFormData(updatedConfig);
    onSaveConfig(updatedConfig);
    saveBirthdayConfig(updatedConfig);
    sounds.playCelebrationChime();

    // Reset draft
    setNewPhotoPreview('');
    setNewPhotoTitle('');
    setNewPhotoCaption('');
    setNewPhotoStory('');

    showSavedNotification('New photo memory published live to Memory Lane!');
  };

  const handleDeleteMemory = (id: string) => {
    const updatedMemories = formData.memories.filter((m) => m.id !== id);
    const updatedConfig = { ...formData, memories: updatedMemories };
    setFormData(updatedConfig);
    onSaveConfig(updatedConfig);
    saveBirthdayConfig(updatedConfig);
    showSavedNotification('Memory deleted');
  };

  const handleSaveGeneral = () => {
    onSaveConfig(formData);
    saveBirthdayConfig(formData);
    sounds.playSparkle();
    showSavedNotification('All customizations saved live!');
  };

  const showSavedNotification = (msg: string) => {
    setSaveSuccessMessage(msg);
    setTimeout(() => setSaveSuccessMessage(''), 3500);
  };

  const handleCopyShareLink = () => {
    const link = generateShareUrl(formData);
    navigator.clipboard.writeText(link);
    setCopiedShareLink(true);
    sounds.playCelebrationChime();
    setTimeout(() => setCopiedShareLink(false), 3000);
  };

  const handleResetToDefaults = () => {
    const initial = resetToDefaults();
    setFormData(initial);
    onSaveConfig(initial);
    showSavedNotification('Reset to defaults for Aradhana Mohanty & Prajwal');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div className="relative max-w-4xl w-full my-6 bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-950 border border-rose-800 text-rose-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-display text-xl font-bold text-white">
                Prajwal's Admin Management Studio
              </h3>
              <p className="text-xs text-stone-400">
                Full dynamic control over all photos, love notes, coupons & birthday data for Aradhana
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors cursor-pointer"
            aria-label="Close admin modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PIN verification if locked */}
        {!isUnlocked ? (
          <div className="p-12 text-center max-w-md mx-auto">
            <Lock className="w-12 h-12 text-rose-400 mx-auto mb-4" />
            <h4 className="font-serif-display text-2xl font-bold text-white mb-2">
              Welcome, Prajwal
            </h4>
            <p className="text-xs text-stone-400 mb-6">
              Enter your passcode to manage photos and surprise contents.
              <br />
              <span className="text-rose-400 font-mono">(Default: "prajwal" or "jan23")</span>
            </p>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter passcode..."
                className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-center font-mono text-lg focus:outline-none focus:border-rose-500"
              />
              {pinError && <p className="text-xs text-rose-500">{pinError}</p>}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm transition-colors cursor-pointer"
                >
                  Unlock Admin
                </button>
                <button
                  type="button"
                  onClick={() => setIsUnlocked(true)}
                  className="py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition-colors cursor-pointer whitespace-nowrap"
                >
                  Quick Enter
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Main Admin Body */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Top Navigation Tabs */}
            <div className="flex items-center gap-1 p-2 bg-stone-950 border-b border-stone-800 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('photos')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'photos'
                    ? 'bg-rose-950 text-rose-200 border border-rose-800'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-rose-400" />
                <span>Manage All Photos ({formData.memories.length + 2})</span>
              </button>

              <button
                onClick={() => setActiveTab('girlfriend')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'girlfriend'
                    ? 'bg-rose-950 text-rose-200 border border-rose-800'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>Names & Birthday Details</span>
              </button>

              <button
                onClick={() => setActiveTab('letter')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'letter'
                    ? 'bg-rose-950 text-rose-200 border border-rose-800'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Mail className="w-3.5 h-3.5 text-rose-400" />
                <span>Love Letter</span>
              </button>

              <button
                onClick={() => setActiveTab('coupons')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'coupons'
                    ? 'bg-rose-950 text-rose-200 border border-rose-800'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Ticket className="w-3.5 h-3.5 text-rose-400" />
                <span>Love Coupons</span>
              </button>

              <button
                onClick={() => setActiveTab('reasons')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'reasons'
                    ? 'bg-rose-950 text-rose-200 border border-rose-800'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>Reasons Jar</span>
              </button>

              <button
                onClick={() => setActiveTab('netlify')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'netlify'
                    ? 'bg-rose-950 text-rose-200 border border-rose-800'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-rose-400" />
                <span>Netlify & Share Link</span>
              </button>
            </div>

            {/* Notification Banner */}
            {saveSuccessMessage && (
              <div className="bg-emerald-950 border-b border-emerald-800 text-emerald-200 px-4 py-2 text-xs flex items-center justify-between">
                <span>✓ {saveSuccessMessage}</span>
              </div>
            )}

            {/* Tab Contents Scrollable */}
            <div className="p-6 overflow-y-auto flex-1 space-y-8">
              {/* TAB 1: MANAGE ALL PHOTOS */}
              {activeTab === 'photos' && (
                <div className="space-y-8">
                  {/* SECTION A: KEY SITE-WIDE PHOTOS */}
                  <div className="p-5 rounded-xl bg-stone-950 border border-stone-800">
                    <h4 className="font-serif-display text-base font-bold text-white mb-1 flex items-center gap-2">
                      <Camera className="w-4 h-4 text-amber-400" />
                      <span>Key Website Featured Photos</span>
                    </h4>
                    <p className="text-xs text-stone-400 mb-4">
                      Customize the featured couple portrait and the 3D gift box photo directly from your device.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Featured Hero Portrait */}
                      <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-rose-300">
                              Hero Couple Portrait
                            </span>
                            <span className="text-[10px] text-stone-400">Prajwal & Aradhana</span>
                          </div>
                          <div className="w-24 h-24 rounded-full overflow-hidden mx-auto my-3 border-2 border-rose-500/50 shadow-md">
                            <img
                              src={formData.featuredHeroPhoto}
                              alt="Couple"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <label className="cursor-pointer block text-center py-2 px-3 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors">
                          Change Couple Photo
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleHeroPhotoUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Gift Box Cover Photo */}
                      <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-amber-300">
                              Surprise Box Cover Photo
                            </span>
                            <span className="text-[10px] text-stone-400">Box Illustration</span>
                          </div>
                          <div className="w-24 h-24 rounded-xl overflow-hidden mx-auto my-3 border-2 border-amber-500/50 shadow-md">
                            <img
                              src={formData.surpriseBox.boxImageUrl}
                              alt="Gift Box"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <label className="cursor-pointer block text-center py-2 px-3 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors">
                          Change Gift Box Photo
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleGiftBoxPhotoUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* SECTION B: UPLOAD NEW MEMORY PHOTO */}
                  <div className="p-5 rounded-xl bg-stone-950 border border-stone-800">
                    <h4 className="font-serif-display text-lg font-bold text-white mb-1 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-rose-400" />
                      <span>Post a New Memory Lane Photo</span>
                    </h4>
                    <p className="text-xs text-stone-400 mb-4">
                      Upload photos of you and Aradhana from your Mac, iPhone, or enter an image link. They will appear on the slideshow and polaroid wall!
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left: Image selector */}
                      <div>
                        <label className="block text-xs font-medium text-stone-300 mb-2">
                          1. Select Photo from Device or Paste Link
                        </label>
                        <div className="border-2 border-dashed border-stone-800 hover:border-rose-800/80 rounded-xl p-4 text-center bg-stone-900/50 flex flex-col items-center justify-center min-h-[170px]">
                          {newPhotoPreview ? (
                            <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
                              <img
                                src={newPhotoPreview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                              <button
                                onClick={() => setNewPhotoPreview('')}
                                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Upload className="w-7 h-7 text-stone-500 mx-auto" />
                              <label className="cursor-pointer inline-block px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors">
                                Choose Photo from Mac / Device
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageFileChange}
                                  className="hidden"
                                />
                              </label>
                              <p className="text-[10px] text-stone-500">
                                {isUploading ? 'Compressing photo...' : 'JPG, PNG, WEBP auto-compressed'}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* URL input */}
                        <div className="mt-3">
                          <input
                            type="text"
                            placeholder="Or paste direct image URL (e.g. https://...)"
                            value={newPhotoPreview.startsWith('data:') ? '' : newPhotoPreview}
                            onChange={(e) => setNewPhotoPreview(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg bg-stone-900 border border-stone-800 text-stone-200 focus:outline-none focus:border-rose-500"
                          />
                        </div>
                        {uploadError && (
                          <p className="text-xs text-rose-400 mt-2 bg-rose-950/60 border border-rose-800/80 p-2 rounded-lg">
                            {uploadError}
                          </p>
                        )}
                      </div>

                      {/* Right: Details */}
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-stone-300 mb-1">
                            Memory Title
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Our First Beach Trip"
                            value={newPhotoTitle}
                            onChange={(e) => setNewPhotoTitle(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-lg bg-stone-900 border border-stone-800 text-stone-200 focus:outline-none focus:border-rose-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-medium text-stone-400 mb-1">
                              Date
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. January 23"
                              value={newPhotoDate}
                              onChange={(e) => setNewPhotoDate(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs rounded-lg bg-stone-900 border border-stone-800 text-stone-200 focus:outline-none focus:border-rose-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-medium text-stone-400 mb-1">
                              Location
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Sunset Point"
                              value={newPhotoLocation}
                              onChange={(e) => setNewPhotoLocation(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs rounded-lg bg-stone-900 border border-stone-800 text-stone-200 focus:outline-none focus:border-rose-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-stone-400 mb-1">
                            Sweet Romantic Caption (Shows on Slideshow)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. You looked so beautiful in the golden breeze."
                            value={newPhotoCaption}
                            onChange={(e) => setNewPhotoCaption(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg bg-stone-900 border border-stone-800 text-stone-200 focus:outline-none focus:border-rose-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-stone-400 mb-1">
                            Heartfelt Story (Revealed when Aradhana flips polaroid)
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Write a sweet personal message or secret memory about this day..."
                            value={newPhotoStory}
                            onChange={(e) => setNewPhotoStory(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg bg-stone-900 border border-stone-800 text-stone-200 focus:outline-none focus:border-rose-500"
                          />
                        </div>

                        <button
                          onClick={handleAddMemory}
                          className="w-full py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Publish Memory for Aradhana</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* SECTION C: EXISTING MEMORIES & LIVE REPLACE */}
                  <div>
                    <h4 className="font-serif-display text-base font-bold text-white mb-3">
                      Current Published Photo Memories ({formData.memories.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {formData.memories.map((mem) => (
                        <div
                          key={mem.id}
                          className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 flex flex-col justify-between space-y-3"
                        >
                          <div className="flex gap-3 items-start">
                            <div className="relative group shrink-0">
                              <img
                                src={mem.imageUrl}
                                alt={mem.title}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] rounded-lg cursor-pointer transition-opacity">
                                <span>Replace</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) handleReplaceMemoryPhoto(mem.id, f);
                                  }}
                                  className="hidden"
                                />
                              </label>
                            </div>

                            <div className="flex-1 min-w-0">
                              <h5 className="text-xs font-semibold text-white truncate">
                                {mem.title}
                              </h5>
                              <p className="text-[11px] text-stone-400">
                                {mem.location} · {mem.date}
                              </p>
                              <p className="text-[10px] text-rose-300 italic line-clamp-2 mt-1">
                                "{mem.caption}"
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-stone-900">
                            <label className="cursor-pointer text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1">
                              <Camera className="w-3.5 h-3.5" />
                              <span>Replace Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (f) handleReplaceMemoryPhoto(mem.id, f);
                                }}
                                className="hidden"
                              />
                            </label>

                            <button
                              onClick={() => handleDeleteMemory(mem.id)}
                              className="text-stone-500 hover:text-rose-400 text-xs p-1"
                              title="Delete Photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ARADHANA & PRAJWAL'S DETAILS */}
              {activeTab === 'girlfriend' && (
                <div className="max-w-xl space-y-4">
                  <h4 className="font-serif-display text-lg font-bold text-white mb-2">
                    Personalized Names & Birthday Date
                  </h4>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Her Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.recipientName}
                      onChange={(e) =>
                        setFormData({ ...formData, recipientName: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Her Sweet Nickname
                    </label>
                    <input
                      type="text"
                      value={formData.nickname}
                      onChange={(e) =>
                        setFormData({ ...formData, nickname: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Your Name (Boyfriend / Sender)
                    </label>
                    <input
                      type="text"
                      value={formData.senderName}
                      onChange={(e) =>
                        setFormData({ ...formData, senderName: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Birthday Date Text
                    </label>
                    <input
                      type="text"
                      value={formData.birthdayDate}
                      onChange={(e) =>
                        setFormData({ ...formData, birthdayDate: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Main Hero Headline
                    </label>
                    <input
                      type="text"
                      value={formData.heroHeadline}
                      onChange={(e) =>
                        setFormData({ ...formData, heroHeadline: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Hero Subheadline
                    </label>
                    <textarea
                      rows={2}
                      value={formData.heroSubheadline}
                      onChange={(e) =>
                        setFormData({ ...formData, heroSubheadline: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Romantic Love Quote
                    </label>
                    <textarea
                      rows={2}
                      value={formData.romanticQuote}
                      onChange={(e) =>
                        setFormData({ ...formData, romanticQuote: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <button
                    onClick={handleSaveGeneral}
                    className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    Save Names & Details
                  </button>
                </div>
              )}

              {/* TAB 3: LOVE LETTER */}
              {activeTab === 'letter' && (
                <div className="max-w-2xl space-y-4">
                  <h4 className="font-serif-display text-lg font-bold text-white mb-2">
                    Handwritten Love Letter to Aradhana
                  </h4>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Salutation
                    </label>
                    <input
                      type="text"
                      value={formData.surpriseBox.letter.salutation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          surpriseBox: {
                            ...formData.surpriseBox,
                            letter: {
                              ...formData.surpriseBox.letter,
                              salutation: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Letter Opening
                    </label>
                    <input
                      type="text"
                      value={formData.surpriseBox.letter.opening}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          surpriseBox: {
                            ...formData.surpriseBox,
                            letter: {
                              ...formData.surpriseBox.letter,
                              opening: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  {formData.surpriseBox.letter.paragraphs.map((p, idx) => (
                    <div key={idx}>
                      <label className="block text-[11px] font-medium text-stone-400 mb-1">
                        Paragraph {idx + 1}
                      </label>
                      <textarea
                        rows={3}
                        value={p}
                        onChange={(e) => {
                          const updated = [...formData.surpriseBox.letter.paragraphs];
                          updated[idx] = e.target.value;
                          setFormData({
                            ...formData,
                            surpriseBox: {
                              ...formData.surpriseBox,
                              letter: {
                                ...formData.surpriseBox.letter,
                                paragraphs: updated,
                              },
                            },
                          });
                        }}
                        className="w-full px-3 py-2 text-xs rounded-lg bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Sign-off Closing
                    </label>
                    <input
                      type="text"
                      value={formData.surpriseBox.letter.closing}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          surpriseBox: {
                            ...formData.surpriseBox,
                            letter: {
                              ...formData.surpriseBox.letter,
                              closing: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Your Signature Name
                    </label>
                    <input
                      type="text"
                      value={formData.surpriseBox.letter.senderSignature}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          surpriseBox: {
                            ...formData.surpriseBox,
                            letter: {
                              ...formData.surpriseBox.letter,
                              senderSignature: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg bg-stone-950 border border-stone-800 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>

                  <button
                    onClick={handleSaveGeneral}
                    className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    Save Love Letter
                  </button>
                </div>
              )}

              {/* TAB 4: LOVE COUPONS */}
              {activeTab === 'coupons' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-serif-display text-lg font-bold text-white">
                      Love Coupons & Scratch Perks
                    </h4>
                    <button
                      onClick={() => {
                        const newC: LoveCoupon = {
                          id: `coup-${Date.now()}`,
                          title: 'Special Request for Aradhana',
                          perk: 'Ask me for anything you want today!',
                          code: 'LOVE-ARADHANA',
                          isRedeemed: false,
                          isScratched: false,
                          icon: 'Gift',
                          badge: 'Custom Pass',
                        };
                        setFormData({
                          ...formData,
                          surpriseBox: {
                            ...formData.surpriseBox,
                            coupons: [...formData.surpriseBox.coupons, newC],
                          },
                        });
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Coupon</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {formData.surpriseBox.coupons.map((c, idx) => (
                      <div
                        key={c.id}
                        className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <input
                            type="text"
                            value={c.badge}
                            onChange={(e) => {
                              const updated = [...formData.surpriseBox.coupons];
                              updated[idx] = { ...c, badge: e.target.value };
                              setFormData({
                                ...formData,
                                surpriseBox: { ...formData.surpriseBox, coupons: updated },
                              });
                            }}
                            className="text-[10px] uppercase font-semibold text-amber-400 bg-transparent border-b border-stone-800 focus:outline-none"
                          />
                          <button
                            onClick={() => {
                              const updated = formData.surpriseBox.coupons.filter(
                                (_, i) => i !== idx
                              );
                              setFormData({
                                ...formData,
                                surpriseBox: { ...formData.surpriseBox, coupons: updated },
                              });
                            }}
                            className="text-stone-500 hover:text-rose-400 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <input
                          type="text"
                          value={c.title}
                          onChange={(e) => {
                            const updated = [...formData.surpriseBox.coupons];
                            updated[idx] = { ...c, title: e.target.value };
                            setFormData({
                              ...formData,
                              surpriseBox: { ...formData.surpriseBox, coupons: updated },
                            });
                          }}
                          className="w-full text-xs font-semibold text-white bg-transparent border-b border-stone-800 focus:outline-none"
                        />

                        <textarea
                          rows={2}
                          value={c.perk}
                          onChange={(e) => {
                            const updated = [...formData.surpriseBox.coupons];
                            updated[idx] = { ...c, perk: e.target.value };
                            setFormData({
                              ...formData,
                              surpriseBox: { ...formData.surpriseBox, coupons: updated },
                            });
                          }}
                          className="w-full text-xs text-stone-400 bg-transparent border-b border-stone-800 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleSaveGeneral}
                    className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    Save Coupons
                  </button>
                </div>
              )}

              {/* TAB 5: REASONS JAR */}
              {activeTab === 'reasons' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-serif-display text-lg font-bold text-white">
                      Reasons Why Prajwal Loves Aradhana ({formData.surpriseBox.reasons.length})
                    </h4>
                    <button
                      onClick={() => {
                        const newR: ReasonToLove = {
                          id: `r-${Date.now()}`,
                          number: formData.surpriseBox.reasons.length + 1,
                          reason: 'The way you smile whenever you see me.',
                          details: 'It melts my heart every single time.',
                          emoji: '💖',
                        };
                        setFormData({
                          ...formData,
                          surpriseBox: {
                            ...formData.surpriseBox,
                            reasons: [...formData.surpriseBox.reasons, newR],
                          },
                        });
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Reason</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.surpriseBox.reasons.map((r, idx) => (
                      <div
                        key={r.id}
                        className="flex items-start gap-3 p-3 rounded-xl bg-stone-950 border border-stone-800"
                      >
                        <span className="text-xl">{r.emoji}</span>
                        <div className="flex-1 space-y-1">
                          <input
                            type="text"
                            value={r.reason}
                            onChange={(e) => {
                              const updated = [...formData.surpriseBox.reasons];
                              updated[idx] = { ...r, reason: e.target.value };
                              setFormData({
                                ...formData,
                                surpriseBox: { ...formData.surpriseBox, reasons: updated },
                              });
                            }}
                            className="w-full text-xs font-medium text-white bg-transparent border-b border-stone-800 focus:outline-none"
                          />
                          <input
                            type="text"
                            value={r.details}
                            onChange={(e) => {
                              const updated = [...formData.surpriseBox.reasons];
                              updated[idx] = { ...r, details: e.target.value };
                              setFormData({
                                ...formData,
                                surpriseBox: { ...formData.surpriseBox, reasons: updated },
                              });
                            }}
                            className="w-full text-[11px] text-stone-400 bg-transparent border-b border-stone-800 focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const updated = formData.surpriseBox.reasons.filter(
                              (_, i) => i !== idx
                            );
                            setFormData({
                              ...formData,
                              surpriseBox: { ...formData.surpriseBox, reasons: updated },
                            });
                          }}
                          className="text-stone-500 hover:text-rose-400 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleSaveGeneral}
                    className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    Save Reasons
                  </button>
                </div>
              )}

              {/* TAB 6: NETLIFY EXPORT & SHARING */}
              {activeTab === 'netlify' && (
                <div className="max-w-2xl space-y-6">
                  <div>
                    <h4 className="font-serif-display text-xl font-bold text-white mb-2">
                      Deploy to Netlify for January 23rd
                    </h4>
                    <p className="text-xs text-stone-300 leading-relaxed">
                      This website is a 100% static React SPA built for Netlify. Everything runs client-side with zero server dependencies!
                    </p>
                  </div>

                  {/* Netlify Steps Card */}
                  <div className="p-5 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                      How to Post to Netlify in 60 Seconds
                    </span>
                    <ol className="text-xs text-stone-300 space-y-2 list-decimal list-inside font-light">
                      <li>
                        Run <code className="bg-stone-900 px-1.5 py-0.5 rounded text-rose-300 font-mono">npm run build</code> which creates the production <code className="bg-stone-900 px-1.5 py-0.5 rounded text-rose-300 font-mono">dist</code> folder.
                      </li>
                      <li>
                        Go to <span className="text-white font-medium">app.netlify.com/drop</span> in your browser.
                      </li>
                      <li>
                        Drag and drop your <code className="bg-stone-900 px-1.5 py-0.5 rounded text-rose-300 font-mono">dist</code> folder directly onto the page.
                      </li>
                      <li>
                        Netlify gives you an instant live URL (e.g. <code className="bg-stone-900 px-1.5 py-0.5 rounded text-rose-300 font-mono">happy-birthday-aradhana.netlify.app</code>) to send her on January 23!
                      </li>
                    </ol>
                  </div>

                  {/* Instant Share Link with Compressed Photos/Customizations */}
                  <div className="p-5 rounded-xl bg-rose-950/40 border border-rose-900/60 space-y-3">
                    <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold">
                      <Share2 className="w-4 h-4" />
                      <span>Instant Encoded Share Link (Direct to Aradhana)</span>
                    </div>
                    <p className="text-xs text-stone-300">
                      Copy a special link that embeds all your uploaded photos, captions, and love letter for Aradhana directly:
                    </p>
                    <button
                      onClick={handleCopyShareLink}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {copiedShareLink ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copied Share Link to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-4 h-4" />
                          <span>Copy Personalized Share Link</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Download Config Backup */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => exportConfigAsJSON(formData)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download birthday-config.json</span>
                    </button>

                    <button
                      onClick={handleResetToDefaults}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-rose-400 border border-stone-800 text-xs font-medium cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset to Romantic Template</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between">
              <div className="text-[11px] text-stone-400">
                <span className="text-stone-300">Admin URLs:</span> <code className="text-rose-300">/?admin=true</code> or <code className="text-rose-300">/#admin</code> or press <code className="text-amber-300">Cmd+Shift+A</code>
              </div>
              <button
                onClick={() => {
                  handleSaveGeneral();
                  onClose();
                }}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save All & Close</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
