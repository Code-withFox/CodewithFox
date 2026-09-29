import { LinkButton } from "@/components/ui";

export function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-mono text-7xl font-semibold text-accent-500/90">404</p>
      <h1 className="mt-4 text-xl font-medium text-ink-700 dark:text-ink-200">
        Looks like this data pipeline
        <br />
        went somewhere unexpected.
      </h1>
      <p className="mt-3 font-mono text-xs text-ink-400">
        Error: row not found in table `pages`
      </p>
      <div className="mt-8 flex gap-3">
        <LinkButton to="/">Return Home</LinkButton>
        <LinkButton to="/roadmap" variant="secondary">
          View Roadmap
        </LinkButton>
      </div>
    </div>
  );
}

export default NotFound;
