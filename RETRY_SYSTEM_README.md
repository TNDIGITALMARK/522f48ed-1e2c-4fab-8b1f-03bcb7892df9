# Retry & Reload System

Comprehensive retry and reload functionality for error recovery and improved user experience.

## Overview

The retry system provides multiple layers of error recovery:

1. **Error Boundaries** - Catch React errors with retry capability
2. **Loading States** - Smart loading with timeout detection
3. **Retry Components** - Reusable retry UI components
4. **Retry Utilities** - Flexible retry logic for async operations

---

## Components

### 1. Error Boundary (`src/app/error.tsx`)

**Purpose**: Catches page-level errors with retry functionality

**Features**:
- Manual retry with reset functionality
- Retry attempt tracking
- Reload page option
- Navigate to home option
- Visual loading states during retry
- Development mode error details

**Usage**: Automatically applied to route segments by Next.js

**User Experience**:
- Clean, professional error UI
- Multiple recovery options
- Animated transitions
- Clear retry count display

---

### 2. Global Error Boundary (`src/app/global-error.tsx`)

**Purpose**: Catches critical application-wide errors

**Features**:
- Auto-retry countdown (5 seconds)
- Manual retry option
- Page reload capability
- Inline styles (no CSS dependencies)
- Retry attempt tracking
- Development error details

**Usage**: Automatically wraps entire application

**User Experience**:
- Full-page error display
- Auto-retry option with countdown
- Multiple recovery paths
- Self-contained styling

---

### 3. Enhanced Loading State (`src/app/loading.tsx`)

**Purpose**: Improved loading experience with timeout detection

**Features**:
- Animated loading spinner
- Loading time tracking
- Auto-show retry after 15 seconds
- Animated progress indicator
- Reload option for stuck loads

**Usage**: Automatically used by Next.js for route suspense

**User Experience**:
- Visual loading progress
- Timeout detection
- One-click reload for slow loads

---

### 4. RetryBoundary Component (`src/components/retry-boundary.tsx`)

**Purpose**: Reusable error boundary for component-level errors

**Features**:
- Configurable max retries
- Custom retry delays
- Custom fallback UI
- Error logging callback
- Automatic retry with backoff
- Class component implementation

**Usage**:
```tsx
import { RetryBoundary } from '@/components/retry-boundary'

<RetryBoundary maxRetries={3} retryDelay={1000}>
  <YourComponent />
</RetryBoundary>
```

**With custom fallback**:
```tsx
<RetryBoundary
  fallback={(error, retry) => (
    <div>
      <p>Error: {error.message}</p>
      <button onClick={retry}>Retry</button>
    </div>
  )}
>
  <YourComponent />
</RetryBoundary>
```

---

### 5. useRetry Hook (`src/components/retry-boundary.tsx`)

**Purpose**: Functional component retry logic

**Features**:
- Retry state management
- Configurable max attempts
- Async operation retry
- Reset functionality

**Usage**:
```tsx
import { useRetry } from '@/components/retry-boundary'

function MyComponent() {
  const { retry, retryCount, isRetrying, canRetry, reset } = useRetry(3)

  const handleOperation = async () => {
    const success = await retry(async () => {
      await fetchData()
    }, 1000) // 1 second delay

    if (!success) {
      console.log('Max retries reached')
    }
  }

  return (
    <div>
      <button onClick={handleOperation} disabled={!canRetry || isRetrying}>
        {isRetrying ? 'Retrying...' : 'Fetch Data'}
      </button>
      <p>Attempts: {retryCount}</p>
    </div>
  )
}
```

---

## Retry Utilities (`src/lib/retry-utils.ts`)

### Basic Retry

```typescript
import { retry } from '@/lib/retry-utils'

// Simple retry
const data = await retry(
  () => fetch('/api/data').then(r => r.json()),
  { maxAttempts: 3, delay: 1000 }
)

// With exponential backoff
const data = await retry(
  () => fetch('/api/data').then(r => r.json()),
  { maxAttempts: 5, delay: 1000, backoff: 'exponential' }
)

// With retry callback
const data = await retry(
  () => fetch('/api/data').then(r => r.json()),
  {
    maxAttempts: 3,
    onRetry: (attempt, error) => {
      console.log(`Retry attempt ${attempt}:`, error.message)
    }
  }
)
```

---

### Retry with Timeout

```typescript
import { retryWithTimeout } from '@/lib/retry-utils'

// Fails if operation takes longer than 5 seconds
const data = await retryWithTimeout(
  () => fetch('/api/slow-endpoint'),
  { timeout: 5000, maxAttempts: 3 }
)
```

---

### Conditional Retry

```typescript
import { conditionalRetry, isRetryableError } from '@/lib/retry-utils'

// Only retry on network errors
const data = await conditionalRetry(
  () => fetch('/api/data'),
  {
    shouldRetry: (error) => isRetryableError(error)
  }
)

// Retry with result validation
const data = await conditionalRetry(
  () => fetch('/api/data').then(r => r.json()),
  {
    validateResult: (data) => data.status === 'success',
    maxAttempts: 3
  }
)
```

---

### Circuit Breaker

```typescript
import { CircuitBreaker } from '@/lib/retry-utils'

// Create circuit breaker (5 failures opens circuit for 30s)
const breaker = new CircuitBreaker(5, 60000, 30000)

try {
  const data = await breaker.execute(
    () => fetch('/api/unreliable'),
    { maxAttempts: 3 }
  )
} catch (error) {
  if (error.message.includes('Circuit breaker is open')) {
    console.log('Too many failures - waiting for cooldown')
  }
}

// Check circuit state
console.log(breaker.getState())
// { state: 'closed', failures: 0, lastFailureTime: 0 }
```

---

### Retry Manager

```typescript
import { RetryManager } from '@/lib/retry-utils'

const manager = new RetryManager()

async function fetchWithManagement(key: string) {
  if (!manager.canRetry(key, 3, 1000)) {
    console.log('Cannot retry - cooldown or max attempts reached')
    return null
  }

  manager.recordAttempt(key)

  try {
    return await fetch('/api/data')
  } catch (error) {
    console.log(`Attempts: ${manager.getAttempts(key)}`)
    throw error
  }
}

// Reset specific operation
manager.reset('operation-key')

// Reset all operations
manager.resetAll()
```

---

### Batch Retry

```typescript
import { batchRetry } from '@/lib/retry-utils'

// Retry multiple operations with same config
const results = await batchRetry([
  () => fetch('/api/data1').then(r => r.json()),
  () => fetch('/api/data2').then(r => r.json()),
  () => fetch('/api/data3').then(r => r.json()),
], { maxAttempts: 3, delay: 1000 })

console.log('All results:', results)
```

---

### Create Retry Wrapper

```typescript
import { createRetryWrapper } from '@/lib/retry-utils'

// Create a wrapped fetch with automatic retry
const fetchWithRetry = createRetryWrapper(
  fetch,
  { maxAttempts: 3, delay: 1000, backoff: 'exponential' }
)

// Use like normal fetch, but with automatic retry
const response = await fetchWithRetry('/api/data')
const data = await response.json()
```

---

### Reload with Retry Tracking

```typescript
import { reloadWithRetry } from '@/lib/retry-utils'

// Reload page with max 3 attempts (tracks in sessionStorage)
const reloaded = reloadWithRetry(3)

if (!reloaded) {
  console.log('Max reload attempts reached')
}
```

---

## Best Practices

### 1. Choose the Right Retry Strategy

- **Immediate errors**: Use short delays (500ms-1s)
- **Network errors**: Use exponential backoff
- **API rate limits**: Use jitter to prevent thundering herd
- **Critical operations**: Use circuit breaker pattern

### 2. Set Appropriate Limits

- **User-facing**: 2-3 retries (avoid frustration)
- **Background tasks**: 5-10 retries (maximize success)
- **API calls**: 3-5 retries (balance reliability and load)

### 3. Provide User Feedback

- Show retry attempts
- Display loading states
- Offer manual retry option
- Explain what's happening

### 4. Log for Monitoring

```typescript
const data = await retry(
  () => fetch('/api/data'),
  {
    onRetry: (attempt, error) => {
      // Log to monitoring service
      logError('API retry', { attempt, error: error.message })
    }
  }
)
```

### 5. Handle Max Retries Gracefully

```typescript
try {
  const data = await retry(() => fetch('/api/data'), { maxAttempts: 3 })
} catch (error) {
  // All retries failed
  showUserFriendlyError('Unable to load data. Please try again later.')
}
```

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│          Global Error Boundary                  │
│  (Catches app-wide critical errors)             │
│  - Auto-retry countdown                         │
│  - Manual retry option                          │
└─────────────────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────────┐
│          Page Error Boundary                    │
│  (Catches route-level errors)                   │
│  - Manual retry with reset                      │
│  - Reload page option                           │
└─────────────────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────────┐
│          Loading State                          │
│  (Smart loading with timeout)                   │
│  - Progress tracking                            │
│  - Auto-show retry after 15s                    │
└─────────────────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────────┐
│          Component RetryBoundary                │
│  (Granular error recovery)                      │
│  - Configurable retries                         │
│  - Custom fallback UI                           │
└─────────────────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────────┐
│          Retry Utilities                        │
│  (Function-level retry logic)                   │
│  - Async operation retry                        │
│  - Circuit breaker pattern                      │
│  - Batch operations                             │
└─────────────────────────────────────────────────┘
```

---

## Summary

The retry system provides comprehensive error recovery at every level:

- **Application Level**: Global error boundary with auto-retry
- **Page Level**: Error boundaries with manual retry
- **Component Level**: RetryBoundary for granular control
- **Function Level**: Retry utilities for async operations

All components follow consistent design patterns and provide excellent user experience with clear feedback and multiple recovery options.
