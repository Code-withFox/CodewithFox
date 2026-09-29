import { Link } from "react-router-dom";
import { PageHeader, Card, Badge, Reveal } from "@/components/ui";
import { projects } from "@/data/projects";
import { ArrowRight } from "lucide-react";

export default function Projects() {
  return (
    <div>
      <PageHeader
        eyebrow="Projects"
        title="Things I've built"
        subtitle="Real projects with real architecture write-ups. Click through for problems, solutions, challenges and lessons."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.08}>
            <Link to={`/projects/${p.slug}`} className="block h-full">
              <Card interactive className="flex h-full flex-col p-6">
                <div className="flex items-center justify-between">
                  <Badge tone={p.status === "building" ? "amber" : p.status === "shipped" ? "green" : "neutral"}>
                    {p.status}
                  </Badge>
                  <span className="font-mono text-xs text-ink-400">{p.period}</span>
                </div>
                <h2 className="mt-4 text-lg font-semibold">{p.name}</h2>
                <p className="mt-1 text-sm text-accent-500">{p.tagline}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-500 dark:text-ink-400">
                  {p.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {p.technologies.map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-ink-100 px-2 py-0.5 font-mono text-[10px] text-ink-500 dark:bg-ink-800 dark:text-ink-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <span className="mt-5 inline-flex items-center gap-1 text-sm text-accent-500">
                  Read case study <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Card>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
