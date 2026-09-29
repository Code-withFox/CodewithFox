import { useMemo } from "react";
import { useStudySessions } from "@/hooks/useStudyData";
import { dayKey, cx } from "@/lib/utils";

const WEEKS = 20;

interface DayCell {
  key: string;
  minutes: number;
  date: Date;
}

export function Heatmap() {
  const { heatmap } = useStudySessions();

  const cells = useMemo<DayCell[]>(() => {
    const out: DayCell[] = [];
    const today = new Date();
    // align to week start (Monday) for clean columns
    const start = new Date(today);
    start.setDate(today.getDate() - (WEEKS * 7 - 1) - ((today.getDay() + 6) % 7));
    for (let i = 0; i < WEEKS * 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = dayKey(d);
      out.push({ key, minutes: heatmap.get(key) ?? 0, date: d });
    }
    return out;
  }, [heatmap]);

  const level = (m: number) => {
    if (m === 0) return "bg-ink-100 dark:bg-ink-800";
    if (m < 30) return "bg-accent-500/25";
    if (m < 60) return "bg-accent-500/50";
    if (m < 120) return "bg-accent-500/75";
    return "bg-accent-500";
  };

  const today = dayKey(new Date());
  const months: { label: string; index: number }[] = [];
  cells.forEach((c, i) => {
    if (c.date.getDate() === 1) {
      months.push({
        label: c.date.toLocaleDateString(undefined, { month: "short" }),
        index: Math.floor(i / 7),
      });
    }
  });

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold">Study heatmap</h2>
        <div className="flex items-center gap-1 text-[10px] text-ink-400">
          less
          <span className="h-3 w-3 rounded-sm bg-ink-100 dark:bg-ink-800" />
          <span className="h-3 w-3 rounded-sm bg-accent-500/25" />
          <span className="h-3 w-3 rounded-sm bg-accent-500/50" />
          <span className="h-3 w-3 rounded-sm bg-accent-500/75" />
          <span className="h-3 w-3 rounded-sm bg-accent-500" />
          more
        </div>
      </div>
      <div className="overflow-x-auto pb-1">
        <div className="flex gap-[3px]">
          {/* weekday labels */}
          <div className="mr-1 flex flex-col gap-[3px] pt-[2px] text-[9px] text-ink-400">
            {["Mon", "", "Wed", "", "Fri", "", "Sun"].map((d, i) => (
              <span key={i} className="h-[14px] leading-[14px]">{d}</span>
            ))}
          </div>
          {/* columns = weeks; transpose the row-major cell array */}
          {Array.from({ length: WEEKS }).map((_, week) => (
            <div key={week} className="flex flex-col gap-[3px]">
              {Array.from({ length: 7 }).map((__, day) => {
                const cell = cells[week * 7 + day];
                if (!cell) return <span key={day} className="h-[14px] w-[14px]" />;
                const isToday = cell.key === today;
                return (
                  <span
                    key={day}
                    title={`${cell.key} — ${cell.minutes > 0 ? `${cell.minutes} min studied` : "no study"}`}
                    className={cx(
                      "h-[14px] w-[14px] rounded-sm",
                      level(cell.minutes),
                      isToday && "ring-1 ring-accent-400"
                    )}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {months.length > 0 && (
        <p className="mt-2 text-[10px] text-ink-400">
          {months.map((m) => m.label).join(" · ")}
        </p>
      )}
    </div>
  );
}
