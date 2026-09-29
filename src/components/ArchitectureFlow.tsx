import { useState } from "react";
import { AnimatePresence, motion, reducedMotion } from "@/lib/motion";
import { ArrowDown } from "lucide-react";
import { cx } from "@/lib/utils";

interface Stage {
  label: string;
  detail: string;
}

export function ArchitectureFlow({ flow }: { flow: Stage[] }) {
  const [active, setActive] = useState<number | null>(null);
  const reduce = reducedMotion();

  return (
    <div className="mx-auto max-w-md">
      {flow.map((stage, i) => (
        <div key={stage.label}>
          <button
            onClick={() => setActive(active === i ? null : i)}
            className={cx(
              "relative w-full rounded-lg border px-4 py-2.5 text-left text-sm font-medium transition-all",
              active === i
                ? "border-accent-500/70 bg-accent-500/10 text-accent-600 dark:text-accent-400"
                : "border-ink-200 bg-white/60 text-ink-700 hover:border-accent-500/40 dark:border-ink-700 dark:bg-ink-900/60 dark:text-ink-200"
            )}
          >
            {/* moving pulse dot for data-in-motion effect */}
            {!reduce && (
              <motion.span
                className="absolute right-3 h-1.5 w-1.5 rounded-full bg-accent-400"
                animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.35 }}
              />
            )}
            <span className="font-mono text-[10px] text-ink-400">{String(i + 1).padStart(2, "0")}</span>{" "}
            {stage.label}
          </button>
          <AnimatePresence>
            {active === i && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden px-4 pt-2 text-xs leading-relaxed text-ink-500 dark:text-ink-400"
              >
                {stage.detail}
              </motion.p>
            )}
          </AnimatePresence>
          {i < flow.length - 1 && (
            <div className="flex justify-center py-1" aria-hidden>
              <ArrowDown className={cx("h-4 w-4", reduce ? "text-ink-300" : "text-accent-400/70")} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
