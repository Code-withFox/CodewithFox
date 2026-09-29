import { useMemo, useState } from "react";
import { PageHeader, Card, Badge, inputClass } from "@/components/ui";
import { resources } from "@/data/resources";
import { ExternalLink, Search } from "lucide-react";
import { cx } from "@/lib/utils";

const categories = ["Docs", "Course", "Article", "Video", "Book", "GitHub", "Tool"] as const;

export default function ResourcesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      resources.filter((r) => {
        if (category && r.category !== category) return false;
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          r.title.toLowerCase().includes(q) ||
          r.provider.toLowerCase().includes(q) ||
          r.topics.some((t) => t.toLowerCase().includes(q))
        );
      }),
    [query, category]
  );

  return (
    <div>
      <PageHeader
        eyebrow="/study/resources"
        title="Resource library"
        subtitle="Curated external resources — official documentation and trusted sources only. No invented links."
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search resources…"
            className={cx(inputClass, "pl-9")}
            aria-label="Search resources"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setCategory(null)}
            className={cx(
              "rounded-full border px-3 py-1 text-xs",
              category === null
                ? "border-accent-500/50 bg-accent-500/10 text-accent-600 dark:text-accent-400"
                : "border-ink-200 text-ink-500 dark:border-ink-700 dark:text-ink-400"
            )}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cx(
                "rounded-full border px-3 py-1 text-xs",
                category === c
                  ? "border-accent-500/50 bg-accent-500/10 text-accent-600 dark:text-accent-400"
                  : "border-ink-200 text-ink-500 dark:border-ink-700 dark:text-ink-400"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {filtered.map((r) => (
          <a key={r.id} href={r.url} target="_blank" rel="noreferrer">
            <Card interactive className="h-full p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-medium">{r.title}</h2>
                  <p className="text-xs text-ink-400">{r.provider}</p>
                </div>
                <Badge tone="blue">{r.category}</Badge>
              </div>
              <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">{r.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {r.topics.map((t) => (
                    <span key={t} className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-[10px] text-ink-500 dark:bg-ink-800 dark:text-ink-400">
                      {t}
                    </span>
                  ))}
                </div>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-ink-400" />
              </div>
            </Card>
          </a>
        ))}
      </div>
      {filtered.length === 0 && <p className="py-16 text-center text-sm text-ink-400">Nothing found.</p>}
    </div>
  );
}
