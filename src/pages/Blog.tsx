import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader, Card, Badge, inputClass, Reveal } from "@/components/ui";
import { blogPosts } from "@/data/blog";
import { formatDate } from "@/lib/utils";
import { Search } from "lucide-react";
import { cx } from "@/lib/utils";

export default function Blog() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  const tags = useMemo(() => [...new Set(blogPosts.flatMap((p) => p.tags))], []);

  const filtered = useMemo(
    () =>
      blogPosts.filter((p) => {
        if (tag && !p.tags.includes(tag)) return false;
        if (!query) return true;
        const q = query.toLowerCase();
        return p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q);
      }),
    [query, tag]
  );

  return (
    <div>
      <PageHeader
        eyebrow="Blog"
        title="Writing"
        subtitle="Learning in public — what I built, what broke, what I'd do differently."
      />

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            className={cx(inputClass, "pl-9")}
            aria-label="Search articles"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setTag(null)}
            className={cx(
              "rounded-full border px-3 py-1.5 text-xs",
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
                "rounded-full border px-3 py-1.5 text-xs",
                tag === t
                  ? "border-accent-500/50 bg-accent-500/10 text-accent-600 dark:text-accent-400"
                  : "border-ink-200 text-ink-500 dark:border-ink-700 dark:text-ink-400"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((post, i) => (
          <Reveal key={post.slug} delay={i * 0.05}>
            <Link to={`/blog/${post.slug}`} className="block">
              <Card interactive className="p-6">
                <div className="flex flex-wrap items-center gap-3 text-xs text-ink-400">
                  <span>{formatDate(post.date)}</span>
                  <span>·</span>
                  <span>{post.readingTime} min read</span>
                  <span className="ml-auto flex gap-1.5">
                    {post.tags.map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </span>
                </div>
                <h2 className="mt-2 text-lg font-semibold">{post.title}</h2>
                <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{post.summary}</p>
              </Card>
            </Link>
          </Reveal>
        ))}
        {filtered.length === 0 && (
          <p className="py-16 text-center text-sm text-ink-400">No articles found.</p>
        )}
      </div>
    </div>
  );
}
