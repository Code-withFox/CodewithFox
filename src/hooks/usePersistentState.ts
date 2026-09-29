import { useCallback, useEffect, useState } from "react";
import { load, save, subscribe } from "@/lib/storage";

/** State synced to localStorage; updates broadcast to all usePersistentState consumers. */
export function usePersistentState<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    const stored = load<T>(key, initial);
    if (
      stored !== null &&
      typeof stored === "object" &&
      !Array.isArray(stored) &&
      typeof initial === "object" &&
      initial !== null &&
      !Array.isArray(initial)
    ) {
      return { ...(initial as object), ...(stored as object) } as T;
    }
    return stored;
  });

  const set = useCallback(
    (v: T | ((p: T) => T)) => {
      setValue((prev) => {
        const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
        save(key, next);
        return next;
      });
    },
    [key]
  );

  useEffect(() => {
    return subscribe(key, () => {
      const stored = load<T>(key, initial);
      setValue(stored);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [value, set];
}
