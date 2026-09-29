import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader, Card, Badge, Button, Progress, EmptyState } from "@/components/ui";
import { useQuizAttempts, useFlashcards, useBookmarks, useStudySessions } from "@/hooks/useStudyData";
import { notes } from "@/data/notes";
import { formatMinutes } from "@/lib/utils";
import { Flame, Brain, Bookmark, RefreshCcw } from "lucide-react";

export default function RevisionPage() {
  const { weakTopics, attempts } = useQuizAttempts();
  const { all: cards, dueToday, deck, grade } = useFlashcards();
  const { items: bookmarks } = useBookmarks();
  const { mostStudied } = useStudySessions();
  const [sessionIndex, setSessionIndex] = useState(0);
  const [started, setStarted] = useState(false);

  const dueCards = useMemo(() => dueToday.slice(0, 10), [dueToday]);
  const recentNotes = useMemo(() => [...notes].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3), []);

  const sessionCards = started ? dueCards.slice(sessionIndex) : [];

  return (
    <div>
      <PageHeader
        eyebrow="/study/revision"
        title="Revision"
        subtitle="Weak topics, due flashcards, failed questions and recent notes — combined into one session."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weak topics */}
        <Card className="p-6">
          <h2 className="flex items-center gap-2 font-semibold">
            <Flame className="h-4 w-4 text-red-400" /> Weak topics
          </h2>
          {weakTopics().length === 0 ? (
            <p className="mt-3 text-sm text-ink-400">
              {attempts.length === 0
                ? "Take a quiz first — weak topics are computed from wrong answers."
                : "No weak topics detected. Keep the streak going."}
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {weakTopics().map((w) => (
                <li key={w.topic}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium">{w.topic}</span>
                    <span className="font-mono text-amber-500">{w.score}%</span>
                  </div>
                  <Progress value={w.score} />
                </li>
              ))}
            </ul>
          )}
          <Link
            to="/study/quiz"
            className="mt-5 inline-block text-sm text-accent-500 hover:underline"
          >
            Practice these in a quiz →
          </Link>
        </Card>

        {/* Due cards */}
        <Card className="p-6">
          <h2 className="flex items-center gap-2 font-semibold">
            <Brain className="h-4 w-4 text-accent-500" /> Today's revision
          </h2>
          <p className="mt-1 text-sm text-ink-400">
            {dueToday.length > 0 ? `${dueToday.length} cards due` : "All cards reviewed — nothing due."}
          </p>

          {!started && dueCards.length > 0 && (
            <Button className="mt-4" onClick={() => setStarted(true)}>
              <RefreshCcw className="h-4 w-4" /> Start Revision Session
            </Button>
          )}

          {started && sessionCards.length > 0 && (
            <div className="mt-4">
              <Card className="p-5">
                <div className="mb-2 flex items-center gap-2">
                  <Badge tone="accent">{sessionCards[0].subject}</Badge>
                  <span className="text-xs text-ink-400">
                    {sessionIndex + 1} / {dueCards.length}
                  </span>
                </div>
                <p className="font-medium">{sessionCards[0].front}</p>
                <details className="mt-3">
                  <summary className="cursor-pointer text-xs text-accent-500">Show answer</summary>
                  <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">{sessionCards[0].back}</p>
                </details>
                <div className="mt-4 grid grid-cols-4 gap-1.5">
                  <Button size="sm" variant="danger" onClick={() => { grade(sessionCards[0].id, "again"); setSessionIndex((i) => i + 1); }}>
                    Again
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => { grade(sessionCards[0].id, "hard"); setSessionIndex((i) => i + 1); }}>
                    Hard
                  </Button>
                  <Button size="sm" onClick={() => { grade(sessionCards[0].id, "good"); setSessionIndex((i) => i + 1); }}>
                    Good
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => { grade(sessionCards[0].id, "easy"); setSessionIndex((i) => i + 1); }}>
                    Easy
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {started && sessionCards.length === 0 && (
            <p className="mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-600 dark:text-emerald-400">
              Session complete — {dueCards.length} cards reviewed. Come back tomorrow.
            </p>
          )}

          {deck.mastered.length > 0 && (
            <p className="mt-4 text-xs text-ink-400">{deck.mastered.length} cards mastered so far</p>
          )}
        </Card>

        {/* Recent notes */}
        <Card className="p-6">
          <h2 className="font-semibold">Recently studied material</h2>
          {mostStudied && (
            <p className="mt-1 text-xs text-ink-400">
              Most-studied subject: {mostStudied.subject} ({formatMinutes(mostStudied.minutes)})
            </p>
          )}
          <ul className="mt-3 space-y-2">
            {recentNotes.map((n) => (
              <li key={n.slug}>
                <Link to={`/study/notes/${n.slug}`} className="block rounded-lg border border-ink-200 p-3 text-sm hover:border-accent-500/40 dark:border-ink-700">
                  {n.title}
                  <span className="ml-2 text-xs text-ink-400">{n.subject}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        {/* Bookmarks */}
        <Card className="p-6">
          <h2 className="flex items-center gap-2 font-semibold">
            <Bookmark className="h-4 w-4 text-accent-500" /> Bookmarked
          </h2>
          {bookmarks.length === 0 ? (
            <p className="mt-3 text-sm text-ink-400">No bookmarks yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {bookmarks.slice(0, 5).map((b) => (
                <li key={b.path}>
                  <Link to={b.path} className="block rounded-lg border border-ink-200 p-3 text-sm hover:border-accent-500/40 dark:border-ink-700">
                    {b.title}
                    <span className="ml-2 text-xs text-ink-400">{b.category}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {dueCards.length === 0 && !started && attempts.length === 0 && (
        <div className="mt-6">
          <EmptyState
            title="Nothing queued for revision"
            hint="Take a quiz and study some flashcards — revision builds itself from there."
          />
        </div>
      )}
    </div>
  );
}
