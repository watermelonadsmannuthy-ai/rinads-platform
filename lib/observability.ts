// Observability and Error Handling
// Sentry integration and structured logging

// TODO: Initialize Sentry in production
// import * as Sentry from '@sentry/nextjs';

export enum ErrorCode {
  AUTH_MAGIC_FAIL = 'AUTH_MAGIC_FAIL',
  PAY_SUB_FAIL = 'PAY_SUB_FAIL',
  RLS_DENY = 'RLS_DENY',
  WEBHOOK_PROCESS_FAIL = 'WEBHOOK_PROCESS_FAIL',
  FEATURE_FLAG_ERROR = 'FEATURE_FLAG_ERROR',
}

export interface LogContext {
  tenantId?: string;
  userId?: string;
  errorCode?: ErrorCode;
  metadata?: Record<string, any>;
}

/**
 * Log error with context
 */
export function logError(error: Error | string, context?: LogContext) {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = typeof error === 'string' ? undefined : error.stack;

  const logData = {
    message: errorMessage,
    stack: errorStack,
    ...context,
    timestamp: new Date().toISOString(),
  };

  console.error('ERROR:', logData);

  // TODO: Send to Sentry in production
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(error, {
  //     tags: {
  //       errorCode: context?.errorCode,
  //       tenantId: context?.tenantId,
  //     },
  //     extra: context?.metadata,
  //   });
  // }

  // Auto-create support ticket based on error code
  if (context?.errorCode) {
    createSupportTicket(context.errorCode, errorMessage, context);
  }
}

/**
 * Create support ticket based on error code
 */
async function createSupportTicket(
  errorCode: ErrorCode,
  message: string,
  context?: LogContext
) {
  // TODO: Integrate with Intercom/Freshdesk
  // This is a placeholder for support desk integration

  const ticketMapping: Record<ErrorCode, { priority: string; sla: string }> = {
    [ErrorCode.AUTH_MAGIC_FAIL]: { priority: 'high', sla: '2h' },
    [ErrorCode.PAY_SUB_FAIL]: { priority: 'critical', sla: '1h' },
    [ErrorCode.RLS_DENY]: { priority: 'medium', sla: '4h' },
    [ErrorCode.WEBHOOK_PROCESS_FAIL]: { priority: 'high', sla: '2h' },
    [ErrorCode.FEATURE_FLAG_ERROR]: { priority: 'low', sla: '24h' },
  };

  const mapping = ticketMapping[errorCode] || { priority: 'medium', sla: '4h' };

  console.log('SUPPORT TICKET:', {
    errorCode,
    message,
    priority: mapping.priority,
    sla: mapping.sla,
    tenantId: context?.tenantId,
    userId: context?.userId,
  });

  // TODO: Send webhook to Intercom/Freshdesk
  // await fetch(process.env.SUPPORT_DESK_WEBHOOK_URL, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     errorCode,
  //     message,
  //     priority: mapping.priority,
  //     sla: mapping.sla,
  //     ...context,
  //   }),
  // });
}

/**
 * Structured logging
 */
export function logInfo(message: string, context?: LogContext) {
  console.log('INFO:', {
    message,
    ...context,
    timestamp: new Date().toISOString(),
  });
}

export function logWarning(message: string, context?: LogContext) {
  console.warn('WARNING:', {
    message,
    ...context,
    timestamp: new Date().toISOString(),
  });
}

