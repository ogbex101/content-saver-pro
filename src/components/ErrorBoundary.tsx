import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-[200px] flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-gold font-bold text-lg mb-2">Something went wrong</p>
            <p className="text-muted-foreground text-sm mb-4">This section failed to load.</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-5 py-2 rounded-lg gradient-gold text-primary-foreground text-sm font-bold"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
