import { useEffect, useState } from "react";

export type ThemeMode = "dark" | "light" | "system";

const KEY = "theme";

function systemDark(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem("cwf:" + KEY);
    return stored === "light" || stored === "dark" || stored === "system" ? stored : "dark";
  });

  useEffect(() => {
    const apply = () => {
      const dark = mode === "dark" || (mode === "system" && systemDark());
      document.documentElement.classList.toggle("dark", dark);
      document.documentElement.style.colorScheme = dark ? "dark" : "light";
    };
    apply();
    localStorage.setItem("cwf:" + KEY, mode);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (mode === "system") apply();
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  return { mode, setMode, isDark: mode === "dark" || (mode === "system" && systemDark()) };
}
