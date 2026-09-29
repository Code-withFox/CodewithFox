import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader, Card, Badge, inputClass, Button, EmptyState } from "@/components/ui";
import { notes } from "@/data/notes";
import { useQuickNotes } from "@/hooks/useStudyData";
import { formatDate } from "@/lib/utils";
import { Search, Plus, StickyNote, X } from "lucide-react";
import { cx } from "@/lib/utils";

export default function NotesPage() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const { items: quick, add, remove } = useQuickNotes();
  const [draft, setDraft] = useState("");

  const tags = useMemo(() => [...new Set(notes.flatMap((n) => n.tags))], []);
  const filtered = useMemo(
    () =>
      notes.filter((n) => {
        if (tag && !n.tags.includes(tag)) return false;
        if (!query) return true;
        const q = query.toLowerCase();
        return (
          n.title.toLowerCase().includes(q) ||
          n.summary.toLowerCase().includes(q) ||
          n.markdown.toLowerCase().includes(q)
        );
      }),
    [query, tag]
  );

  return (
    <div>
      <PageHeader
        eyebrow="/study/notes"
        title="Study notes"
        subtitle="Markdown notes linked to subjects and chapters — searchable and taggable."
      />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search notes…"
                className={cx(inputClass, "pl-9")}
                aria-label="Search notes"
              />
            </div>
          </div>
          <div className="mb-5 flex flex-wrap gap-1.5">
            <button
              onClick={() => setTag(null)}
              className={cx(
                "rounded-full border px-3 py-1 text-xs",
                tag === null
                  ? "border-accent-500/50 bg-accent-500/10 text-accent-600 dark:text-accent-400"
                  : "border-ink-200 text-ink-500 dark:border-ink-700 dark:text-ink-400"
              )}
            >
              All
            </button>
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => setTag(t)}
                className={cx(
                  "rounded-full border px-3 py-1 text-xs",
                  tag === t
                    ? "border-accent-500/50 bg-accent-500/10 text-accent-600 dark:text-accent-400"
                    : "border-ink-200 text-ink-500 dark:border-ink-700 dark:text-ink-400"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((n) => (
              <Link key={n.slug} to={`/study/notes/${n.slug}`} className="block">
                <Card interactive className="p-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-ink-400">
                    <Badge tone="accent">{n.subject}</Badge>
                    {n.chapter && <span>{n.chapter}</span>}
                    <span className="ml-auto">{formatDate(n.date)}</span>
                  </div>
                  <h2 className="mt-2 font-semibold">{n.title}</h2>
                  <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{n.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {n.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-[10px] text-ink-500 dark:bg-ink-800 dark:text-ink-400"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </Card>
              </Link>
            ))}
            {filtered.length === 0 && (
              <EmptyState title="No notes found" hint="Try a different search or tag." />
            )}
          </div>
        </div>

        {/* Quick notes */}
        <div>
          <Card className="p-5">
            <h2 className="flex items-center gap-2 font-semibold">
              <StickyNote className="h-4 w-4 text-accent-500" /> Quick notes
            </h2>
            <p className="mt-1 text-xs text-ink-400">
              Personal one-liners — saved locally, always visible while you study.
            </p>
            <div className="mt-3 flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && draft.trim()) {
                    add(draft.trim());
                    setDraft("");
                  }
                }}
                placeholder="e.g. LEFT JOIN keeps all left rows"
                className={inputClass}
                aria-label="New quick note"
              />
              <Button
                onClick={() => {
                  if (draft.trim()) {
                    add(draft.trim());
                    setDraft("");
                  }
                }}
                aria-label="Add quick note"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <ul className="mt-4 space-y-2">
              {quick.map((q) => (
                <li
                  key={q.id}
                  className="group flex items-start gap-2 rounded-lg border border-ink-200 p-3 text-sm dark:border-ink-700"
                >
                  <span className="flex-1 text-ink-600 dark:text-ink-300">{q.text}</span>
                  <button
                    onClick={() => remove(q.id)}
                    aria-label="Delete note"
                    className="text-ink-300 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
              {quick.length === 0 && (
                <li className="py-4 text-center text-xs text-ink-400">No quick notes yet</li>
              )}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
