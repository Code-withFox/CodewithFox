import { Link, useParams } from "react-router-dom";
import { PageHeader, Card, Badge } from "@/components/ui";
import { notes } from "@/data/notes";
import { Markdown } from "@/components/Markdown";
import { BookmarkButton } from "@/components/BookmarkButton";
import { NotFound } from "@/pages/NotFound";
import { formatDate } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export default function NoteDetail() {
  const { slug } = useParams();
  const note = notes.find((n) => n.slug === slug);
  if (!note) return <NotFound />;

  const related = notes.filter((n) => n.slug !== note.slug && n.subject === note.subject).slice(0, 3);

  return (
    <article>
      <Link to="/study/notes" className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-accent-500">
        <ArrowLeft className="h-4 w-4" /> All notes
      </Link>

      <PageHeader
        eyebrow={`${note.subject}${note.chapter ? ` · ${note.chapter}` : ""}`}
        title={note.title}
        subtitle={note.summary}
        actions={
          <>
            <span className="text-xs text-ink-400">{formatDate(note.date)}</span>
            <BookmarkButton path={`/study/notes/${note.slug}`} title={note.title} category="Notes" />
          </>
        }
      />

      <Card className="p-6 sm:p-8">
        <Markdown content={note.markdown} />
        <div className="mt-6 flex flex-wrap gap-1.5 border-t border-ink-200 pt-4 dark:border-ink-700">
          {note.tags.map((t) => (
            <Badge key={t}>#{t}</Badge>
          ))}
        </div>
      </Card>

      {related.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-400">
            Related notes
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {related.map((r) => (
              <Link key={r.slug} to={`/study/notes/${r.slug}`}>
                <Card interactive className="h-full p-4">
                  <p className="text-sm font-medium">{r.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-ink-400">{r.summary}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
