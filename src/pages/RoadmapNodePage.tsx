import { Link, useParams } from "react-router-dom";
import { PageHeader, Card, Badge, LinkButton, StatusBadge, Progress } from "@/components/ui";
import { getRoadmapNode, roadmap } from "@/data/roadmap";
import { getSubject } from "@/data/subjects";
import { getProject } from "@/data/projects";
import { questions } from "@/data/questions";
import { useRoadmapProgress } from "@/hooks/useStudyData";
import { NotFound } from "@/pages/NotFound";
import { statusLabel, type LearningStatus } from "@/types";
import { ArrowLeft, ArrowRight, BookOpen, Dumbbell, ListChecks, FolderGit2, Briefcase } from "lucide-react";
import { cx } from "@/lib/utils";

const statusOptions: LearningStatus[] = ["not-started", "learning", "practicing", "completed", "revision"];

export default function RoadmapNodePage() {
  const { nodeId } = useParams();
  const node = nodeId ? getRoadmapNode(nodeId) : undefined;
  const { statusOf, set } = useRoadmapProgress();

  if (!node) return <NotFound />;

  const status = statusOf(node.id);
  const subject = node.subjectSlug ? getSubject(node.subjectSlug) : undefined;
  const prereqs = node.prerequisites
    .map((id) => roadmap.find((n) => n.id === id))
    .filter(Boolean);
  const relatedQuestions = questions.filter((q) => q.subject === node.quizSubject).length;
  const orderIndex = roadmap.findIndex((n) => n.id === node.id);
  const prev = roadmap[orderIndex - 1];
  const next = roadmap[orderIndex + 1];
  const progressPct = Math.round((orderIndex / roadmap.length) * 100);

  return (
    <div>
      <Link
        to="/roadmap"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-accent-500"
      >
        <ArrowLeft className="h-4 w-4" /> Back to roadmap
      </Link>

      <PageHeader
        eyebrow={`Stage ${String(node.order).padStart(2, "0")} · ${node.area}`}
        title={node.title}
        subtitle={node.why}
        actions={<StatusBadge status={status} />}
      />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-2 font-semibold">What this stage is</h2>
            <p className="text-[15px] leading-relaxed text-ink-600 dark:text-ink-300">{node.explanation}</p>

            {prereqs.length > 0 && (
              <>
                <h3 className="mt-5 text-sm font-semibold">Prerequisites</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {prereqs.map((p) => (
                    <Link key={p!.id} to={`/roadmap/${p!.id}`}>
                      <Badge tone="neutral" className="hover:border-accent-500/50">
                        {p!.title} →
                      </Badge>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="mb-3 font-semibold">Continue with this topic</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {subject && (
                <LinkButton to={`/study/${subject.slug}`} variant="secondary" className="justify-start">
                  <BookOpen className="h-4 w-4 text-accent-500" /> Study This
                  <span className="ml-auto text-xs text-ink-400">{subject.chapters.length} chapters</span>
                </LinkButton>
              )}
              {node.practiceSubject && (
                <LinkButton to="/study/practice" variant="secondary" className="justify-start">
                  <Dumbbell className="h-4 w-4 text-accent-500" /> Practice
                </LinkButton>
              )}
              {node.quizSubject && (
                <LinkButton
                  to={`/study/quiz?subject=${encodeURIComponent(node.quizSubject)}`}
                  variant="secondary"
                  className="justify-start"
                >
                  <ListChecks className="h-4 w-4 text-accent-500" /> Take Quiz
                  <span className="ml-auto text-xs text-ink-400">{relatedQuestions} questions</span>
                </LinkButton>
              )}
              {node.projectSlugs.length > 0 && (
                <LinkButton to={`/projects/${node.projectSlugs[0]}`} variant="secondary" className="justify-start">
                  <FolderGit2 className="h-4 w-4 text-accent-500" /> View Projects
                </LinkButton>
              )}
              <LinkButton
                to={`/study/interview?category=${encodeURIComponent(node.interviewCategory)}`}
                variant="secondary"
                className="justify-start"
              >
                <Briefcase className="h-4 w-4 text-accent-500" /> Interview Questions
              </LinkButton>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-3 font-semibold">Learning status</h2>
            <div className="space-y-1.5">
              {statusOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => set(node.id, s)}
                  className={cx(
                    "w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                    status === s
                      ? "border-accent-500/60 bg-accent-500/10 text-accent-600 dark:text-accent-400"
                      : "border-ink-200 text-ink-500 hover:border-ink-300 dark:border-ink-700 dark:text-ink-400"
                  )}
                >
                  {statusLabel[s]}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-ink-400">
              Saved locally — the roadmap progress bar is computed from these.
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="mb-2 font-semibold">Estimated effort</h2>
            <p className="font-mono text-2xl text-accent-500">~{node.estimatedHours}h</p>
            <div className="mt-4">
              <Progress value={progressPct} />
              <p className="mt-1.5 text-xs text-ink-400">
                Stage {node.order} of {roadmap.length} in the path
              </p>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-ink-200 pt-6 dark:border-ink-800">
        {prev ? (
          <Link to={`/roadmap/${prev.id}`} className="group inline-flex items-center gap-2 text-sm text-ink-500 hover:text-accent-500 dark:text-ink-400">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/roadmap/${next.id}`} className="group inline-flex items-center gap-2 text-sm text-ink-500 hover:text-accent-500 dark:text-ink-400">
            {next.title}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}
