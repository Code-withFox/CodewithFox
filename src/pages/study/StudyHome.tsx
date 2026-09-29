import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader, Card, Badge, Progress, Reveal, inputClass } from "@/components/ui";
import { subjects } from "@/data/subjects";
import { notes } from "@/data/notes";
import { questions } from "@/data/questions";
import { flashcards } from "@/data/flashcards";
import { useChapterProgress, useFlashcards, useQuizAttempts, useStudySessions } from "@/hooks/useStudyData";
import { Search } from "lucide-react";
import { cx } from "@/lib/utils";

export default function StudyHome() {
  const [query, setQuery] = useState("");
  const { subjectProgress } = useChapterProgress();
  const { dueToday } = useFlashcards();
  const { streak } = useStudySessions();
  const { accuracy } = useQuizAttempts();

  const stats = [
    { label: "Subjects", value: subjects.length },
    { label: "Notes", value: notes.length },
    { label: "Flashcards", value: flashcards.length },
    { label: "Questions", value: questions.length },
  ];

  const filtered = useMemo(() => {
    if (!query) return subjects;
    const q = query.toLowerCase();
    return subjects.filter(
      (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div>
      <PageHeader
        eyebrow="Study Hub"
        title="Study Hub"
        subtitle="Learn. Practice. Build. Repeat. — my personal learning operating system."
      />

      {/* Top strip */}
      <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-4 text-center">
            <p className="font-mono text-2xl text-accent-500">{s.value}</p>
            <p className="text-xs text-ink-400">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Continue row */}
      <div className="mb-10 grid gap-3 sm:grid-cols-3">
        <Link to="/study/today">
          <Card interactive className="p-4">
            <p className="text-xs text-ink-400">Today</p>
            <p className="mt-1 font-medium">Plan & Timer →</p>
          </Card>
        </Link>
        <Link to="/study/revision">
          <Card interactive className="p-4">
            <p className="text-xs text-ink-400">
              {dueToday.length > 0 ? `${dueToday.length} cards due` : "All caught up"}
            </p>
            <p className="mt-1 font-medium">Revision →</p>
          </Card>
        </Link>
        <Link to="/dashboard">
          <Card interactive className="p-4">
            <p className="text-xs text-ink-400">
              {streak > 0 ? `${streak}-day streak` : "No streak yet"} ·{" "}
              {accuracy() !== null ? `${accuracy()}% accuracy` : "no quizzes yet"}
            </p>
            <p className="mt-1 font-medium">Dashboard →</p>
          </Card>
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold tracking-tight">Subjects</h2>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subjects…"
            className={cx(inputClass, "pl-9")}
            aria-label="Search subjects"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s, i) => {
          const progress = subjectProgress(s.slug);
          const noteCount = notes.filter((n) => n.subject === s.name).length;
          const qCount = questions.filter((q) => q.subject === s.name).length;
          return (
            <Reveal key={s.slug} delay={Math.min(i * 0.04, 0.3)}>
              <Link to={`/study/${s.slug}`} className="block h-full">
                <Card interactive className="flex h-full flex-col p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold">{s.name}</h3>
                    <Badge
                      tone={s.difficulty === "Beginner" ? "green" : s.difficulty === "Intermediate" ? "amber" : "red"}
                    >
                      {s.difficulty}
                    </Badge>
                  </div>
                  <p className="mt-1.5 flex-1 text-sm text-ink-500 dark:text-ink-400">{s.description}</p>
                  <div className="mt-4 flex gap-3 font-mono text-[11px] text-ink-400">
                    <span>{s.chapters.length} chapters</span>
                    {noteCount > 0 && <span>{noteCount} notes</span>}
                    {qCount > 0 && <span>{qCount} questions</span>}
                  </div>
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-ink-400">Progress</span>
                      <span className="font-mono text-accent-500">{progress}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                </Card>
              </Link>
            </Reveal>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-sm text-ink-400">No subjects match “{query}”.</p>
      )}
    </div>
  );
}
