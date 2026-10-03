// Grants/revokes admin via Custom Claims. Run LOCALLY by the owner. Never ship a key with the app.
// Emulator:  set FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099   (Windows cmd)
// Real:      set GOOGLE_APPLICATION_CREDENTIALS=C:\secure\key.json   (file kept OUTSIDE this project, never committed)
// Usage:     node scripts/set-admin.mjs user@mail.com [--role=owner|admin] [--revoke]
import admin from 'firebase-admin'

const [, , email, ...flags] = process.argv
const revoke = flags.includes('--revoke')
const role = flags.find((f) => f.startsWith('--role='))?.split('=')[1] ?? 'owner'
if (!email || !['owner', 'admin'].includes(role)) {
  console.error('Usage: node scripts/set-admin.mjs <email> [--role=owner|admin] [--revoke]'); process.exit(1)
}
const emulator = Boolean(process.env.FIREBASE_AUTH_EMULATOR_HOST)
if (!emulator && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Set FIREBASE_AUTH_EMULATOR_HOST (emulator) or GOOGLE_APPLICATION_CREDENTIALS (real project).'); process.exit(1)
}
admin.initializeApp({ projectId: process.env.GCLOUD_PROJECT || (emulator ? 'demo-tokyo' : undefined) })

const auth = admin.auth()
const user = await auth.getUserByEmail(email)
if (revoke) {
  await auth.setCustomUserClaims(user.uid, null)
  await auth.revokeRefreshTokens(user.uid)   // kills existing sessions' refresh ability
  console.log(`Revoked admin for ${email}. Existing ID tokens expire within ~1h.`)
} else {
  await auth.setCustomUserClaims(user.uid, { admin: true, role })
  console.log(`Granted admin:true, role:${role} to ${email}. The user must sign in again (or refresh the token).`)
}