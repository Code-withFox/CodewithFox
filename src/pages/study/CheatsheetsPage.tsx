import { Link, useParams } from "react-router-dom";
import { PageHeader, Card } from "@/components/ui";
import { BookmarkButton } from "@/components/BookmarkButton";
import { cheatsheets } from "@/data/cheatsheets";
import { NotFound } from "@/pages/NotFound";
import { ArrowRight, ArrowLeft } from "lucide-react";

export function CheatsheetsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="/study/cheatsheets"
        title="Cheat sheets"
        subtitle="Quick-reference cards optimized for last-minute revision."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cheatsheets.map((c) => (
          <Link key={c.slug} to={`/study/cheatsheets/${c.slug}`} className="block">
            <Card interactive className="h-full p-5">
              <h2 className="font-semibold">{c.title}</h2>
              <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{c.description}</p>
              <p className="mt-3 flex items-center gap-1 text-xs text-accent-500">
                {c.sections.length} sections <ArrowRight className="h-3 w-3" />
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function CheatsheetDetail() {
  const { slug } = useParams();
  const sheet = cheatsheets.find((c) => c.slug === slug);
  if (!sheet) return <NotFound />;

  return (
    <div>
      <Link to="/study/cheatsheets" className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-accent-500">
        <ArrowLeft className="h-4 w-4" /> All cheat sheets
      </Link>
      <PageHeader
        eyebrow="Cheat sheet"
        title={sheet.title}
        subtitle={sheet.description}
        actions={<BookmarkButton path={`/study/cheatsheets/${sheet.slug}`} title={`${sheet.title} Cheat Sheet`} category="Cheat Sheets" />}
      />
      <div className="grid gap-4 md:grid-cols-2">
        {sheet.sections.map((s) => (
          <Card key={s.title} className="overflow-hidden">
            <h2 className="border-b border-ink-200 bg-ink-100/50 px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider dark:border-ink-700 dark:bg-ink-800/60">
              {s.title}
            </h2>
            <div className="divide-y divide-ink-100 dark:divide-ink-800">
              {s.rows.map(([cmd, desc]) => (
                <div key={cmd + desc} className="flex flex-col gap-0.5 px-4 py-2.5 sm:flex-row sm:items-baseline sm:gap-4">
                  <code className="shrink-0 font-mono text-xs text-accent-500 sm:w-40">{cmd}</code>
                  <span className="text-sm text-ink-600 dark:text-ink-300">{desc}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
