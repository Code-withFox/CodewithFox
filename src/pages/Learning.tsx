import { Link } from "react-router-dom";
import { PageHeader, Card, LinkButton, Badge, Progress } from "@/components/ui";
import { roadmap } from "@/data/roadmap";
import { getSubject } from "@/data/subjects";
import { questions } from "@/data/questions";
import { notes } from "@/data/notes";
import { useRoadmapProgress, useChapterProgress } from "@/hooks/useStudyData";
import { Play, BookOpen, ListChecks, Dumbbell, ArrowRight } from "lucide-react";

export default function Learning() {
  const { statusOf } = useRoadmapProgress();
  const { subjectProgress } = useChapterProgress();

  // Next incomplete topic: first node not completed
  const nextNode =
    roadmap.find((n) => ["learning", "practicing"].includes(statusOf(n.id))) ??
    roadmap.find((n) => statusOf(n.id) === "not-started") ??
    null;
  const subject = nextNode?.subjectSlug ? getSubject(nextNode.subjectSlug) : undefined;
  const nodeNotes = subject ? notes.filter((n) => n.subject === subject.name) : [];
  const nodeQuestions = nextNode ? questions.filter((q) => q.subject === nextNode.quizSubject) : [];
  const progress = subject ? subjectProgress(subject.slug) : 0;

  return (
    <div>
      <PageHeader
        eyebrow="/learning"
        title="Start learning"
        subtitle="The system finds your next incomplete topic and bundles everything for it."
      />

      {!nextNode ? (
        <Card className="p-10 text-center">
          <p className="text-lg font-semibold">Roadmap complete! 🎉</p>
          <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
            Every stage is marked completed — time to set new goals or revisit for revision.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <LinkButton to="/study/revision">Start Revision</LinkButton>
            <LinkButton to="/roadmap" variant="secondary">Review Roadmap</LinkButton>
          </div>
        </Card>
      ) : (
        <div className="mx-auto max-w-2xl">
          <Card className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="accent">Next up</Badge>
              <Badge>{nextNode.area}</Badge>
              <span className="ml-auto font-mono text-xs text-ink-400">~{nextNode.estimatedHours}h total</span>
            </div>
            <h2 className="mt-3 text-2xl font-semibold">{nextNode.title}</h2>
            <p className="mt-2 text-ink-600 dark:text-ink-300">{nextNode.why}</p>

            {subject && (
              <>
                <div className="mt-5">
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-ink-400">{subject.name} progress</span>
                    <span className="font-mono text-accent-500">{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg border border-ink-200 p-3 dark:border-ink-700">
                    <p className="font-mono text-xl text-accent-500">{nodeNotes.length}</p>
                    <p className="text-[11px] text-ink-400">notes</p>
                  </div>
                  <div className="rounded-lg border border-ink-200 p-3 dark:border-ink-700">
                    <p className="font-mono text-xl text-accent-500">{nodeQuestions.length}</p>
                    <p className="text-[11px] text-ink-400">questions</p>
                  </div>
                  <div className="rounded-lg border border-ink-200 p-3 dark:border-ink-700">
                    <p className="font-mono text-xl text-accent-500">{subject.chapters.length}</p>
                    <p className="text-[11px] text-ink-400">chapters</p>
                  </div>
                </div>
              </>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              {subject && (
                <LinkButton to={`/study/${subject.slug}`} size="lg">
                  <Play className="h-4 w-4" /> Start Learning
                </LinkButton>
              )}
              {nextNode.quizSubject && (
                <LinkButton to={`/study/quiz?subject=${encodeURIComponent(nextNode.quizSubject)}`} size="lg" variant="secondary">
                  <ListChecks className="h-4 w-4" /> Quiz
                </LinkButton>
              )}
              <LinkButton to="/study/practice" size="lg" variant="secondary">
                <Dumbbell className="h-4 w-4" /> Practice
              </LinkButton>
            </div>
          </Card>

          {/* Session preview */}
          {subject && (
            <Card className="mt-4 p-5">
              <h3 className="text-sm font-semibold">In this subject</h3>
              <ul className="mt-2 space-y-1.5 text-sm">
                {subject.chapters.slice(0, 5).map((c) => (
                  <li key={c.number} className="flex items-center gap-2 text-ink-500 dark:text-ink-400">
                    <span className="font-mono text-xs">{String(c.number).padStart(2, "0")}</span>
                    {c.title}
                  </li>
                ))}
              </ul>
              <Link to={`/study/${subject.slug}`} className="mt-3 inline-flex items-center gap-1 text-sm text-accent-500 hover:underline">
                See all chapters <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Card>
          )}

          <Card className="mt-4 p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <BookOpen className="h-4 w-4 text-accent-500" /> Related notes
            </h3>
            {nodeNotes.length > 0 ? (
              <ul className="mt-2 space-y-1.5 text-sm">
                {nodeNotes.map((n) => (
                  <li key={n.slug}>
                    <Link to={`/study/notes/${n.slug}`} className="text-ink-600 hover:text-accent-500 dark:text-ink-300">
                      {n.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-ink-400">No notes linked yet.</p>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
