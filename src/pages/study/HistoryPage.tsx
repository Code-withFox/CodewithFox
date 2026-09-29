import { PageHeader, Card, EmptyState, LinkButton } from "@/components/ui";
import { useStudySessions } from "@/hooks/useStudyData";
import { Heatmap } from "@/components/Heatmap";
import { formatMinutes, formatDate } from "@/lib/utils";
import { Trash2 } from "lucide-react";

export default function HistoryPage() {
  const { sessions, remove, totalMinutes } = useStudySessions();

  return (
    <div>
      <PageHeader
        eyebrow="/study/history"
        title="Study history"
        subtitle="Every logged session. This feeds the streak, heatmap and analytics."
        actions={
          <span className="font-mono text-sm text-ink-400">
            Total: {formatMinutes(totalMinutes)}
          </span>
        }
      />

      {sessions.length === 0 ? (
        <EmptyState
          title="No sessions logged yet"
          hint="Run the study timer on the Today page — sessions land here."
          action={<LinkButton to="/study/today" variant="secondary">Open Today</LinkButton>}
        />
      ) : (
        <>
          <Card className="mb-6 p-5">
            <Heatmap />
          </Card>
          <div className="space-y-2">
            {sessions.map((s) => (
              <Card key={s.id} className="flex items-center gap-4 p-4">
                <span className="hidden font-mono text-xs text-ink-400 sm:block">{formatDate(s.date)}</span>
                <Badge tone="accent">{s.subject}</Badge>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{s.topic}</p>
                  {s.notes && <p className="truncate text-xs text-ink-400">{s.notes}</p>}
                </div>
                <span className="font-mono text-sm text-accent-500">{formatMinutes(s.minutes)}</span>
                <button
                  onClick={() => remove(s.id)}
                  aria-label="Delete session"
                  className="text-ink-300 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Badge({ tone, children }: { tone: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-accent-500/40 bg-accent-500/10 px-2 py-0.5 text-[11px] font-medium text-accent-600 dark:text-accent-400">
      {children}
    </span>
  );
}
