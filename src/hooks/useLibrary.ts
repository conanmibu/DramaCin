import { useState, useEffect, useCallback } from 'react';
import type { Drama } from '../types/drama';

const STORAGE_KEY = 'dramacina_library';

export function useLibrary() {
  const [library, setLibrary] = useState<Drama[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setLibrary(JSON.parse(stored));
      } catch {
        setLibrary([]);
      }
    }
  }, []);

  const saveToStorage = useCallback((items: Drama[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, []);

  const addToLibrary = useCallback((drama: Drama) => {
    setLibrary((prev) => {
      const exists = prev.some((d) => d.shortPlayId === drama.shortPlayId);
      if (exists) return prev;
      const updated = [drama, ...prev];
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const removeFromLibrary = useCallback((shortPlayId: string) => {
    setLibrary((prev) => {
      const updated = prev.filter((d) => d.shortPlayId !== shortPlayId);
      saveToStorage(updated);
      return updated;
    });
  }, [saveToStorage]);

  const isInLibrary = useCallback((shortPlayId: string) => {
    return library.some((d) => d.shortPlayId === shortPlayId);
  }, [library]);

  const toggleLibrary = useCallback((drama: Drama) => {
    if (isInLibrary(drama.shortPlayId)) {
      removeFromLibrary(drama.shortPlayId);
    } else {
      addToLibrary(drama);
    }
  }, [isInLibrary, removeFromLibrary, addToLibrary]);

  return {
    library,
    addToLibrary,
    removeFromLibrary,
    isInLibrary,
    toggleLibrary,
  };
}
