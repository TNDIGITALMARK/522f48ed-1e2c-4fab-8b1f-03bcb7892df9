'use client'

import { useEffect, useState } from 'react'
import { RefreshCw, Home, AlertCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [isRetrying, setIsRetrying] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    // Log error for monitoring
    console.error('Page error:', error)
  }, [error])

  const handleRetry = async () => {
    setIsRetrying(true)
    setRetryCount(prev => prev + 1)

    // Wait briefly before retrying to avoid immediate re-error
    await new Promise(resolve => setTimeout(resolve, 300))

    try {
      reset()
    } catch (err) {
      console.error('Retry failed:', err)
    } finally {
      setIsRetrying(false)
    }
  }

  const handleReload = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="text-center max-w-2xl mx-auto">
        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-destructive" />
            </div>
            <div className="absolute inset-0 rounded-full bg-destructive/20 animate-ping" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold mb-4 text-foreground">
          Something went wrong
        </h1>
        <p className="text-lg mb-2 text-muted-foreground">
          The page encountered an error and couldn't load properly.
        </p>
        {retryCount > 0 && (
          <p className="text-sm mb-6 text-muted-foreground">
            Retry attempts: {retryCount}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center flex-wrap mt-8">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="group px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-semibold
                     hover:bg-primary/90 transition-all duration-300 hover:-translate-y-1
                     hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                     disabled:hover:transform-none flex items-center gap-2"
          >
            <RefreshCw
              className={`w-5 h-5 transition-transform duration-500 ${isRetrying ? 'animate-spin' : 'group-hover:rotate-180'}`}
            />
            {isRetrying ? 'Retrying...' : 'Try Again'}
          </button>

          <button
            onClick={handleReload}
            className="px-6 py-3 bg-secondary text-secondary-foreground rounded-2xl font-semibold
                     hover:bg-secondary/90 transition-all duration-300 hover:-translate-y-1
                     hover:shadow-lg flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Reload Page
          </button>

          <a
            href="/"
            className="px-6 py-3 bg-accent text-accent-foreground rounded-2xl font-semibold
                     hover:bg-accent/90 transition-all duration-300 hover:-translate-y-1
                     hover:shadow-lg flex items-center gap-2"
          >
            <Home className="w-5 h-5" />
            Go Home
          </a>
        </div>

        {/* Error Details (Development) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-12 text-left">
            <summary className="cursor-pointer font-bold text-sm text-muted-foreground hover:text-foreground transition-colors">
              Error Details (Development Only)
            </summary>
            <pre className="mt-4 p-6 bg-muted/50 rounded-xl text-xs overflow-auto max-h-64 border border-border">
              <code>
                {error.message}
                {error.stack && '\n\nStack trace:\n' + error.stack}
                {error.digest && '\n\nDigest: ' + error.digest}
              </code>
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}