'use client'

import { Component, ReactNode } from 'react'
import { RefreshCw, Home, AlertTriangle } from 'lucide-react'

interface RetryBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, retry: () => void) => ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  maxRetries?: number
  retryDelay?: number
}

interface RetryBoundaryState {
  hasError: boolean
  error: Error | null
  retryCount: number
  isRetrying: boolean
}

/**
 * RetryBoundary - A reusable error boundary with automatic retry capability
 *
 * Features:
 * - Catches React errors in child components
 * - Provides retry functionality with configurable attempts
 * - Customizable fallback UI
 * - Automatic retry with delay
 * - Error logging callback
 *
 * @example
 * <RetryBoundary maxRetries={3} retryDelay={1000}>
 *   <YourComponent />
 * </RetryBoundary>
 */
export class RetryBoundary extends Component<RetryBoundaryProps, RetryBoundaryState> {
  constructor(props: RetryBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      retryCount: 0,
      isRetrying: false,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<RetryBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service
    console.error('RetryBoundary caught error:', error, errorInfo)

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)
  }

  handleRetry = async () => {
    const { maxRetries = 3, retryDelay = 500 } = this.props
    const { retryCount } = this.state

    if (retryCount >= maxRetries) {
      console.warn(`Max retries (${maxRetries}) reached`)
      return
    }

    this.setState({ isRetrying: true })

    // Wait before retrying to avoid immediate re-error
    await new Promise(resolve => setTimeout(resolve, retryDelay))

    this.setState({
      hasError: false,
      error: null,
      retryCount: retryCount + 1,
      isRetrying: false,
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleHome = () => {
    window.location.href = '/'
  }

  render() {
    const { hasError, error, retryCount, isRetrying } = this.state
    const { children, fallback, maxRetries = 3 } = this.props

    if (hasError && error) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback(error, this.handleRetry)
      }

      // Default fallback UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="text-center max-w-lg mx-auto">
            {/* Error Icon */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-destructive" />
                </div>
                <div className="absolute inset-0 rounded-full bg-destructive/20 animate-pulse" />
              </div>
            </div>

            {/* Error Message */}
            <h3 className="text-2xl font-bold mb-3 text-foreground">
              Something went wrong
            </h3>
            <p className="text-muted-foreground mb-4">
              This component encountered an error and couldn't render properly.
            </p>

            {/* Retry Info */}
            {retryCount > 0 && (
              <p className="text-sm text-muted-foreground mb-6">
                Retry attempts: {retryCount} / {maxRetries}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={this.handleRetry}
                disabled={isRetrying || retryCount >= maxRetries}
                className="group px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold
                         hover:bg-primary/90 transition-all duration-300 hover:-translate-y-0.5
                         hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                         disabled:hover:transform-none flex items-center gap-2 text-sm"
              >
                <RefreshCw
                  className={`w-4 h-4 transition-transform duration-500 ${
                    isRetrying ? 'animate-spin' : 'group-hover:rotate-180'
                  }`}
                />
                {isRetrying
                  ? 'Retrying...'
                  : retryCount >= maxRetries
                  ? 'Max Retries Reached'
                  : 'Try Again'}
              </button>

              <button
                onClick={this.handleReload}
                className="px-5 py-2.5 bg-secondary text-secondary-foreground rounded-xl font-semibold
                         hover:bg-secondary/90 transition-all duration-300 hover:-translate-y-0.5
                         hover:shadow-lg flex items-center gap-2 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Reload
              </button>

              <button
                onClick={this.handleHome}
                className="px-5 py-2.5 bg-accent text-accent-foreground rounded-xl font-semibold
                         hover:bg-accent/90 transition-all duration-300 hover:-translate-y-0.5
                         hover:shadow-lg flex items-center gap-2 text-sm"
              >
                <Home className="w-4 h-4" />
                Home
              </button>
            </div>

            {/* Error Details (Development) */}
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer font-semibold text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Error Details (Development)
                </summary>
                <pre className="mt-3 p-4 bg-muted/50 rounded-lg text-xs overflow-auto max-h-48 border border-border">
                  <code>{error.message}</code>
                  {error.stack && (
                    <code className="block mt-2 text-muted-foreground">
                      {error.stack}
                    </code>
                  )}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return children
  }
}

/**
 * useRetry Hook - For functional components that need retry logic
 */
export function useRetry(maxRetries = 3) {
  const [retryCount, setRetryCount] = React.useState(0)
  const [isRetrying, setIsRetrying] = React.useState(false)

  const retry = React.useCallback(async (fn: () => Promise<void>, delay = 500) => {
    if (retryCount >= maxRetries) {
      console.warn(`Max retries (${maxRetries}) reached`)
      return false
    }

    setIsRetrying(true)
    setRetryCount(prev => prev + 1)

    await new Promise(resolve => setTimeout(resolve, delay))

    try {
      await fn()
      setIsRetrying(false)
      return true
    } catch (error) {
      setIsRetrying(false)
      console.error('Retry failed:', error)
      return false
    }
  }, [retryCount, maxRetries])

  const reset = React.useCallback(() => {
    setRetryCount(0)
    setIsRetrying(false)
  }, [])

  return {
    retry,
    reset,
    retryCount,
    isRetrying,
    canRetry: retryCount < maxRetries,
  }
}

// Fix missing React import
import React from 'react'
