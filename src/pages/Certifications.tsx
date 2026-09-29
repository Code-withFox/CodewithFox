import { PageHeader, Card } from "@/components/ui";
import { certifications, certificationNote } from "@/data/certifications";
import { Award } from "lucide-react";

export default function Certifications() {
  return (
    <div>
      <PageHeader
        eyebrow="/certifications"
        title="Certification vault"
        subtitle="Real credentials only. This page exists so they have a home the moment they're earned."
      />
      {certifications.length === 0 ? (
        <Card className="flex flex-col items-center p-12 text-center">
          <Award className="h-10 w-10 text-ink-300 dark:text-ink-600" />
          <p className="mt-4 max-w-md text-ink-600 dark:text-ink-300">{certificationNote}</p>
          <p className="mt-2 font-mono text-xs text-ink-400">
            planned: SQL · cloud fundamentals · data engineering certs
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {certifications.map((c) => (
            <Card key={c.name} className="p-5">
              <h2 className="font-semibold">{c.name}</h2>
              <p className="text-sm text-ink-500 dark:text-ink-400">
                {c.provider} · {c.date}
              </p>
              {c.verifyUrl && (
                <a href={c.verifyUrl} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-accent-500 hover:underline">
                  Verify credential →
                </a>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
