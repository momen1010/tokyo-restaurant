/**
 * Runtime validators for untrusted input (callable data, request payloads).
 * Pure functions — no side effects, no Firebase imports.
 */
import { validationError } from './errors'

// ---------- Primitives ----------

export const isString = (v: unknown): v is string => typeof v === 'string'

export const isNonEmptyString = (v: unknown): v is string =>
  isString(v) && v.trim().length > 0

export const isInt = (v: unknown): v is number =>
  typeof v === 'number' && Number.isInteger(v)

export const isNonNegativeInt = (v: unknown): v is number =>
  isInt(v) && v >= 0

export const isBoolean = (v: unknown): v is boolean => typeof v === 'boolean'

export const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

export const isArray = (v: unknown): v is unknown[] => Array.isArray(v)

// ---------- Domain-specific ----------

/** Egyptian mobile: 01[0-2,5]XXXXXXXX (11 digits total). */
export const isValidEgyptianPhone = (v: unknown): v is string =>
  isString(v) && /^01[0-2,5]\d{8}$/.test(v)

/** Normalize phone: strips spaces, dashes, and leading +20 / 0020. */
export function normalizePhone(input: string): string {
  let p = input.replace(/[\s\-()]/g, '')
  if (p.startsWith('+20')) p = '0' + p.slice(3)
  else if (p.startsWith('0020')) p = '0' + p.slice(4)
  else if (p.startsWith('20') && p.length === 12) p = '0' + p.slice(2)
  return p
}

// ---------- Assertions (throw AppError on failure) ----------

export function assertPhone(v: unknown, field = 'customerPhone'): string {
  if (!isString(v)) throw validationError('رقم التليفون مطلوب.', { field })
  const normalized = normalizePhone(v)
  if (!isValidEgyptianPhone(normalized)) {
    throw validationError('رقم تليفون مصري غير صحيح.', { field })
  }
  return normalized
}

export function assertNonEmptyString(
  v: unknown,
  field: string,
  userMessage: string,
  { min = 1, max = 500 }: { min?: number; max?: number } = {}
): string {
  if (!isNonEmptyString(v)) throw validationError(userMessage, { field })
  const trimmed = v.trim()
  if (trimmed.length < min || trimmed.length > max) {
    throw validationError(userMessage, { field })
  }
  return trimmed
}

export function assertInt(
  v: unknown,
  field: string,
  userMessage: string,
  { min = 0, max = Number.MAX_SAFE_INTEGER }: { min?: number; max?: number } = {}
): number {
  if (!isInt(v) || v < min || v > max) throw validationError(userMessage, { field })
  return v
}

export function assertArray<T = unknown>(
  v: unknown,
  field: string,
  userMessage: string,
  { min = 0, max = 1000 }: { min?: number; max?: number } = {}
): T[] {
  if (!isArray(v)) throw validationError(userMessage, { field })
  if (v.length < min || v.length > max) throw validationError(userMessage, { field })
  return v as T[]
}

export function assertPlainObject(
  v: unknown,
  field: string,
  userMessage: string
): Record<string, unknown> {
  if (!isPlainObject(v)) throw validationError(userMessage, { field })
  return v
}