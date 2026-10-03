import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider,
  sendPasswordResetEmail, updateProfile, sendEmailVerification } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { getAuthClient, getDb } from '../../../shared/firebase/client.js'

/** Creates customers/{uid} once. Rules whitelist exactly these fields (no loyaltyBalance, no role). */
async function ensureProfile(user, displayName) {
  const ref = doc(getDb(), 'customers', user.uid)
  if ((await getDoc(ref)).exists()) return
  await setDoc(ref, { displayName: (displayName || user.displayName || '').slice(0, 80), phone: '', addresses: [], createdAt: serverTimestamp() })
}
export async function signUp({ name, email, password }) {
  const { user } = await createUserWithEmailAndPassword(getAuthClient(), email, password)
  if (name) await updateProfile(user, { displayName: name })
  await ensureProfile(user, name)
  await sendEmailVerification(user) // order creation will later require a verified email (enforced server-side)
}
export async function signIn({ email, password }) {
  const { user } = await signInWithEmailAndPassword(getAuthClient(), email, password)
  await ensureProfile(user)
}
export async function signInGoogle() {
  const { user } = await signInWithPopup(getAuthClient(), new GoogleAuthProvider())
  await ensureProfile(user)
}
export const resetPassword = (email) => sendPasswordResetEmail(getAuthClient(), email)

const MSG = {
  'auth/invalid-credential': 'الإيميل أو كلمة السر غير صحيحة.', 'auth/email-already-in-use': 'الإيميل ده مسجل قبل كده.',
  'auth/weak-password': 'كلمة السر ضعيفة (6 أحرف على الأقل).', 'auth/invalid-email': 'الإيميل غير صالح.',
  'auth/too-many-requests': 'محاولات كتير. جرّب بعد شوية.', 'auth/popup-closed-by-user': 'اتقفلت نافذة الدخول.',
}
export const authErrorMessage = (e) => MSG[e?.code] ?? 'حصل خطأ. حاول مرة تانية.'
/** Staff login: no customer profile is created, and the token is force-refreshed to pick up fresh claims. */
export async function signInStaff({ email, password }) {
  const { user } = await signInWithEmailAndPassword(getAuthClient(), email, password)
  await user.getIdToken(true)
}
export const resendVerification = (user) => sendEmailVerification(user)