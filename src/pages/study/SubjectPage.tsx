import { Link, useParams } from "react-router-dom";
import { PageHeader, Card, Badge, Progress, StatusBadge, LinkButton } from "@/components/ui";
import { getSubject } from "@/data/subjects";
import { notes } from "@/data/notes";
import { questions } from "@/data/questions";
import { useChapterProgress } from "@/hooks/useStudyData";
import { NotFound } from "@/pages/NotFound";
import { statusLabel, type LearningStatus } from "@/types";
import { ArrowLeft, BookOpen, Dumbbell, ListChecks, FileText } from "lucide-react";
import { cx } from "@/lib/utils";

const statusOptions: LearningStatus[] = ["not-started", "learning", "practicing", "completed", "revision"];

export default function SubjectPage() {
  const { subject } = useParams();
  const subj = subject ? getSubject(subject) : undefined;
  const { statusOf, set, subjectProgress } = useChapterProgress();

  if (!subj) return <NotFound />;

  const progress = subjectProgress(subj.slug);
  const subjectNotes = notes.filter((n) => n.subject === subj.name);
  const subjectQuestions = questions.filter((q) => q.subject === subj.name);
  const nextChapter = subj.chapters.find((c) => statusOf(subj.slug, c.number, c.status) !== "completed");

  return (
    <div>
      <Link to="/study" className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-accent-500">
        <ArrowLeft className="h-4 w-4" /> Study Hub
      </Link>

      <PageHeader
        eyebrow={subj.difficulty}
        title={subj.name}
        subtitle={subj.description}
        actions={
          <div className="text-right">
            <p className="font-mono text-2xl text-accent-500">{progress}%</p>
            <p className="text-xs text-ink-400">{subj.chapters.length} chapters</p>
          </div>
        }
      />

      <Card className="mb-8 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-[200px] flex-1">
            <Progress value={progress} />
          </div>
          <div className="flex flex-wrap gap-2">
            {nextChapter && (
              <Badge tone="accent">Next: {String(nextChapter.number).padStart(2, "0")} {nextChapter.title}</Badge>
            )}
            {subjectNotes.length > 0 && (
              <LinkButton to="/study/notes" variant="secondary" size="sm">
                <FileText className="h-3.5 w-3.5" /> {subjectNotes.length} notes
              </LinkButton>
            )}
            {subjectQuestions.length > 0 && (
              <LinkButton
                to={`/study/quiz?subject=${encodeURIComponent(subj.name)}`}
                variant="secondary"
                size="sm"
              >
                <ListChecks className="h-3.5 w-3.5" /> Quiz
              </LinkButton>
            )}
            <LinkButton to="/study/practice" variant="secondary" size="sm">
              <Dumbbell className="h-3.5 w-3.5" /> Practice
            </LinkButton>
          </div>
        </div>
      </Card>

      <h2 className="mb-4 text-xl font-semibold tracking-tight">Chapters</h2>
      <div className="space-y-3">
        {subj.chapters.map((ch) => {
          const status = statusOf(subj.slug, ch.number, ch.status);
          return (
            <Card key={ch.number} className={cx("p-4", status === "completed" && "border-emerald-500/30")}>
              <div className="flex flex-wrap items-start gap-4">
                <span className="font-mono text-sm text-ink-300 dark:text-ink-600">
                  {String(ch.number).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium">{ch.title}</h3>
                    <StatusBadge status={status} />
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {ch.topics.map((t) => (
                      <span
                        key={t}
                        className="rounded bg-ink-100 px-1.5 py-0.5 font-mono text-[10px] text-ink-500 dark:bg-ink-800 dark:text-ink-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  {/* status setter */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {statusOptions.map((s) => (
                      <button
                        key={s}
                        onClick={() => set(subj.slug, ch.number, s)}
                        className={cx(
                          "rounded-full border px-2 py-0.5 text-[11px] transition-colors",
                          status === s
                            ? "border-accent-500/60 bg-accent-500/10 text-accent-600 dark:text-accent-400"
                            : "border-transparent text-ink-400 hover:border-ink-200 dark:hover:border-ink-700"
                        )}
                      >
                        {statusLabel[s]}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col gap-1.5">
                  {subjectNotes.some((n) => n.chapter === ch.title) && (
                    <Link
                      to="/study/notes"
                      className="inline-flex items-center gap-1 text-xs text-accent-500 hover:underline"
                    >
                      <BookOpen className="h-3 w-3" /> Notes
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
