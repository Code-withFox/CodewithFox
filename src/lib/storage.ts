/**
 * Central localStorage layer. Every feature that says "track" or "save"
 * actually persists here. Everything degrades gracefully without localStorage.
 */

const PREFIX = "cwf:";

function available(): boolean {
  try {
    const k = "__cwf_probe__";
    localStorage.setItem(k, "1");
    localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

const CAN = available();

export function load<T>(key: string, fallback: T): T {
  if (!CAN) return fallback;
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T): void {
  if (!CAN) return;
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("cwf:storage", { detail: { key } }));
  } catch {
    /* storage full or blocked */
  }
}

/** Subscribe to cwf keys across tabs/windows and same-window updates. */
export function subscribe(key: string, cb: () => void): () => void {
  const onCustom = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    if (!detail || detail.key === key) cb();
  };
  const onNative = (e: StorageEvent) => {
    if (!e.key || e.key === PREFIX + key) cb();
  };
  window.addEventListener("cwf:storage", onCustom);
  window.addEventListener("storage", onNative);
  return () => {
    window.removeEventListener("cwf:storage", onCustom);
    window.removeEventListener("storage", onNative);
  };
}
