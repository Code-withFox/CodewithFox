import { Link } from "react-router-dom";
import { PageHeader, Card, Badge, Progress } from "@/components/ui";
import { useRoadmapProgress, useChapterProgress, useQuizAttempts, useStudySessions, useFlashcards, useGoals } from "@/hooks/useStudyData";
import { roadmap } from "@/data/roadmap";
import { subjects } from "@/data/subjects";
import { projects } from "@/data/projects";
import { nowEntry, dashboardConfig } from "@/data/now";
import { formatMinutes } from "@/lib/utils";
import { Flame, Timer, ListChecks, Target, TrendingDown, Layers } from "lucide-react";

export default function Dashboard() {
  const { completed, started, total, statusOf } = useRoadmapProgress();
  const { subjectProgress } = useChapterProgress();
  const { accuracy, weakTopics, attempts } = useQuizAttempts();
  const { streak, weekMinutes, monthMinutes, totalMinutes, mostStudied } = useStudySessions();
  const { dueToday } = useFlashcards();
  const { goals } = useGoals();

  const roadmapPct = Math.round((completed / total) * 100);
  const topSubjects = [...subjects]
    .map((s) => ({ name: s.name, progress: subjectProgress(s.slug) }))
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 5);

  const activeProjects = projects.filter((p) => p.status === "building");
  const nextUp = roadmap.find((n) => statusOf(n.id) === "learning") ?? roadmap.find((n) => statusOf(n.id) === "not-started");

  const cards = [
    {
      icon: Flame,
      label: "Learning streak",
      value: streak > 0 ? `${streak} day${streak > 1 ? "s" : ""}` : "No streak yet",
      hint: "Days with logged study time",
    },
    {
      icon: Timer,
      label: "Study time",
      value: formatMinutes(totalMinutes),
      hint: `${formatMinutes(weekMinutes)} this week · ${formatMinutes(monthMinutes)} this month`,
    },
    {
      icon: ListChecks,
      label: "Quiz accuracy",
      value: accuracy() !== null ? `${accuracy()}%` : "—",
      hint: `${attempts.length} attempts recorded`,
    },
    {
      icon: Layers,
      label: "Roadmap",
      value: `${roadmapPct}%`,
      hint: `${started}/${total} stages started · ${completed} completed`,
    },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="/dashboard"
        title="Learning dashboard"
        subtitle="Every number here is computed from your actual activity — no invented stats."
      />

      {/* Current focus banner */}
      <Card className="mb-6 flex flex-wrap items-center gap-4 p-5">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-ink-400">Current focus</p>
          <p className="mt-0.5 text-lg font-semibold">{nowEntry.focus}</p>
          <p className="mt-0.5 text-sm text-ink-500 dark:text-ink-400">Next milestone: {nowEntry.nextMilestone}</p>
        </div>
        {nextUp && (
          <Link to={`/roadmap/${nextUp.id}`} className="text-sm text-accent-500 hover:underline">
            Continue: {nextUp.title} →
          </Link>
        )}
      </Card>

      {/* Stat cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} className="p-5">
            <c.icon className="h-4 w-4 text-accent-500" />
            <p className="mt-3 font-mono text-2xl">{c.value}</p>
            <p className="text-xs font-medium text-ink-500 dark:text-ink-400">{c.label}</p>
            <p className="mt-1 text-[11px] text-ink-400">{c.hint}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Subject progress */}
        <Card className="p-6">
          <h2 className="font-semibold">Subject progress</h2>
          <ul className="mt-4 space-y-3">
            {topSubjects.map((s) => (
              <li key={s.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>{s.name}</span>
                  <span className="font-mono text-accent-500">{s.progress}%</span>
                </div>
                <Progress value={s.progress} />
              </li>
            ))}
          </ul>
          <Link to="/study" className="mt-4 inline-block text-sm text-accent-500 hover:underline">
            Open Study Hub →
          </Link>
        </Card>

        {/* Weak topics */}
        <Card className="p-6">
          <h2 className="flex items-center gap-2 font-semibold">
            <TrendingDown className="h-4 w-4 text-amber-500" /> Weak topics
          </h2>
          {weakTopics().length === 0 ? (
            <p className="mt-3 text-sm text-ink-400">
              {attempts.length === 0 ? "Take a quiz to find your weak topics." : "Nothing weak right now."}
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {weakTopics().map((w) => (
                <li key={w.topic}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>{w.topic}</span>
                    <span className="font-mono text-amber-500">{w.score}%</span>
                  </div>
                  <Progress value={w.score} />
                </li>
              ))}
            </ul>
          )}
          <Link to="/study/revision" className="mt-4 inline-block text-sm text-accent-500 hover:underline">
            Start revision →
          </Link>
        </Card>

        {/* Goals */}
        <Card className="p-6">
          <h2 className="flex items-center gap-2 font-semibold">
            <Target className="h-4 w-4 text-accent-500" /> Goals
          </h2>
          <ul className="mt-4 space-y-3">
            {goals.map((g) => (
              <li key={g.id}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span>{g.title}</span>
                  <span className="font-mono text-accent-500">{g.progress}%</span>
                </div>
                <Progress value={g.progress} />
              </li>
            ))}
          </ul>
          <Link to="/study/goals" className="mt-4 inline-block text-sm text-accent-500 hover:underline">
            Manage goals →
          </Link>
        </Card>

        {/* Projects + revision queue */}
        <Card className="p-6">
          <h2 className="font-semibold">Active projects</h2>
          <ul className="mt-3 space-y-2">
            {activeProjects.map((p) => (
              <li key={p.slug}>
                <Link to={`/projects/${p.slug}`} className="flex items-center justify-between rounded-lg border border-ink-200 p-3 text-sm hover:border-accent-500/40 dark:border-ink-700">
                  <span className="font-medium">{p.name}</span>
                  <Badge tone="amber">building</Badge>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 border-t border-ink-200 pt-4 dark:border-ink-700">
            <p className="text-sm">
              <span className="font-medium text-accent-500">{dueToday.length}</span> flashcards due for review
            </p>
            <Link to="/study/flashcards" className="mt-1 inline-block text-sm text-accent-500 hover:underline">
              Review now →
            </Link>
          </div>
        </Card>
      </div>

      <p className="mt-8 text-center text-xs text-ink-400">
        Weekly target: {formatMinutes(dashboardConfig.weeklyTargetMinutes)} · currently{" "}
        {formatMinutes(weekMinutes)} ({Math.round((weekMinutes / dashboardConfig.weeklyTargetMinutes) * 100)}%)
      </p>
    </div>
  );
}
