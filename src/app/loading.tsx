'use client'

import { useEffect, useState } from 'react'
import { Loader2, RefreshCw } from 'lucide-react'

export default function Loading() {
  const [showRetry, setShowRetry] = useState(false)
  const [loadingTime, setLoadingTime] = useState(0)

  useEffect(() => {
    // Show retry option if loading takes too long (15 seconds)
    const timer = setTimeout(() => {
      setShowRetry(true)
    }, 15000)

    // Track loading time
    const interval = setInterval(() => {
      setLoadingTime(prev => prev + 1)
    }, 1000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  const handleReload = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/10 to-background">
      <div className="text-center max-w-md mx-auto p-8">
        {/* Loading Spinner */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-primary animate-spin" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-primary/20 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Loading Message */}
        <h2 className="text-2xl font-bold mb-3 text-foreground">
          Loading...
        </h2>
        <p className="text-muted-foreground mb-2">
          Please wait while we prepare your content
        </p>

        {loadingTime > 5 && (
          <p className="text-sm text-muted-foreground/70">
            Loading time: {loadingTime}s
          </p>
        )}

        {/* Retry Button (appears after 15 seconds) */}
        {showRetry && (
          <div className="mt-8 animate-fade-in-up">
            <p className="text-sm text-muted-foreground mb-4">
              Taking longer than expected?
            </p>
            <button
              onClick={handleReload}
              className="group px-6 py-3 bg-secondary text-secondary-foreground rounded-2xl font-semibold
                       hover:bg-secondary/90 transition-all duration-300 hover:-translate-y-1
                       hover:shadow-lg flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              Reload Page
            </button>
          </div>
        )}

        {/* Loading Progress Indicator */}
        <div className="mt-8">
          <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary animate-loading-progress"
              style={{
                animation: 'loading-progress 2s ease-in-out infinite'
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading-progress {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 50%;
            margin-left: 25%;
          }
          100% {
            width: 0%;
            margin-left: 100%;
          }
        }
      `}</style>
    </div>
  )
}