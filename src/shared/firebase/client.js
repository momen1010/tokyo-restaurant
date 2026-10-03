
import { initializeApp, getApps } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'

const firebaseConfig = {
  apiKey: "AIzaSyD8riKj1cRU6QZL-6oRcJwMhpbZhlwim2s",
  authDomain: "tokyo-bd717.firebaseapp.com",
  projectId: "tokyo-bd717",
  storageBucket: "tokyo-bd717.firebasestorage.app",
  messagingSenderId: "484890478858",
  appId: "1:484890478858:web:b3e9d4f9c1af834eb252f3",
  measurementId: "G-TKX9C96GDT"
}

/**
 * True only when the required web config is present.
 * UI must work without Firebase until it is wired.
 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
)

const useEmulators =
  import.meta.env.DEV &&
  import.meta.env.VITE_USE_EMULATORS === 'true'

const cache = {}

/**
 * Lazy Firebase initialization.
 * Firebase is not initialized until a service is requested.
 */
function app() {
  if (!isFirebaseConfigured) {
    throw new Error(
      'Firebase is not configured. Fill in .env (see .env.example).'
    )
  }

  return getApps()[0] ?? initializeApp(firebaseConfig)
}

/**
 * Creates and caches Firebase services.
 */
function once(key, make, connect) {
  if (!cache[key]) {
    cache[key] = make(app())

    if (useEmulators) {
      connect(cache[key])
    }
  }

  return cache[key]
}

/**
 * Firebase Authentication
 */
export const getAuthClient = () =>
  once(
    'auth',
    getAuth,
    (auth) => {
      connectAuthEmulator(
        auth,
        'http://127.0.0.1:9099'
      )
    }
  )

/**
 * Cloud Firestore
 */
export const getDb = () =>
  once(
    'db',
    getFirestore,
    (db) => {
      connectFirestoreEmulator(
        db,
        '127.0.0.1',
        8080
      )
    }
  )

/**
 * Firebase Storage
 */
export const getStorageClient = () =>
  once(
    'storage',
    getStorage,
    (storage) => {
      connectStorageEmulator(
        storage,
        '127.0.0.1',
        9199
      )
    }
  )

/**
 * Firebase Cloud Functions
 */
export const getFunctionsClient = () =>
  once(
    'functions',
    getFunctions,
    (functions) => {
      connectFunctionsEmulator(
        functions,
        '127.0.0.1',
        5001
      )
    }
  )

