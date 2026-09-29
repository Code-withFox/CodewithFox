import { Link, useParams } from "react-router-dom";
import { PageHeader, Card, Badge, LinkButton } from "@/components/ui";
import { blogPosts } from "@/data/blog";
import { Markdown } from "@/components/Markdown";
import { BookmarkButton } from "@/components/BookmarkButton";
import { NotFound } from "@/pages/NotFound";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return <NotFound />;

  const idx = blogPosts.findIndex((p) => p.slug === slug);
  const prev = blogPosts[idx + 1];
  const next = blogPosts[idx - 1];
  const related = blogPosts
    .filter((p) => p.slug !== post.slug && p.tags.some((t) => post.tags.includes(t)))
    .slice(0, 2);

  return (
    <article>
      <Link to="/blog" className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-accent-500">
        <ArrowLeft className="h-4 w-4" /> All articles
      </Link>

      <PageHeader
        eyebrow={post.tags.join(" · ")}
        title={post.title}
        subtitle={post.summary}
        actions={
          <>
            <span className="inline-flex items-center gap-1.5 text-xs text-ink-400">
              <Clock className="h-3.5 w-3.5" /> {post.readingTime} min · {formatDate(post.date)}
            </span>
            <BookmarkButton path={`/blog/${post.slug}`} title={post.title} category="Blog" />
          </>
        }
      />

      <Card className="p-6 sm:p-8">
        <Markdown content={post.markdown} />
      </Card>

      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-lg font-semibold">Related posts</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {related.map((r) => (
              <Link key={r.slug} to={`/blog/${r.slug}`}>
                <Card interactive className="h-full p-5">
                  <h3 className="font-medium">{r.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-ink-500 dark:text-ink-400">{r.summary}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 flex items-center justify-between border-t border-ink-200 pt-6 dark:border-ink-800">
        {prev ? (
          <Link to={`/blog/${prev.slug}`} className="group inline-flex items-center gap-2 text-sm text-ink-500 hover:text-accent-500 dark:text-ink-400">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/blog/${next.slug}`} className="group inline-flex items-center gap-2 text-sm text-ink-500 hover:text-accent-500 dark:text-ink-400">
            {next.title}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : (
          <span />
        )}
      </div>
    </article>
  );
}
