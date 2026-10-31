import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Resilient React Error Boundary component that prevents blank screen crashes
 * and provides graceful recovery options.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error cleanly for debugging
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.assign('/overview')
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
          <div className="w-full max-w-md rounded-2xl border border-destructive/20 bg-card p-6 shadow-xl text-center sm:p-8">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <AlertTriangle className="size-7" />
            </div>

            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Something went wrong
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              An unexpected rendering issue occurred in the dashboard interface. You can reload the view or return to the overview page.
            </p>

            {this.state.error?.message && (
              <div className="mt-4 rounded-lg bg-muted/50 p-3 text-left font-mono text-xs text-muted-foreground break-all">
                {this.state.error.message}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
              >
                <RotateCcw className="size-3.5" />
                Reload Page
              </button>

              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
              >
                <Home className="size-3.5" />
                Return to Overview
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
