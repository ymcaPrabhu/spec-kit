/**
 * Safe logging utility that prevents password logging
 * Maps to: No plaintext passwords in database or logs
 */

export function sanitizeLogData(data: any): any {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const sanitized = { ...data };
  const sensitiveFields = ['password', 'password_hash', 'token', 'secret'];

  for (const field of sensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]';
    }
  }

  return sanitized;
}

export function logInfo(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const sanitizedData = data ? sanitizeLogData(data) : undefined;
  console.log(`[${timestamp}] INFO: ${message}`, sanitizedData || '');
}

export function logError(message: string, error?: any) {
  const timestamp = new Date().toISOString();
  const sanitizedError = error ? sanitizeLogData(error) : undefined;
  console.error(`[${timestamp}] ERROR: ${message}`, sanitizedError || '');
}
