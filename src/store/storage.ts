import { createJSONStorage } from "zustand/middleware";

/**
 * localStorage wrapper that never throws (private mode, blocked storage, SSR).
 * Only non-sensitive demo data is persisted: product ids, options, quantities and codes.
 */
export const safeStorage = createJSONStorage(() => {
  try {
    const probe = "__tavique__";
    window.localStorage.setItem(probe, probe);
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    const memory = new Map<string, string>();
    return {
      getItem: (k: string) => memory.get(k) ?? null,
      setItem: (k: string, v: string) => void memory.set(k, v),
      removeItem: (k: string) => void memory.delete(k),
    };
  }
});
