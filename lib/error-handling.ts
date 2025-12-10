// Comprehensive Error Handling System
// Maps all error types to codes, priorities, and auto-ticket creation

import { logError, logInfo, ErrorCode, LogContext } from './observability';
export { logError, logInfo };
import { supabaseAdmin } from './supabase/server';

// Extended error codes matching the specification
export enum ExtendedErrorCode {
  // Authentication & Authorization
  AUTH_401 = 'AUTH_401',
  AUTH_MAGIC_FAIL = 'AUTH_MAGIC_FAIL',
  AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',
  AUTH_INVALID_SESSION = 'AUTH_INVALID_SESSION',
  AUTH_PERMISSION_DENIED = 'AUTH_PERMISSION_DENIED',
  
  // Payments & Subscriptions
  PAY_WEBHOOK_SIG = 'PAY_WEBHOOK_SIG',
  PAY_SUB_FAIL = 'PAY_SUB_FAIL',
  PAY_INVOICE_UNPAID = 'PAY_INVOICE_UNPAID',
  PAY_PLAN_MAPPING_ERROR = 'PAY_PLAN_MAPPING_ERROR',
  
  // Webhooks & Integrations
  WH_DUP = 'WH_DUP',
  WH_INVALID_PAYLOAD = 'WH_INVALID_PAYLOAD',
  WH_PROCESS_TIMEOUT = 'WH_PROCESS_TIMEOUT',
  WEBHOOK_PROCESS_FAIL = 'WEBHOOK_PROCESS_FAIL',
  
  // Multi-tenant Data Errors
  RLS_DENY = 'RLS_DENY',
  TENANT_ID_MISMATCH = 'TENANT_ID_MISMATCH',
  TENANT_DATA_BLEED = 'TENANT_DATA_BLEED',
  
  // Feature Flag / Plan Mismatch
  FEATURE_MISMATCH = 'FEATURE_MISMATCH',
  FEATURE_FLAG_ERROR = 'FEATURE_FLAG_ERROR',
  PLAN_NOT_UPDATED = 'PLAN_NOT_UPDATED',
  
  // Billing & Accounting
  BILL_GST_ERR = 'BILL_GST_ERR',
  BILL_MISSING_INVOICE = 'BILL_MISSING_INVOICE',
  BILL_ROUNDING_ERR = 'BILL_ROUNDING_ERR',
  
  // Data Integrity & Migration
  DATA_IMPORT_ERR = 'DATA_IMPORT_ERR',
  DATA_DUPLICATE_RECORD = 'DATA_DUPLICATE_RECORD',
  DATA_CORRUPT_BACKUP = 'DATA_CORRUPT_BACKUP',
  
  // Performance / Timeouts
  PERF_502 = 'PERF_502',
  PERF_DB_TIMEOUT = 'PERF_DB_TIMEOUT',
  PERF_SLOW_PAGE = 'PERF_SLOW_PAGE',
  
  // Third-party API Failures
  AI_RATE_EXCEEDED = 'AI_RATE_EXCEEDED',
  SMS_GATEWAY_FAIL = 'SMS_GATEWAY_FAIL',
  EMAIL_DELIVERY_FAIL = 'EMAIL_DELIVERY_FAIL',
  PAYMENT_GATEWAY_DOWN = 'PAYMENT_GATEWAY_DOWN',
  
  // Security Incidents
  SEC_SUS_LOGIN = 'SEC_SUS_LOGIN',
  SEC_CREDENTIAL_LEAK = 'SEC_CREDENTIAL_LEAK',
  SEC_DATA_EXFILTRATION = 'SEC_DATA_EXFILTRATION',
}

// Error classification with priority and SLA
export interface ErrorClassification {
  code: ExtendedErrorCode;
  priority: 'critical' | 'high' | 'medium' | 'low';
  sla: string; // e.g., '1h', '2h', '4h', '24h'
  category: string;
  autoRemedy?: string;
  customerMessage?: string;
}

export const ERROR_CLASSIFICATIONS: Record<ExtendedErrorCode, ErrorClassification> = {
  // Authentication & Authorization
  [ExtendedErrorCode.AUTH_401]: {
    code: ExtendedErrorCode.AUTH_401,
    priority: 'high',
    sla: '2h',
    category: 'Authentication',
    customerMessage: 'Session expired. Please log in again.',
  },
  [ExtendedErrorCode.AUTH_MAGIC_FAIL]: {
    code: ExtendedErrorCode.AUTH_MAGIC_FAIL,
    priority: 'high',
    sla: '2h',
    category: 'Authentication',
    customerMessage: 'Unable to send login link. Please try again or contact support.',
  },
  [ExtendedErrorCode.AUTH_TOKEN_EXPIRED]: {
    code: ExtendedErrorCode.AUTH_TOKEN_EXPIRED,
    priority: 'medium',
    sla: '4h',
    category: 'Authentication',
    customerMessage: 'Your session has expired. Please log in again.',
  },
  [ExtendedErrorCode.AUTH_INVALID_SESSION]: {
    code: ExtendedErrorCode.AUTH_INVALID_SESSION,
    priority: 'medium',
    sla: '4h',
    category: 'Authentication',
    customerMessage: 'Invalid session. Please log in again.',
  },
  [ExtendedErrorCode.AUTH_PERMISSION_DENIED]: {
    code: ExtendedErrorCode.AUTH_PERMISSION_DENIED,
    priority: 'medium',
    sla: '4h',
    category: 'Authorization',
    customerMessage: 'You do not have permission to access this resource.',
  },
  
  // Payments & Subscriptions
  [ExtendedErrorCode.PAY_WEBHOOK_SIG]: {
    code: ExtendedErrorCode.PAY_WEBHOOK_SIG,
    priority: 'critical',
    sla: '1h',
    category: 'Payment',
    customerMessage: 'Payment verification issue. Our team has been notified.',
  },
  [ExtendedErrorCode.PAY_SUB_FAIL]: {
    code: ExtendedErrorCode.PAY_SUB_FAIL,
    priority: 'critical',
    sla: '1h',
    category: 'Payment',
    customerMessage: 'Payment failed. Please update your payment method.',
    autoRemedy: 'Retry payment, set grace window, auto-downgrade after 7 days',
  },
  [ExtendedErrorCode.PAY_INVOICE_UNPAID]: {
    code: ExtendedErrorCode.PAY_INVOICE_UNPAID,
    priority: 'high',
    sla: '2h',
    category: 'Payment',
    customerMessage: 'Invoice payment pending. Please complete payment to continue service.',
  },
  [ExtendedErrorCode.PAY_PLAN_MAPPING_ERROR]: {
    code: ExtendedErrorCode.PAY_PLAN_MAPPING_ERROR,
    priority: 'high',
    sla: '2h',
    category: 'Payment',
    customerMessage: 'Subscription update in progress. Please contact support if this persists.',
  },
  
  // Webhooks & Integrations
  [ExtendedErrorCode.WH_DUP]: {
    code: ExtendedErrorCode.WH_DUP,
    priority: 'low',
    sla: '24h',
    category: 'Webhook',
    autoRemedy: 'Idempotency check - ignore duplicate',
  },
  [ExtendedErrorCode.WH_INVALID_PAYLOAD]: {
    code: ExtendedErrorCode.WH_INVALID_PAYLOAD,
    priority: 'high',
    sla: '2h',
    category: 'Webhook',
  },
  [ExtendedErrorCode.WH_PROCESS_TIMEOUT]: {
    code: ExtendedErrorCode.WH_PROCESS_TIMEOUT,
    priority: 'high',
    sla: '2h',
    category: 'Webhook',
    autoRemedy: 'Retry with exponential backoff',
  },
  [ExtendedErrorCode.WEBHOOK_PROCESS_FAIL]: {
    code: ExtendedErrorCode.WEBHOOK_PROCESS_FAIL,
    priority: 'high',
    sla: '2h',
    category: 'Webhook',
    autoRemedy: 'Manual replay via admin console',
  },
  
  // Multi-tenant Data Errors
  [ExtendedErrorCode.RLS_DENY]: {
    code: ExtendedErrorCode.RLS_DENY,
    priority: 'medium',
    sla: '4h',
    category: 'Security',
    customerMessage: 'Access denied. Please contact support if you believe this is an error.',
  },
  [ExtendedErrorCode.TENANT_ID_MISMATCH]: {
    code: ExtendedErrorCode.TENANT_ID_MISMATCH,
    priority: 'critical',
    sla: '1h',
    category: 'Security',
    autoRemedy: 'Immediate tenant isolation, audit logs',
  },
  [ExtendedErrorCode.TENANT_DATA_BLEED]: {
    code: ExtendedErrorCode.TENANT_DATA_BLEED,
    priority: 'critical',
    sla: '1h',
    category: 'Security',
    autoRemedy: 'Immediate lockdown, revoke keys, incident response',
  },
  
  // Feature Flag / Plan Mismatch
  [ExtendedErrorCode.FEATURE_MISMATCH]: {
    code: ExtendedErrorCode.FEATURE_MISMATCH,
    priority: 'low',
    sla: '24h',
    category: 'Feature',
    customerMessage: 'This feature is not available in your current plan. Upgrade to access.',
  },
  [ExtendedErrorCode.FEATURE_FLAG_ERROR]: {
    code: ExtendedErrorCode.FEATURE_FLAG_ERROR,
    priority: 'low',
    sla: '24h',
    category: 'Feature',
  },
  [ExtendedErrorCode.PLAN_NOT_UPDATED]: {
    code: ExtendedErrorCode.PLAN_NOT_UPDATED,
    priority: 'high',
    sla: '2h',
    category: 'Billing',
    autoRemedy: 'Run plan resync from admin console',
  },
  
  // Billing & Accounting
  [ExtendedErrorCode.BILL_GST_ERR]: {
    code: ExtendedErrorCode.BILL_GST_ERR,
    priority: 'medium',
    sla: '4h',
    category: 'Billing',
    autoRemedy: 'Issue corrected invoice + credit note',
  },
  [ExtendedErrorCode.BILL_MISSING_INVOICE]: {
    code: ExtendedErrorCode.BILL_MISSING_INVOICE,
    priority: 'medium',
    sla: '4h',
    category: 'Billing',
  },
  [ExtendedErrorCode.BILL_ROUNDING_ERR]: {
    code: ExtendedErrorCode.BILL_ROUNDING_ERR,
    priority: 'low',
    sla: '24h',
    category: 'Billing',
  },
  
  // Data Integrity & Migration
  [ExtendedErrorCode.DATA_IMPORT_ERR]: {
    code: ExtendedErrorCode.DATA_IMPORT_ERR,
    priority: 'medium',
    sla: '4h',
    category: 'Data',
    customerMessage: 'Import error detected. Please check the file format and try again.',
    autoRemedy: 'Show row-level import errors with fixes',
  },
  [ExtendedErrorCode.DATA_DUPLICATE_RECORD]: {
    code: ExtendedErrorCode.DATA_DUPLICATE_RECORD,
    priority: 'low',
    sla: '24h',
    category: 'Data',
  },
  [ExtendedErrorCode.DATA_CORRUPT_BACKUP]: {
    code: ExtendedErrorCode.DATA_CORRUPT_BACKUP,
    priority: 'critical',
    sla: '1h',
    category: 'Data',
  },
  
  // Performance / Timeouts
  [ExtendedErrorCode.PERF_502]: {
    code: ExtendedErrorCode.PERF_502,
    priority: 'high',
    sla: '2h',
    category: 'Performance',
    customerMessage: 'Service temporarily unavailable. Please try again in a few minutes.',
  },
  [ExtendedErrorCode.PERF_DB_TIMEOUT]: {
    code: ExtendedErrorCode.PERF_DB_TIMEOUT,
    priority: 'high',
    sla: '2h',
    category: 'Performance',
    autoRemedy: 'Paginate queries, add caching',
  },
  [ExtendedErrorCode.PERF_SLOW_PAGE]: {
    code: ExtendedErrorCode.PERF_SLOW_PAGE,
    priority: 'medium',
    sla: '4h',
    category: 'Performance',
  },
  
  // Third-party API Failures
  [ExtendedErrorCode.AI_RATE_EXCEEDED]: {
    code: ExtendedErrorCode.AI_RATE_EXCEEDED,
    priority: 'medium',
    sla: '4h',
    category: 'Integration',
    customerMessage: 'AI service temporarily rate-limited. Please try again later.',
    autoRemedy: 'Circuit breaker, retry with exponential backoff',
  },
  [ExtendedErrorCode.SMS_GATEWAY_FAIL]: {
    code: ExtendedErrorCode.SMS_GATEWAY_FAIL,
    priority: 'high',
    sla: '2h',
    category: 'Integration',
    customerMessage: 'SMS gateway temporarily delayed. Messages will deliver soon.',
    autoRemedy: 'Fallback to email, retry queue',
  },
  [ExtendedErrorCode.EMAIL_DELIVERY_FAIL]: {
    code: ExtendedErrorCode.EMAIL_DELIVERY_FAIL,
    priority: 'medium',
    sla: '4h',
    category: 'Integration',
    autoRemedy: 'Retry queue, alternative SMTP',
  },
  [ExtendedErrorCode.PAYMENT_GATEWAY_DOWN]: {
    code: ExtendedErrorCode.PAYMENT_GATEWAY_DOWN,
    priority: 'critical',
    sla: '1h',
    category: 'Integration',
    customerMessage: 'Payment processing temporarily unavailable. Please try again later.',
  },
  
  // Security Incidents
  [ExtendedErrorCode.SEC_SUS_LOGIN]: {
    code: ExtendedErrorCode.SEC_SUS_LOGIN,
    priority: 'critical',
    sla: '1h',
    category: 'Security',
    autoRemedy: 'Immediate lockdown, revoke keys, incident response',
  },
  [ExtendedErrorCode.SEC_CREDENTIAL_LEAK]: {
    code: ExtendedErrorCode.SEC_CREDENTIAL_LEAK,
    priority: 'critical',
    sla: '1h',
    category: 'Security',
    autoRemedy: 'Force password reset, revoke all sessions',
  },
  [ExtendedErrorCode.SEC_DATA_EXFILTRATION]: {
    code: ExtendedErrorCode.SEC_DATA_EXFILTRATION,
    priority: 'critical',
    sla: '1h',
    category: 'Security',
    autoRemedy: 'Immediate lockdown, audit all access, incident response',
  },
};

/**
 * Handle error with classification and auto-remediation
 */
export async function handleError(
  error: Error | string,
  errorCode: ExtendedErrorCode,
  context?: LogContext
) {
  const classification = ERROR_CLASSIFICATIONS[errorCode];
  if (!classification) {
    console.warn(`Unknown error code: ${errorCode}`);
    return;
  }

  const errorMessage = typeof error === 'string' ? error : error.message;
  
  // Log error with context
  logError(error, {
    ...context,
    errorCode: errorCode as any,
  });

  // Store error in database for analytics
  await storeError(errorCode, errorMessage, classification, context);

  // Auto-create support ticket
  await createSupportTicket(errorCode, errorMessage, classification, context);

  // Attempt auto-remediation if available
  if (classification.autoRemedy) {
    await attemptAutoRemedy(errorCode, classification.autoRemedy, context);
  }
}

/**
 * Store error in database for analytics
 */
async function storeError(
  code: ExtendedErrorCode,
  message: string,
  classification: ErrorClassification,
  context?: LogContext
) {
  try {
    await supabaseAdmin
      .from('error_logs')
      .insert({
        error_code: code,
        error_message: message,
        priority: classification.priority,
        category: classification.category,
        tenant_id: context?.tenantId,
        user_id: context?.userId,
        metadata: context?.metadata || {},
        created_at: new Date().toISOString(),
      });
  } catch (err) {
    console.error('Failed to store error log:', err);
  }
}

/**
 * Create support ticket via webhook
 */
async function createSupportTicket(
  code: ExtendedErrorCode,
  message: string,
  classification: ErrorClassification,
  context?: LogContext
) {
  const supportDeskWebhook = process.env.SUPPORT_DESK_WEBHOOK_URL;
  
  if (!supportDeskWebhook) {
    // Store ticket in database for manual processing
    try {
      await supabaseAdmin
        .from('support_tickets')
        .insert({
          error_code: code,
          title: `${classification.category}: ${message.substring(0, 100)}`,
          description: message,
          priority: classification.priority,
          sla: classification.sla,
          status: 'open',
          tenant_id: context?.tenantId,
          user_id: context?.userId,
          metadata: context?.metadata || {},
          created_at: new Date().toISOString(),
        });
    } catch (err) {
      console.error('Failed to create support ticket:', err);
    }
    return;
  }

  // Send to external support desk (Intercom/Freshdesk)
  try {
    await fetch(supportDeskWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        errorCode: code,
        message,
        priority: classification.priority,
        sla: classification.sla,
        category: classification.category,
        customerMessage: classification.customerMessage,
        tenantId: context?.tenantId,
        userId: context?.userId,
        metadata: context?.metadata || {},
      }),
    });
  } catch (err) {
    console.error('Failed to send support ticket webhook:', err);
    // Fallback to database storage
    await createSupportTicket(code, message, classification, context);
  }
}

/**
 * Attempt auto-remediation based on error type
 */
async function attemptAutoRemedy(
  code: ExtendedErrorCode,
  remedy: string,
  context?: LogContext
) {
  console.log(`Attempting auto-remedy for ${code}: ${remedy}`);
  
  // Implement specific remediation logic based on error code
  switch (code) {
    case ExtendedErrorCode.PAY_SUB_FAIL:
      // Set grace period
      if (context?.tenantId) {
        await supabaseAdmin
          .from('subscriptions')
          .update({
            grace_period_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          })
          .eq('tenant_id', context.tenantId);
      }
      break;
    
    case ExtendedErrorCode.WH_DUP:
      // Already handled by idempotency check
      break;
    
    case ExtendedErrorCode.PLAN_NOT_UPDATED:
      // Trigger plan resync
      if (context?.tenantId) {
        // This would trigger a plan resync job
        console.log(`Plan resync needed for tenant ${context.tenantId}`);
      }
      break;
    
    default:
      console.log(`No specific auto-remedy implemented for ${code}`);
  }
}

/**
 * Get customer-facing error message
 */
export function getCustomerMessage(errorCode: ExtendedErrorCode): string {
  const classification = ERROR_CLASSIFICATIONS[errorCode];
  return classification?.customerMessage || 'An error occurred. Please try again or contact support.';
}

