import { useCallback, useState } from "react";

const STORAGE_KEY = "masar_saved_resources";

function readSavedIds() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useSavedResources() {
  const [savedIds, setSavedIds] = useState(readSavedIds);

  const persist = useCallback((updated) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // storage quota exceeded or unavailable
    }
  }, []);

  const toggleSave = useCallback(
    (resourceId) => {
      setSavedIds((prev) => {
        const updated = prev.includes(resourceId)
          ? prev.filter((id) => id !== resourceId)
          : [...prev, resourceId];
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  const isSaved = useCallback(
    (resourceId) => savedIds.includes(resourceId),
    [savedIds]
  );

  const clearSaved = useCallback(() => {
    setSavedIds([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return {
    savedIds,
    toggleSave,
    isSaved,
    savedCount: savedIds.length,
    clearSaved,
  };
}
