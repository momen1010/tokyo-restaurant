/**
 * Cloud Functions entry point.
 * Phase 2: createOrder callable added.
 * Future: quoteOrder, transitionOrder, setStaffRole, Firestore triggers.
 */
import { setGlobalOptions } from 'firebase-functions/v2'

// Reduce cold-start latency, cap concurrent instances to control costs.
setGlobalOptions({
  maxInstances: 10,
  region: 'us-central1',
})

export { createOrderCallable } from './http/createOrder'