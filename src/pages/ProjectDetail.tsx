import { Link, useParams } from "react-router-dom";
import { PageHeader, Card, Badge, LinkButton } from "@/components/ui";
import { getProject } from "@/data/projects";
import { NotFound } from "@/pages/NotFound";
import { ArchitectureFlow } from "@/components/ArchitectureFlow";
import { BookmarkButton } from "@/components/BookmarkButton";
import { Github, ExternalLink, FileText, ArrowLeft } from "lucide-react";

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = slug ? getProject(slug) : undefined;
  if (!project) return <NotFound />;

  return (
    <div>
      <Link
        to="/projects"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-accent-500"
      >
        <ArrowLeft className="h-4 w-4" /> All projects
      </Link>

      <PageHeader
        eyebrow={project.tagline}
        title={project.name}
        subtitle={project.description}
        actions={
          <>
            <BookmarkButton
              path={`/projects/${project.slug}`}
              title={project.name}
              category="Projects"
            />
            {project.github && (
              <LinkButton to={project.github} external variant="secondary" size="sm">
                <Github className="h-3.5 w-3.5" /> GitHub
              </LinkButton>
            )}
            {project.demo && (
              <LinkButton to={project.demo} external variant="secondary" size="sm">
                <ExternalLink className="h-3.5 w-3.5" /> Demo
              </LinkButton>
            )}
            {project.docs && (
              <LinkButton to={project.docs} external variant="secondary" size="sm">
                <FileText className="h-3.5 w-3.5" /> Docs
              </LinkButton>
            )}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold">Problem</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-600 dark:text-ink-300">{project.problem}</p>
            <h2 className="mt-6 text-lg font-semibold">Solution</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-600 dark:text-ink-300">{project.solution}</p>
          </Card>

          {project.kind === "data" && (
            <Card className="p-6">
              <h2 className="mb-1 text-lg font-semibold">Architecture</h2>
              <p className="mb-4 text-sm text-ink-400">
                Animated data flow — click any stage for details. This mirrors the real project.
              </p>
              <ArchitectureFlow flow={project.architectureFlow} />
            </Card>
          )}

          {project.kind !== "data" && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold">Architecture</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-600 dark:text-ink-300">
                {project.architecture}
              </p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {project.architectureFlow.map((f, i) => (
                  <div key={f.label} className="rounded-lg border border-ink-200 p-3 dark:border-ink-700">
                    <p className="font-mono text-xs text-accent-500">{String(i + 1).padStart(2, "0")}</p>
                    <p className="mt-0.5 text-sm font-medium">{f.label}</p>
                    <p className="text-xs text-ink-400">{f.detail}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-6">
            <h2 className="text-lg font-semibold">Challenges</h2>
            <ul className="mt-3 space-y-2">
              {project.challenges.map((c) => (
                <li key={c} className="flex gap-2 text-sm text-ink-600 dark:text-ink-300">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-accent-500" />
                  {c}
                </li>
              ))}
            </ul>
            <h2 className="mt-6 text-lg font-semibold">Lessons learned</h2>
            <ul className="mt-3 space-y-2">
              {project.lessons.map((l) => (
                <li key={l} className="flex gap-2 text-sm text-ink-600 dark:text-ink-300">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-emerald-500" />
                  {l}
                </li>
              ))}
            </ul>
            <h2 className="mt-6 text-lg font-semibold">Future improvements</h2>
            <ul className="mt-3 space-y-2">
              {project.future.map((f) => (
                <li key={f} className="flex gap-2 text-sm text-ink-500 dark:text-ink-400">
                  <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-ink-300 dark:bg-ink-600" />
                  {f}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-semibold">Technology</h2>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.technologies.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
            <h3 className="mt-5 text-sm font-semibold">Features</h3>
            <ul className="mt-2 space-y-1.5">
              {project.features.map((f) => (
                <li key={f} className="flex gap-2 text-sm text-ink-500 dark:text-ink-400">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-500" />
                  {f}
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2 border-t border-ink-200 pt-4 text-sm dark:border-ink-700">
              <div className="flex justify-between">
                <dt className="text-ink-400">Status</dt>
                <dd className="font-medium capitalize">{project.status}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-400">Period</dt>
                <dd className="font-medium">{project.period}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-400">Type</dt>
                <dd className="font-medium capitalize">{project.kind}</dd>
              </div>
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}
