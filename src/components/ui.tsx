import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, reducedMotion } from "@/lib/motion";
import { cx } from "@/lib/utils";
import { statusLabel, type LearningStatus } from "@/types";

/* ---------------------------------- Button --------------------------------- */

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/70 disabled:opacity-50 disabled:pointer-events-none";

const btnVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent-500 text-ink-950 hover:bg-accent-400 shadow-glow-sm dark:text-ink-950 text-[#1a1005]",
  secondary:
    "border border-ink-300 dark:border-ink-700 text-ink-800 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800/70",
  ghost: "text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800/60",
  danger: "bg-red-500/90 text-white hover:bg-red-500",
};

const btnSizes: Record<ButtonSize, string> = {
  sm: "text-xs px-3 py-1.5",
  md: "text-sm px-4 py-2",
  lg: "text-base px-5 py-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <button className={cx(btnBase, btnVariants[variant], btnSizes[size], className)} {...rest} />;
}

export function LinkButton({
  to,
  variant = "primary",
  size = "md",
  className,
  children,
  external,
}: {
  to: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
  external?: boolean;
}) {
  const cls = cx(btnBase, btnVariants[variant], btnSizes[size], className);
  if (external) {
    return (
      <a href={to} target="_blank" rel="noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={cls}>
      {children}
    </Link>
  );
}

/* ----------------------------------- Card ---------------------------------- */

export function Card({
  className,
  children,
  interactive,
}: {
  className?: string;
  children: ReactNode;
  interactive?: boolean;
}) {
  return (
    <div
      className={cx(
        "rounded-xl border border-ink-200 bg-white/70 dark:border-ink-700/80 dark:bg-ink-900/60 backdrop-blur-sm",
        interactive && "transition-colors hover:border-accent-500/50 hover:bg-white dark:hover:bg-ink-800/60",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ---------------------------------- Badge ---------------------------------- */

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "green" | "amber" | "red" | "blue";
  className?: string;
}) {
  const tones = {
    neutral: "border-ink-300 text-ink-600 dark:border-ink-700 dark:text-ink-300",
    accent: "border-accent-500/40 text-accent-500 dark:text-accent-400 bg-accent-500/10",
    green: "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
    amber: "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10",
    red: "border-red-500/40 text-red-600 dark:text-red-400 bg-red-500/10",
    blue: "border-sky-500/40 text-sky-600 dark:text-sky-400 bg-sky-500/10",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

const statusTone: Record<LearningStatus, "neutral" | "accent" | "green" | "amber" | "blue"> = {
  "not-started": "neutral",
  learning: "accent",
  practicing: "amber",
  completed: "green",
  revision: "blue",
};

export function StatusBadge({ status }: { status: LearningStatus }) {
  return <Badge tone={statusTone[status]}>{statusLabel[status]}</Badge>;
}

/* --------------------------------- Progress -------------------------------- */

export function Progress({ value, className }: { value: number; className?: string }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      role="progressbar"
      aria-valuenow={v}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cx("h-1.5 w-full overflow-hidden rounded-full bg-ink-200 dark:bg-ink-800", className)}
    >
      <div
        className="h-full rounded-full bg-gradient-to-r from-accent-600 to-accent-400"
        style={{ width: `${v}%` }}
      />
    </div>
  );
}

/* ------------------------------- Page header ------------------------------- */

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-10">
      {eyebrow && (
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-accent-500 dark:text-accent-400">
          {eyebrow}
        </p>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-ink-900 dark:text-ink-50 sm:text-4xl">
          {title}
        </h1>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
      {subtitle && <p className="mt-3 max-w-2xl text-ink-500 dark:text-ink-400">{subtitle}</p>}
    </header>
  );
}

/* --------------------------------- Reveal ---------------------------------- */

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={reducedMotion() ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------- Empty state ------------------------------- */

export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-ink-300 dark:border-ink-700 p-10 text-center">
      <p className="text-ink-700 dark:text-ink-200">{title}</p>
      {hint && <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{hint}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

/* ---------------------------------- Input ---------------------------------- */

export const inputClass =
  "w-full rounded-lg border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500/50 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100";

export function Select({
  className,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cx(inputClass, "pr-8", className)} {...rest} />;
}
