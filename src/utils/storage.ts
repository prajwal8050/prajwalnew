import { BirthdayConfig } from '../types/birthday';
import { INITIAL_BIRTHDAY_DATA } from '../data/initialBirthdayData';

const STORAGE_KEY = 'forever_jan23_aradhana_prajwal_v2';

export function loadBirthdayConfig(): BirthdayConfig {
  if (typeof window === 'undefined') return INITIAL_BIRTHDAY_DATA;

  // Check URL hash/query for shared encoded configuration
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('data');
    if (encodedData) {
      const decoded = decodeURIComponent(atob(encodedData));
      const parsed = JSON.parse(decoded) as BirthdayConfig;
      if (parsed && parsed.version) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not decode URL data param:', e);
  }

  try {
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
      const encoded = hash.replace('#share=', '');
      const decoded = decodeURIComponent(atob(encoded));
      const parsed = JSON.parse(decoded) as BirthdayConfig;
      if (parsed && parsed.version) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not decode URL hash param:', e);
  }

  // Check LocalStorage
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as BirthdayConfig;
      if (parsed && parsed.version && Array.isArray(parsed.memories) && parsed.memories.length > 0 && parsed.surpriseBox) {
        // Upgrade any legacy paths to bundled images
        parsed.memories = parsed.memories.map((m, idx) => {
          if (!m.imageUrl || m.imageUrl.startsWith('/src/assets/images/')) {
            const defaultImg = INITIAL_BIRTHDAY_DATA.memories[idx]?.imageUrl || INITIAL_BIRTHDAY_DATA.memories[0].imageUrl;
            return { ...m, imageUrl: defaultImg };
          }
          return m;
        });
        if (!parsed.featuredHeroPhoto) {
          parsed.featuredHeroPhoto = INITIAL_BIRTHDAY_DATA.featuredHeroPhoto;
        }
        if (!parsed.surpriseBox.boxImageUrl) {
          parsed.surpriseBox.boxImageUrl = INITIAL_BIRTHDAY_DATA.surpriseBox.boxImageUrl;
        }
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not load from localStorage:', e);
  }

  return INITIAL_BIRTHDAY_DATA;
}

export function saveBirthdayConfig(config: BirthdayConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export function resetToDefaults(): BirthdayConfig {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
  return INITIAL_BIRTHDAY_DATA;
}

export function exportConfigAsJSON(config: BirthdayConfig): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', 'birthday-surprise-config.json');
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function generateShareUrl(config: BirthdayConfig): string {
  try {
    const jsonStr = JSON.stringify(config);
    const encoded = btoa(encodeURIComponent(jsonStr));
    const url = new URL(window.location.href);
    url.search = '';
    url.hash = `share=${encoded}`;
    return url.toString();
  } catch (e) {
    console.error('Failed to generate share link', e);
    return window.location.href;
  }
}

/**
 * Compresses an image file from user's disk to a high-quality, lightweight base64 data URL
 * so they can upload their real photos without any backend server.
 */
export function compressImageFile(file: File, maxWidth: number = 1600, quality: number = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image file for compression'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
