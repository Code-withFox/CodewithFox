import { Link } from "react-router-dom";
import { PageHeader, Card, EmptyState, LinkButton } from "@/components/ui";
import { useBookmarks } from "@/hooks/useStudyData";
import { Bookmark, X } from "lucide-react";

export default function Bookmarks() {
  const { items, remove } = useBookmarks();

  return (
    <div>
      <PageHeader
        eyebrow="/bookmarks"
        title="Bookmarks"
        subtitle="Everything you've saved across the platform — stored locally."
      />
      {items.length === 0 ? (
        <EmptyState
          title="No bookmarks yet"
          hint="Look for the bookmark button on projects, notes and articles."
          action={<LinkButton to="/study" variant="secondary">Browse Study Hub</LinkButton>}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((b) => (
            <Card key={b.path} className="flex items-center gap-3 p-4">
              <Bookmark className="h-4 w-4 shrink-0 fill-current text-accent-500" />
              <div className="min-w-0 flex-1">
                <Link to={b.path} className="block truncate font-medium hover:text-accent-500">
                  {b.title}
                </Link>
                <p className="text-xs text-ink-400">{b.category}</p>
              </div>
              <button
                onClick={() => remove(b.path)}
                aria-label={`Remove bookmark: ${b.title}`}
                className="rounded p-1.5 text-ink-400 hover:bg-ink-100 hover:text-red-500 dark:hover:bg-ink-800"
              >
                <X className="h-4 w-4" />
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
