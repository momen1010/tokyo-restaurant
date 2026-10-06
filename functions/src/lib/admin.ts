/**
 * Firebase Admin SDK singleton.
 * Initialized once per function instance (Cloud Functions warm starts reuse it).
 */
import { initializeApp, getApps, App } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'
import { getAuth, Auth } from 'firebase-admin/auth'

let app: App | null = null

function ensureApp(): App {
  if (app) return app
  app = getApps()[0] ?? initializeApp()
  return app
}

let db: Firestore | null = null
export function getDb(): Firestore {
  if (!db) db = getFirestore(ensureApp())
  return db
}

let auth: Auth | null = null
export function getAuthClient(): Auth {
  if (!auth) auth = getAuth(ensureApp())
  return auth
}

/** Firestore server timestamp helper. */
export { FieldValue, Timestamp } from 'firebase-admin/firestore'