'use client'

import { useEffect, useState } from 'react'

// Global error boundary - catches any errors that escape regular error boundaries
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [isRetrying, setIsRetrying] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [countdown, setCountdown] = useState<number | null>(null)

  useEffect(() => {
    // Log critical error for monitoring
    console.error('Global error boundary triggered:', error)
  }, [error])

  // Auto-retry countdown
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      handleRetry()
    }
  }, [countdown])

  const handleRetry = async () => {
    setIsRetrying(true)
    setRetryCount(prev => prev + 1)
    setCountdown(null)

    // Wait briefly before retrying
    await new Promise(resolve => setTimeout(resolve, 500))

    try {
      reset()
    } catch (err) {
      console.error('Global retry failed:', err)
    } finally {
      setIsRetrying(false)
    }
  }

  const handleReload = () => {
    window.location.reload()
  }

  const handleHome = () => {
    window.location.href = '/'
  }

  const startAutoRetry = () => {
    setCountdown(5)
  }

  return (
    <html>
      <body style={{ margin: 0, padding: 0, fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: 'linear-gradient(135deg, #f5f0e8 0%, #e8e3db 100%)'
        }}>
          <div style={{
            textAlign: 'center',
            maxWidth: '600px',
            background: 'white',
            padding: '3rem',
            borderRadius: '24px',
            boxShadow: '0 20px 60px rgba(62, 53, 48, 0.15)'
          }}>
            {/* Error Icon */}
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 2rem',
              borderRadius: '50%',
              background: '#fee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem'
            }}>
              ⚠️
            </div>

            {/* Error Message */}
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '700',
              marginBottom: '1rem',
              color: '#3d3530'
            }}>
              Critical Error
            </h1>
            <p style={{
              fontSize: '1.125rem',
              marginBottom: '0.5rem',
              color: '#5a604d'
            }}>
              The application encountered a critical error.
            </p>
            <p style={{
              fontSize: '0.875rem',
              marginBottom: '2rem',
              color: '#8a8a8a'
            }}>
              {retryCount > 0 && `Retry attempts: ${retryCount} • `}
              {countdown !== null && `Auto-retry in ${countdown}s`}
            </p>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '2rem'
            }}>
              <button
                onClick={handleRetry}
                disabled={isRetrying || countdown !== null}
                style={{
                  padding: '0.875rem 1.5rem',
                  background: isRetrying || countdown !== null ? '#ccc' : '#5a604d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: isRetrying || countdown !== null ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(90, 96, 77, 0.2)'
                }}
              >
                {isRetrying ? '🔄 Retrying...' : '🔄 Try Again'}
              </button>

              <button
                onClick={handleReload}
                style={{
                  padding: '0.875rem 1.5rem',
                  background: '#a8b8a5',
                  color: '#3d3530',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(168, 184, 165, 0.2)'
                }}
              >
                🔃 Reload Page
              </button>

              <button
                onClick={handleHome}
                style={{
                  padding: '0.875rem 1.5rem',
                  background: '#1e2f4d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(30, 47, 77, 0.2)'
                }}
              >
                🏠 Go Home
              </button>
            </div>

            {/* Auto-retry option */}
            {countdown === null && !isRetrying && (
              <button
                onClick={startAutoRetry}
                style={{
                  padding: '0.625rem 1rem',
                  background: 'transparent',
                  color: '#5a604d',
                  border: '1.5px solid #a8b8a5',
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                ⏱️ Auto-retry in 5s
              </button>
            )}

            {/* Error Details (Development) */}
            {process.env.NODE_ENV === 'development' && (
              <details style={{ marginTop: '2rem', textAlign: 'left' }}>
                <summary style={{
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  color: '#8a8a8a',
                  marginBottom: '1rem'
                }}>
                  Error Details (Development Only)
                </summary>
                <pre style={{
                  padding: '1rem',
                  background: '#f5f5f5',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  overflow: 'auto',
                  maxHeight: '300px',
                  border: '1px solid #ddd'
                }}>
                  {error.message}
                  {error.stack && '\n\nStack trace:\n' + error.stack}
                  {error.digest && '\n\nDigest: ' + error.digest}
                </pre>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}