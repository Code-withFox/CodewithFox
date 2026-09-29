import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Search, Menu, X, Sun, Moon, TerminalSquare } from "lucide-react";
import { CommandPalette } from "@/components/CommandPalette";
import { useTheme } from "@/hooks/useTheme";
import { profile } from "@/data/profile";
import { cx } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/skills", label: "Skills" },
  { to: "/roadmap", label: "Roadmap" },
  { to: "/projects", label: "Projects" },
  { to: "/study", label: "Study Hub" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export function SiteLayout() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mode, setMode, isDark } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const title = "Code With Fox | Aspiring Data Engineer";
    document.title = title;
  }, []);

  return (
    <div className="min-h-screen bg-ink-50 text-ink-900 dark:bg-ink-950 dark:text-ink-100">
      <ScrollToTop />
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-64 bg-gradient-to-b from-accent-500/8 to-transparent dark:from-accent-500/10"
      />

      <header className="sticky top-0 z-50 border-b border-ink-200/70 bg-ink-50/80 backdrop-blur-md dark:border-ink-800/80 dark:bg-ink-950/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span aria-hidden className="text-lg">🦊</span>
            <span>Code With Fox</span>
          </Link>

          <nav aria-label="Primary" className="ml-6 hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cx(
                    "rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "text-accent-600 dark:text-accent-400"
                      : "text-ink-600 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-100"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={() => setPaletteOpen(true)}
              className="hidden items-center gap-2 rounded-lg border border-ink-200 px-3 py-1.5 text-xs text-ink-400 transition-colors hover:border-accent-500/50 hover:text-ink-600 sm:flex dark:border-ink-700 dark:hover:text-ink-300"
              aria-label="Search (Ctrl+K)"
            >
              <Search className="h-3.5 w-3.5" />
              Search
              <kbd className="rounded border border-ink-300 px-1 font-mono text-[10px] dark:border-ink-600">⌘K</kbd>
            </button>
            <Link
              to="/terminal"
              className="hidden rounded-lg border border-ink-200 p-2 text-ink-500 transition-colors hover:border-accent-500/50 hover:text-accent-500 sm:block dark:border-ink-700"
              aria-label="Open terminal"
              title="Developer terminal"
            >
              <TerminalSquare className="h-4 w-4" />
            </Link>
            <button
              onClick={() => setMode(isDark ? "light" : "dark")}
              className="rounded-lg border border-ink-200 p-2 text-ink-500 transition-colors hover:border-accent-500/50 hover:text-accent-500 dark:border-ink-700"
              aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="rounded-lg border border-ink-200 p-2 text-ink-500 lg:hidden dark:border-ink-700"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav aria-label="Mobile" className="border-t border-ink-200/70 bg-ink-50 px-4 py-3 lg:hidden dark:border-ink-800 dark:bg-ink-950">
            <div className="grid grid-cols-2 gap-1">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    cx(
                      "rounded-lg px-3 py-2.5 text-sm",
                      isActive
                        ? "bg-accent-500/10 text-accent-600 dark:text-accent-400"
                        : "text-ink-600 dark:text-ink-300"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <NavLink
                to="/dashboard"
                className="rounded-lg px-3 py-2.5 text-sm text-ink-600 dark:text-ink-300"
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/terminal"
                className="rounded-lg px-3 py-2.5 text-sm text-ink-600 dark:text-ink-300"
              >
                Terminal
              </NavLink>
            </div>
          </nav>
        )}
      </header>

      <main id="main" className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Outlet />
      </main>

      <footer className="mt-16 border-t border-ink-200/70 dark:border-ink-800/80">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <p className="flex items-center gap-2 font-semibold">
                <span aria-hidden>🦊</span> {profile.brand}
              </p>
              <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
                {profile.role} · {profile.philosophy}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-10 gap-y-1 text-sm sm:grid-cols-3">
              <Link to="/projects" className="text-ink-500 hover:text-accent-500 dark:text-ink-400">Projects</Link>
              <Link to="/roadmap" className="text-ink-500 hover:text-accent-500 dark:text-ink-400">Roadmap</Link>
              <Link to="/study" className="text-ink-500 hover:text-accent-500 dark:text-ink-400">Study Hub</Link>
              <Link to="/dashboard" className="text-ink-500 hover:text-accent-500 dark:text-ink-400">Dashboard</Link>
              <Link to="/resume" className="text-ink-500 hover:text-accent-500 dark:text-ink-400">Resume</Link>
              <Link to="/privacy" className="text-ink-500 hover:text-accent-500 dark:text-ink-400">Privacy</Link>
            </div>
          </div>
          <p className="mt-8 text-xs text-ink-400 dark:text-ink-500">
            © {new Date().getFullYear()} {profile.brand}. Built with React, TypeScript & Tailwind. Build. Learn. Debug. Repeat.
          </p>
        </div>
      </footer>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
