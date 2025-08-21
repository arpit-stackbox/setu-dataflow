/**
 * Centralized error handling and logging utilities
 * Production-ready error management system
 */

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ErrorCategory {
  API = 'api',
  DATABASE = 'database',
  AUTHENTICATION = 'authentication',
  VALIDATION = 'validation',
  NETWORK = 'network',
  PERMISSION = 'permission',
  SYSTEM = 'system',
  USER_INPUT = 'user_input',
}

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  routineId?: string;
  timestamp: Date;
  userAgent?: string;
  ip?: string;
  additionalData?: Record<string, unknown>;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly severity: ErrorSeverity;
  public readonly category: ErrorCategory;
  public readonly context?: ErrorContext;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: string,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    category: ErrorCategory = ErrorCategory.SYSTEM,
    context?: ErrorContext,
    isOperational = true
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.severity = severity;
    this.category = category;
    this.context = context;
    this.isOperational = isOperational;

    // Ensure the stack trace points to where the error was thrown
    Error.captureStackTrace(this, AppError);
  }
}

// Pre-defined error types for common scenarios
export class ApiError extends AppError {
  constructor(message: string, code: string, context?: ErrorContext) {
    super(message, code, ErrorSeverity.HIGH, ErrorCategory.API, context);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, field?: string, context?: ErrorContext) {
    super(
      message,
      `VALIDATION_ERROR_${field?.toUpperCase() || 'GENERAL'}`,
      ErrorSeverity.LOW,
      ErrorCategory.VALIDATION,
      context
    );
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required', context?: ErrorContext) {
    super(
      message,
      'AUTHENTICATION_REQUIRED',
      ErrorSeverity.HIGH,
      ErrorCategory.AUTHENTICATION,
      context
    );
  }
}

export class PermissionError extends AppError {
  constructor(message: string = 'Insufficient permissions', context?: ErrorContext) {
    super(
      message,
      'INSUFFICIENT_PERMISSIONS',
      ErrorSeverity.MEDIUM,
      ErrorCategory.PERMISSION,
      context
    );
  }
}

// Logger interface for different environments
export interface Logger {
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, error?: Error, meta?: Record<string, unknown>): void;
  debug(message: string, meta?: Record<string, unknown>): void;
}

// Simple console logger for development
class ConsoleLogger implements Logger {
  info(message: string, meta?: Record<string, unknown>): void {
    console.log('[INFO]', message, meta || '');
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    console.warn('[WARN]', message, meta || '');
  }

  error(message: string, error?: Error, meta?: Record<string, unknown>): void {
    console.error('[ERROR]', message, error || '', meta || '');
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    console.debug('[DEBUG]', message, meta || '');
  }
}

// Production logger (can be replaced with Winston, Pino, etc.)
class ProductionLogger implements Logger {
  info(message: string, meta?: Record<string, unknown>): void {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    this.log('warn', message, meta);
  }

  error(message: string, error?: Error, meta?: Record<string, unknown>): void {
    this.log('error', message, { ...meta, error: error?.stack });
  }

  debug(message: string, meta?: Record<string, unknown>): void {
    this.log('debug', message, meta);
  }

  private log(level: string, message: string, meta?: Record<string, unknown>): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta,
    };
    console.log(JSON.stringify(logEntry));
  }
}

// Export logger instance based on environment
export const logger: Logger = process.env.NODE_ENV === 'production' 
  ? new ProductionLogger() 
  : new ConsoleLogger();

// Global error handler for unhandled errors
export function handleUncaughtError(error: Error): void {
  logger.error('Uncaught error', error, {
    type: 'uncaught_exception',
    severity: ErrorSeverity.CRITICAL,
  });

  // In production, you might want to send this to a monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Send to monitoring service (e.g., Sentry, DataDog)
  }
}

// Error boundary handler for React errors
export function handleReactError(error: Error, errorInfo: { componentStack?: string }): void {
  logger.error('React error boundary caught an error', error, {
    componentStack: errorInfo.componentStack,
    type: 'react_error',
    severity: ErrorSeverity.HIGH,
  });
}
