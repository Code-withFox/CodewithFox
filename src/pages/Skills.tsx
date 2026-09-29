import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader, Card, Badge, inputClass } from "@/components/ui";
import { skills, skillCategories } from "@/data/skills";
import { Search, ArrowUpRight } from "lucide-react";
import { cx } from "@/lib/utils";

const statusTone = {
  used: "green",
  learning: "accent",
  exploring: "blue",
} as const;

const statusText = {
  used: "Used in projects",
  learning: "Learning",
  exploring: "Exploring",
};

export default function Skills() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return skills.filter((s) => {
      if (category && s.category !== category) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.blurb.toLowerCase().includes(q) ||
        s.related.some((r) => r.toLowerCase().includes(q))
      );
    });
  }, [query, category]);

  return (
    <div>
      <PageHeader
        eyebrow="Skills"
        title="Skill explorer"
        subtitle="Honest statuses only — nothing is marked as mastered that isn't. Used means used in a real project."
      />

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter skills…"
            className={cx(inputClass, "pl-9")}
            aria-label="Filter skills"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setCategory(null)}
            className={cx(
              "rounded-full border px-3 py-1.5 text-xs transition-colors",
              category === null
                ? "border-accent-500/50 bg-accent-500/10 text-accent-600 dark:text-accent-400"
                : "border-ink-200 text-ink-500 hover:border-ink-300 dark:border-ink-700 dark:text-ink-400"
            )}
          >
            All
          </button>
          {skillCategories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cx(
                "rounded-full border px-3 py-1.5 text-xs transition-colors",
                category === c
                  ? "border-accent-500/50 bg-accent-500/10 text-accent-600 dark:text-accent-400"
                  : "border-ink-200 text-ink-500 hover:border-ink-300 dark:border-ink-700 dark:text-ink-400"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <Card key={s.id} interactive className="flex h-full flex-col p-5">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-semibold">{s.name}</h2>
              <Badge tone={statusTone[s.status]}>{statusText[s.status]}</Badge>
            </div>
            <p className="mt-2 flex-1 text-sm text-ink-500 dark:text-ink-400">{s.blurb}</p>
            {s.usedIn.length > 0 && (
              <p className="mt-3 text-xs text-ink-400">
                Used in: {s.usedIn.map((u) => u.replace(/-/g, " ")).join(", ")}
              </p>
            )}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {s.related.slice(0, 3).map((r) => (
                  <span
                    key={r}
                    className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-[10px] text-ink-500 dark:bg-ink-800 dark:text-ink-400"
                  >
                    {r}
                  </span>
                ))}
              </div>
              {s.studyPath && (
                <Link
                  to={s.studyPath}
                  className="inline-flex items-center gap-0.5 text-xs text-accent-500 hover:underline"
                >
                  Study <ArrowUpRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-sm text-ink-400">No skills match “{query}”.</p>
      )}
    </div>
  );
}
