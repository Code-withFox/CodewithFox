import { useState } from "react";
import { PageHeader, Card, Button, Badge, Progress, inputClass, EmptyState } from "@/components/ui";
import { useGoals } from "@/hooks/useStudyData";
import { formatDate } from "@/lib/utils";
import { Plus, Trash2, Target, Check } from "lucide-react";

export default function GoalsPage() {
  const { goals, update, add, remove } = useGoals();
  const [showNew, setShowNew] = useState(false);
  const [draft, setDraft] = useState({ title: "", description: "", deadline: "" });

  return (
    <div>
      <PageHeader
        eyebrow="/study/goals"
        title="Goal tracker"
        subtitle="Learning goals with deadlines and progress. Stored locally, honest by default."
        actions={
          <Button size="sm" onClick={() => setShowNew((s) => !s)}>
            <Plus className="h-3.5 w-3.5" /> New goal
          </Button>
        }
      />

      {showNew && (
        <Card className="mb-6 p-5">
          <h2 className="font-semibold">Create a goal</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input
              className={inputClass}
              placeholder="Goal title"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
            <input
              className={inputClass}
              type="date"
              value={draft.deadline}
              onChange={(e) => setDraft({ ...draft, deadline: e.target.value })}
              aria-label="Deadline"
            />
            <input
              className={inputClass}
              placeholder="Description (optional)"
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            />
          </div>
          <div className="mt-3 flex gap-2">
            <Button
              onClick={() => {
                if (draft.title.trim()) {
                  add({ ...draft, title: draft.title.trim(), progress: 0, milestones: [] });
                  setDraft({ title: "", description: "", deadline: "" });
                  setShowNew(false);
                }
              }}
            >
              Save goal
            </Button>
            <Button variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      {goals.length === 0 ? (
        <EmptyState title="No goals yet" hint="Create your first learning goal." />
      ) : (
        <div className="space-y-4">
          {goals.map((g) => {
            const overdue = g.deadline && new Date(g.deadline) < new Date() && g.progress < 100;
            return (
              <Card key={g.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Target className="h-4 w-4 text-accent-500" />
                      <h2 className="font-semibold">{g.title}</h2>
                      {g.progress >= 100 ? (
                        <Badge tone="green"><Check className="h-3 w-3" /> Complete</Badge>
                      ) : overdue ? (
                        <Badge tone="red">Overdue</Badge>
                      ) : (
                        g.deadline && <Badge tone="neutral">by {formatDate(g.deadline)}</Badge>
                      )}
                    </div>
                    {g.description && (
                      <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{g.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => remove(g.id)}
                    className="text-ink-300 hover:text-red-500"
                    aria-label={`Delete goal ${g.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4">
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="text-ink-400">{g.progress}%</span>
                    <span className="font-mono text-accent-500">
                      {"█".repeat(Math.round(g.progress / 10))}
                      {"░".repeat(10 - Math.round(g.progress / 10))}
                    </span>
                  </div>
                  <Progress value={g.progress} />
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={g.progress}
                      onChange={(e) => update(g.id, { progress: Number(e.target.value) })}
                      className="flex-1 accent-orange-500"
                      aria-label={`Progress for ${g.title}`}
                    />
                    {g.progress >= 100 && (
                      <Button size="sm" variant="ghost" onClick={() => update(g.id, { progress: 0 })}>
                        Reset
                      </Button>
                    )}
                  </div>
                </div>

                {g.milestones.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {g.milestones.map((m, i) => {
                      const done = (i + 1) * (100 / g.milestones.length) <= g.progress + 0.001;
                      return (
                        <span
                          key={m}
                          className={
                            "rounded-full border px-2 py-0.5 text-[11px] " +
                            (done
                              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "border-ink-200 text-ink-400 dark:border-ink-700")
                          }
                        >
                          {m}
                        </span>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
