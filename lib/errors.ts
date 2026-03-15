export enum ErrorCode {
  UNAUTHORIZED = 'ERR_UNAUTHORIZED',
  FORBIDDEN = 'ERR_FORBIDDEN',
  INVALID_INPUT = 'ERR_INVALID_INPUT',
  NOT_FOUND = 'ERR_NOT_FOUND',
  CONFLICT = 'ERR_CONFLICT',
  RATE_LIMIT = 'ERR_RATE_LIMIT',
  INTERNAL = 'ERR_INTERNAL',
  INVALID_INVITE = 'ERR_INVALID_INVITE',
  INVALID_FREQUENCY = 'ERR_INVALID_FREQUENCY',
  SCHOOL_NOT_FOUND = 'ERR_SCHOOL_NOT_FOUND',
  SCHOOL_MISMATCH = 'ERR_SCHOOL_MISMATCH',
  ALREADY_IN_SCHOOL = 'ERR_ALREADY_IN_SCHOOL',
  NO_TEMPLATE = 'ERR_NO_TEMPLATE',
  EMAIL_FAILED = 'ERR_EMAIL_FAILED',
  INVALID_EMAIL = 'ERR_INVALID_EMAIL',
}

export class ApiError extends Error {
  constructor(
    public code: ErrorCode | string,
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'ApiError';
  }

  toJSON() {
    return { error: { code: this.code, message: this.message } };
  }
}

export const errors = {
  unauthorized: () =>
    new ApiError(ErrorCode.UNAUTHORIZED, 'Authentication required', 401),

  forbidden: (detail?: string) =>
    new ApiError(ErrorCode.FORBIDDEN, detail ?? 'Insufficient permissions', 403),

  notFound: (resource: string) =>
    new ApiError(ErrorCode.NOT_FOUND, `${resource} not found`, 404),

  conflict: (detail: string) =>
    new ApiError(ErrorCode.CONFLICT, detail, 409),

  rateLimit: () =>
    new ApiError(ErrorCode.RATE_LIMIT, 'Too many requests. Try again later', 429),

  invalidInput: (field?: string) =>
    new ApiError(
      ErrorCode.INVALID_INPUT,
      field ? `Invalid input: ${field}` : 'Invalid request body',
      400
    ),

  invalidInvite: () =>
    new ApiError(ErrorCode.INVALID_INVITE, 'Invalid or expired invite code', 400),

  invalidFrequency: (valid: string[]) =>
    new ApiError(
      ErrorCode.INVALID_FREQUENCY,
      `Invalid frequency. Must be one of: ${valid.join(', ')}`,
      400
    ),

  schoolNotFound: () =>
    new ApiError(ErrorCode.SCHOOL_NOT_FOUND, 'School not found', 404),

  schoolMismatch: () =>
    new ApiError(ErrorCode.SCHOOL_MISMATCH, 'You do not belong to this school', 403),

  alreadyInSchool: () =>
    new ApiError(ErrorCode.ALREADY_IN_SCHOOL, 'You are already a member of a school', 409),

  noTemplate: () =>
    new ApiError(ErrorCode.NO_TEMPLATE, 'No email template available', 500),

  emailFailed: (detail?: string) =>
    new ApiError(ErrorCode.EMAIL_FAILED, detail ?? 'Failed to send email', 500),

  invalidEmail: () =>
    new ApiError(ErrorCode.INVALID_EMAIL, 'Invalid email address', 400),

  internal: (detail?: string) =>
    new ApiError(ErrorCode.INTERNAL, detail ?? 'Internal server error', 500),
};
