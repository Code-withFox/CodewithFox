import { Bookmark } from "lucide-react";
import { useBookmarks } from "@/hooks/useStudyData";
import { cx } from "@/lib/utils";

export function BookmarkButton({
  path,
  title,
  category,
}: {
  path: string;
  title: string;
  category: string;
}) {
  const { has, toggle } = useBookmarks();
  const saved = has(path);
  return (
    <button
      onClick={() => toggle({ path, title, category })}
      aria-pressed={saved}
      aria-label={saved ? "Remove bookmark" : "Add bookmark"}
      className={cx(
        "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-colors",
        saved
          ? "border-accent-500/60 bg-accent-500/10 text-accent-600 dark:text-accent-400"
          : "border-ink-200 text-ink-500 hover:border-accent-500/40 dark:border-ink-700 dark:text-ink-400"
      )}
    >
      <Bookmark className={cx("h-3.5 w-3.5", saved && "fill-current")} />
      {saved ? "Bookmarked" : "Bookmark"}
    </button>
  );
}
