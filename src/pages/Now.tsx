import { PageHeader, Card, Badge, Reveal } from "@/components/ui";
import { nowEntry } from "@/data/now";
import { formatDate } from "@/lib/utils";
import { BookOpen, Hammer, Target, Compass, Flag, Telescope } from "lucide-react";

export default function Now() {
  const sections = [
    { icon: BookOpen, title: "Learning", items: nowEntry.learning },
    { icon: Hammer, title: "Building", items: nowEntry.building },
    { icon: Target, title: "Goals", items: nowEntry.goals },
    { icon: Telescope, title: "Exploring", items: nowEntry.exploring },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="/now"
        title="What I'm up to now"
        subtitle="A living snapshot of my current state — updated as focus shifts."
        actions={<Badge tone="neutral">Updated {formatDate(nowEntry.updated)}</Badge>}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.06}>
            <Card className="h-full p-5">
              <h2 className="flex items-center gap-2 font-semibold">
                <s.icon className="h-4 w-4 text-accent-500" />
                {s.title}
              </h2>
              <ul className="mt-3 space-y-1.5">
                {s.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-ink-600 dark:text-ink-300">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <h2 className="flex items-center gap-2 font-semibold">
            <Compass className="h-4 w-4 text-accent-500" /> Current focus
          </h2>
          <p className="mt-2 text-ink-600 dark:text-ink-300">{nowEntry.focus}</p>
        </Card>
        <Card className="p-5">
          <h2 className="flex items-center gap-2 font-semibold">
            <Flag className="h-4 w-4 text-accent-500" /> Next milestone
          </h2>
          <p className="mt-2 text-ink-600 dark:text-ink-300">{nowEntry.nextMilestone}</p>
        </Card>
      </div>
    </div>
  );
}
