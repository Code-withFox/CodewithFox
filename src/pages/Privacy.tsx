import { PageHeader, Card } from "@/components/ui";

export default function Privacy() {
  return (
    <div>
      <PageHeader
        eyebrow="Privacy"
        title="Privacy"
        subtitle="Short version: your data stays on your device."
      />
      <Card className="max-w-3xl space-y-5 p-6 text-[15px] leading-relaxed text-ink-600 dark:text-ink-300">
        <p>
          <strong className="text-ink-900 dark:text-ink-100">Local storage only.</strong> All study
          progress — roadmap statuses, quiz attempts, study sessions, flashcard reviews, bookmarks,
          goals and notes — is stored in your browser's localStorage. Nothing is sent to a server.
        </p>
        <p>
          <strong className="text-ink-900 dark:text-ink-100">No accounts.</strong> The site works
          without login. Clearing your browser data resets everything.
        </p>
        <p>
          <strong className="text-ink-900 dark:text-ink-100">No trackers.</strong> No analytics
          scripts, no cookies, no fingerprinting.
        </p>
        <p>
          <strong className="text-ink-900 dark:text-ink-100">Contact form.</strong> It validates
          input locally and opens your own email client — nothing is transmitted or stored by the
          site itself.
        </p>
        <p>
          <strong className="text-ink-900 dark:text-ink-100">External links.</strong> GitHub,
          LinkedIn and resource links lead to third-party sites with their own policies.
        </p>
      </Card>
    </div>
  );
}
