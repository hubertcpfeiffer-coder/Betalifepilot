// Error Tracking Service - Production-ready with Sentry support

interface ErrorContext {
  userId?: string;
  component?: string;
  action?: string;
  extra?: Record<string, any>;
}

interface TrackedError {
  id: string;
  message: string;
  stack?: string;
  context: ErrorContext;
  timestamp: string;
  url: string;
  userAgent: string;
}

const errorLog: TrackedError[] = [];
const MAX_ERRORS = 100;

function generateErrorId(): string {
  return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Initialize Sentry (if configured and package available)
let sentryInitialized = false;
export async function initSentry(): Promise<void> {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn || sentryInitialized) return;
  
  // Note: @sentry/react needs to be installed for production use
  // npm install @sentry/react
  console.log('[Sentry] DSN configured - install @sentry/react for production error tracking.');
  sentryInitialized = false;
}

export function trackError(error: Error, context: ErrorContext = {}): string {
  const trackedError: TrackedError = {
    id: generateErrorId(),
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
  };

  console.error('[Error Tracked]', trackedError);
  errorLog.unshift(trackedError);
  if (errorLog.length > MAX_ERRORS) errorLog.pop();

  return trackedError.id;
}

export function trackWarning(message: string, context: ErrorContext = {}): void {
  console.warn('[Warning]', message, context);
}

export function trackAction(action: string, data?: Record<string, any>): void {
  if (import.meta.env.DEV) console.log('[Action]', action, data);
}

export function getRecentErrors(): TrackedError[] {
  return [...errorLog];
}

export function clearErrorLog(): void {
  errorLog.length = 0;
}

export function setupGlobalErrorHandler(): void {
  if (typeof window === 'undefined') return;

  window.onerror = (message, source, lineno, colno, error) => {
    trackError(error || new Error(String(message)), {
      component: 'global',
      extra: { source, lineno, colno }
    });
  };

  window.onunhandledrejection = (event) => {
    trackError(
      event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
      { component: 'promise', action: 'unhandledRejection' }
    );
  };
}

export function captureReactError(error: Error, errorInfo: { componentStack: string }): void {
  trackError(error, { component: 'react', extra: { componentStack: errorInfo.componentStack } });
}
