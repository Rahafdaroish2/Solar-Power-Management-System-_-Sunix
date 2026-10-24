export class AppError extends Error {
  constructor(message, { code = 'UNKNOWN', status, details, cause } = {}) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.details = details;
    this.cause = cause;
  }
}
export function normalizeError(error) {
  if (error instanceof AppError) return error;
  if (error?.name === 'AbortError')
    return new AppError('Request cancelled.', { code: 'CANCELLED' });
  return new AppError('Something went wrong. Please try again.', {
    cause: error,
  });
}
