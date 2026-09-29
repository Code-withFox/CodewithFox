import { Link } from "react-router-dom";
import { PageHeader, Card, Progress, StatusBadge } from "@/components/ui";
import { roadmap } from "@/data/roadmap";
import { useRoadmapProgress } from "@/hooks/useStudyData";
import { CheckCircle2, Circle, ArrowDown } from "lucide-react";
import { cx } from "@/lib/utils";

const areaLabels: Record<string, string> = {
  Foundations: "01 · Foundations",
  Data: "02 · Data",
  Engineering: "03 · Engineering",
  Systems: "04 · Systems",
};

export default function Roadmap() {
  const { statusOf, completed, total } = useRoadmapProgress();
  const pct = Math.round((completed / total) * 100);

  return (
    <div>
      <PageHeader
        eyebrow="Roadmap"
        title="Data Engineering Roadmap"
        subtitle="Sixteen stages from first program to system design. Each node links to study material, practice, quizzes and projects. Progress below is real — set your status on each node."
        actions={
          <div className="text-right">
            <p className="font-mono text-2xl text-accent-500">{pct}%</p>
            <p className="text-xs text-ink-400">
              {completed}/{total} completed
            </p>
          </div>
        }
      />

      <Card className="mb-10 p-4">
        <Progress value={pct} />
        <div className="mt-2 flex justify-between text-[11px] text-ink-400">
          <span>Foundations</span>
          <span>Data</span>
          <span>Engineering</span>
          <span>Systems</span>
        </div>
      </Card>

      <div className="relative space-y-3">
        {roadmap.map((node, i) => {
          const status = statusOf(node.id);
          const done = status === "completed";
          return (
            <div key={node.id}>
              <Link to={`/roadmap/${node.id}`} className="block">
                <Card
                  interactive
                  className={cx(
                    "flex items-center gap-4 p-4",
                    done && "border-emerald-500/30 bg-emerald-500/[0.03]"
                  )}
                >
                  <span className="font-mono text-sm text-ink-300 dark:text-ink-600">
                    {String(node.order).padStart(2, "0")}
                  </span>
                  {done ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                  ) : (
                    <Circle
                      className={cx(
                        "h-5 w-5 shrink-0",
                        status === "not-started"
                          ? "text-ink-300 dark:text-ink-600"
                          : "text-accent-500"
                      )}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-medium">{node.title}</h2>
                      <StatusBadge status={status} />
                      <span className="hidden font-mono text-[10px] uppercase tracking-wider text-ink-400 sm:inline">
                        {node.area}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-ink-500 dark:text-ink-400">{node.why}</p>
                  </div>
                  <span className="hidden shrink-0 font-mono text-xs text-ink-400 sm:block">
                    ~{node.estimatedHours}h
                  </span>
                </Card>
              </Link>
              {i < roadmap.length - 1 && (
                <div className="flex justify-start pl-[13px]" aria-hidden>
                  <ArrowDown className="h-4 w-4 text-ink-300 dark:text-ink-700" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-center text-xs text-ink-400">
        {areaLabels.Foundations} → {areaLabels.Systems} · statuses saved locally, progress calculated from them
      </p>
    </div>
  );
}
