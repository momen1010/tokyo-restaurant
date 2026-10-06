/**
 * Typed error helpers for Cloud Functions.
 * Every thrown error becomes a structured HttpsError the client can read.
 */
import { HttpsError } from 'firebase-functions/v2/https'

export type ErrorCode =
  | 'invalid-argument'
  | 'failed-precondition'
  | 'not-found'
  | 'already-exists'
  | 'permission-denied'
  | 'unauthenticated'
  | 'resource-exhausted'
  | 'internal'
  | 'unavailable'

/** Base structured error. Never throw this directly — use the helpers below. */
export class AppError extends Error {
  public readonly code: ErrorCode
  public readonly userMessage: string
  public readonly details: Record<string, unknown>

  constructor(code: ErrorCode, userMessage: string, details: Record<string, unknown> = {}) {
    super(userMessage)
    this.name = 'AppError'
    this.code = code
    this.userMessage = userMessage
    this.details = details
  }
}

/** Convert an AppError (or unknown) into an HttpsError with structured payload. */
export function toHttpsError(err: unknown): HttpsError {
  if (err instanceof AppError) {
    return new HttpsError(err.code, err.userMessage, err.details)
  }
  console.error('[unhandled error]', err)
  return new HttpsError('internal', 'حدث خطأ غير متوقع. من فضلك حاول تاني.')
}

// ---------- Convenience helpers ----------

export const validationError = (msg: string, details: Record<string, unknown> = {}) =>
  new AppError('invalid-argument', msg, details)

export const notFoundError = (msg: string, details: Record<string, unknown> = {}) =>
  new AppError('not-found', msg, details)

export const failedPrecondition = (msg: string, details: Record<string, unknown> = {}) =>
  new AppError('failed-precondition', msg, details)

export const permissionDenied = (msg: string, details: Record<string, unknown> = {}) =>
  new AppError('permission-denied', msg, details)

export const unauthenticated = (msg = 'لازم تسجّل دخول الأول.') =>
  new AppError('unauthenticated', msg)

export const resourceExhausted = (msg: string, details: Record<string, unknown> = {}) =>
  new AppError('resource-exhausted', msg, details)