import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-ink-950 p-6 text-ink-100">
          <div className="max-w-md rounded-xl border border-ink-700 bg-ink-900 p-8 text-center">
            <p className="text-accent-400 font-mono text-sm">// something broke</p>
            <h1 className="mt-2 text-xl font-semibold">An error occurred</h1>
            <p className="mt-2 text-sm text-ink-400">{this.state.error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 rounded-lg bg-accent-500 px-4 py-2 text-sm font-medium text-ink-950 hover:bg-accent-400"
            >
              Reload
            </button>
            <Link to="/" className="mt-3 block text-sm text-ink-400 hover:text-ink-200">
              Return home
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
