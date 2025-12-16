/**
 * Retry Utilities
 *
 * Utility functions for implementing retry logic in async operations,
 * data fetching, and error recovery scenarios.
 */

export interface RetryOptions {
  maxAttempts?: number
  delay?: number
  backoff?: 'linear' | 'exponential'
  onRetry?: (attempt: number, error: Error) => void
  shouldRetry?: (error: Error) => boolean
}

/**
 * Retry an async function with configurable options
 *
 * @example
 * const data = await retry(
 *   () => fetch('/api/data').then(r => r.json()),
 *   { maxAttempts: 3, delay: 1000, backoff: 'exponential' }
 * )
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = 'exponential',
    onRetry,
    shouldRetry = () => true,
  } = options

  let lastError: Error

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      // Check if we should retry
      if (attempt === maxAttempts || !shouldRetry(lastError)) {
        throw lastError
      }

      // Calculate delay based on backoff strategy
      const retryDelay = backoff === 'exponential'
        ? delay * Math.pow(2, attempt - 1)
        : delay * attempt

      // Call retry callback
      onRetry?.(attempt, lastError)

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay))
    }
  }

  throw lastError!
}

/**
 * Retry with timeout - fails if operation takes too long
 *
 * @example
 * const data = await retryWithTimeout(
 *   () => fetch('/api/slow-endpoint'),
 *   { timeout: 5000, maxAttempts: 3 }
 * )
 */
export async function retryWithTimeout<T>(
  fn: () => Promise<T>,
  options: RetryOptions & { timeout?: number } = {}
): Promise<T> {
  const { timeout = 10000, ...retryOptions } = options

  return retry(
    () => Promise.race([
      fn(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Operation timed out')), timeout)
      ),
    ]),
    retryOptions
  )
}

/**
 * Create a retry wrapper for a function
 *
 * @example
 * const fetchWithRetry = createRetryWrapper(
 *   fetch,
 *   { maxAttempts: 3, delay: 1000 }
 * )
 * const response = await fetchWithRetry('/api/data')
 */
export function createRetryWrapper<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: RetryOptions = {}
): T {
  return ((...args: Parameters<T>) =>
    retry(() => fn(...args), options)) as T
}

/**
 * Retry only for specific error types
 *
 * @example
 * const data = await retryOnError(
 *   () => fetch('/api/data'),
 *   { errorTypes: [NetworkError, TimeoutError] }
 * )
 */
export async function retryOnError<T>(
  fn: () => Promise<T>,
  options: RetryOptions & { errorTypes?: Array<new (...args: any[]) => Error> }
): Promise<T> {
  const { errorTypes = [], ...retryOptions } = options

  return retry(fn, {
    ...retryOptions,
    shouldRetry: (error) => {
      if (errorTypes.length === 0) return true
      return errorTypes.some(ErrorType => error instanceof ErrorType)
    },
  })
}

/**
 * Retry with circuit breaker pattern
 * Stops retrying if too many failures occur in a time window
 */
export class CircuitBreaker {
  private failures = 0
  private lastFailureTime = 0
  private state: 'closed' | 'open' | 'half-open' = 'closed'

  constructor(
    private threshold: number = 5,
    private timeout: number = 60000,
    private resetTimeout: number = 30000
  ) {}

  async execute<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
    // Check circuit state
    if (this.state === 'open') {
      const timeSinceLastFailure = Date.now() - this.lastFailureTime
      if (timeSinceLastFailure < this.resetTimeout) {
        throw new Error('Circuit breaker is open - too many recent failures')
      }
      this.state = 'half-open'
    }

    try {
      const result = await retry(fn, options)

      // Success - reset circuit
      if (this.state === 'half-open') {
        this.state = 'closed'
        this.failures = 0
      }

      return result
    } catch (error) {
      this.failures++
      this.lastFailureTime = Date.now()

      // Check if we should open circuit
      if (this.failures >= this.threshold) {
        this.state = 'open'
      }

      throw error
    }
  }

  reset() {
    this.failures = 0
    this.state = 'closed'
    this.lastFailureTime = 0
  }

  getState() {
    return {
      state: this.state,
      failures: this.failures,
      lastFailureTime: this.lastFailureTime,
    }
  }
}

/**
 * Retry with exponential backoff and jitter
 * Prevents thundering herd problem
 */
export async function retryWithJitter<T>(
  fn: () => Promise<T>,
  options: RetryOptions & { maxJitter?: number } = {}
): Promise<T> {
  const { maxJitter = 1000, ...retryOptions } = options

  return retry(fn, {
    ...retryOptions,
    onRetry: (attempt, error) => {
      retryOptions.onRetry?.(attempt, error)

      // Add random jitter to prevent synchronized retries
      const jitter = Math.random() * maxJitter
      return new Promise(resolve => setTimeout(resolve, jitter))
    },
  })
}

/**
 * Batch retry - retry multiple operations with same config
 *
 * @example
 * const results = await batchRetry([
 *   () => fetch('/api/data1'),
 *   () => fetch('/api/data2'),
 *   () => fetch('/api/data3'),
 * ], { maxAttempts: 3 })
 */
export async function batchRetry<T>(
  operations: Array<() => Promise<T>>,
  options: RetryOptions = {}
): Promise<T[]> {
  return Promise.all(
    operations.map(op => retry(op, options))
  )
}

/**
 * Conditional retry - retry based on response/error analysis
 *
 * @example
 * const data = await conditionalRetry(
 *   () => fetch('/api/data'),
 *   {
 *     shouldRetry: (error) => {
 *       // Only retry on network errors or 5xx status codes
 *       return error.message.includes('network') ||
 *              (error instanceof HTTPError && error.status >= 500)
 *     }
 *   }
 * )
 */
export async function conditionalRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions & {
    validateResult?: (result: T) => boolean
  } = {}
): Promise<T> {
  const { validateResult, ...retryOptions } = options

  return retry(async () => {
    const result = await fn()

    // Validate result if validator provided
    if (validateResult && !validateResult(result)) {
      throw new Error('Result validation failed')
    }

    return result
  }, retryOptions)
}

/**
 * Simple reload with retry tracking
 */
export function reloadWithRetry(maxAttempts = 3) {
  const attempts = parseInt(sessionStorage.getItem('reload-attempts') || '0')

  if (attempts >= maxAttempts) {
    console.warn('Max reload attempts reached')
    sessionStorage.removeItem('reload-attempts')
    return false
  }

  sessionStorage.setItem('reload-attempts', String(attempts + 1))

  // Clear after successful load
  window.addEventListener('load', () => {
    sessionStorage.removeItem('reload-attempts')
  }, { once: true })

  window.location.reload()
  return true
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: Error): boolean {
  const retryableMessages = [
    'network',
    'timeout',
    'fetch',
    'connection',
    'ECONNREFUSED',
    'ETIMEDOUT',
    'ENOTFOUND',
  ]

  const errorMessage = error.message.toLowerCase()
  return retryableMessages.some(msg => errorMessage.includes(msg))
}

/**
 * Create a retry manager for tracking retry state
 */
export class RetryManager {
  private attempts = new Map<string, number>()
  private lastAttempt = new Map<string, number>()

  canRetry(key: string, maxAttempts = 3, cooldown = 1000): boolean {
    const attempts = this.attempts.get(key) || 0
    const lastTime = this.lastAttempt.get(key) || 0
    const now = Date.now()

    // Check if cooldown period has passed
    if (now - lastTime < cooldown) {
      return false
    }

    return attempts < maxAttempts
  }

  recordAttempt(key: string) {
    const current = this.attempts.get(key) || 0
    this.attempts.set(key, current + 1)
    this.lastAttempt.set(key, Date.now())
  }

  reset(key: string) {
    this.attempts.delete(key)
    this.lastAttempt.delete(key)
  }

  resetAll() {
    this.attempts.clear()
    this.lastAttempt.clear()
  }

  getAttempts(key: string): number {
    return this.attempts.get(key) || 0
  }
}
