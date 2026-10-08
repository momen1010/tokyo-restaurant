/**
 * useOrderNotification — plays a beep + flashes the title when a new order arrives.
 * Unlocks AudioContext on first user interaction (browser autoplay policy).
 */
import { useEffect, useRef } from 'react'

const ORIGINAL_TITLE = typeof document !== 'undefined' ? document.title : 'TOKYO'

// Global AudioContext (created once, resumed on first user gesture)
let audioCtxRef = null

function ensureAudioCtx() {
  if (audioCtxRef) return audioCtxRef
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return null
    audioCtxRef = new Ctx()
    return audioCtxRef
  } catch (err) {
    console.warn('[notification] AudioContext init failed:', err)
    return null
  }
}

/** Call on any user gesture to unlock audio. */
export function unlockAudio() {
  const ctx = ensureAudioCtx()
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {})
  }
}

/** Play a two-tone beep. */
export function playBeep() {
  const ctx = ensureAudioCtx()
  if (!ctx) return
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {})
  }

  const now = ctx.currentTime
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(0.35, now + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5)
  gain.connect(ctx.destination)

  const osc1 = ctx.createOscillator()
  osc1.type = 'sine'
  osc1.frequency.setValueAtTime(880, now)
  osc1.connect(gain)
  osc1.start(now)
  osc1.stop(now + 0.15)

  const osc2 = ctx.createOscillator()
  osc2.type = 'sine'
  osc2.frequency.setValueAtTime(660, now + 0.18)
  osc2.connect(gain)
  osc2.start(now + 0.18)
  osc2.stop(now + 0.35)
}

function flashTitle(count) {
  let on = false
  let flashes = 0
  const maxFlashes = 10

  const interval = setInterval(() => {
    on = !on
    document.title = on ? `🔔 (${count}) طلب جديد` : ORIGINAL_TITLE
    flashes++
    if (flashes >= maxFlashes) {
      clearInterval(interval)
      document.title = ORIGINAL_TITLE
    }
  }, 500)

  const stop = () => {
    clearInterval(interval)
    document.title = ORIGINAL_TITLE
    window.removeEventListener('focus', stop)
    window.removeEventListener('click', stop)
  }
  window.addEventListener('focus', stop)
  window.addEventListener('click', stop)
}

/**
 * Hook: watch orders and notify on new ones.
 * Also unlocks audio on first user gesture.
 */
export default function useOrderNotification(orders, enabled = true) {
  const seenIdsRef = useRef(new Set())
  const initializedRef = useRef(false)

  // Unlock audio on first user gesture (global listener)
  useEffect(() => {
    const unlock = () => unlockAudio()
    window.addEventListener('click', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })
    window.addEventListener('touchstart', unlock, { once: true })
    return () => {
      window.removeEventListener('click', unlock)
      window.removeEventListener('keydown', unlock)
      window.removeEventListener('touchstart', unlock)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return
    if (!orders || orders.length === 0) return

    if (!initializedRef.current) {
      orders.forEach((o) => seenIdsRef.current.add(o.id))
      initializedRef.current = true
      return
    }

    const newOrders = orders.filter((o) => !seenIdsRef.current.has(o.id))
    if (newOrders.length === 0) return

    newOrders.forEach((o) => seenIdsRef.current.add(o.id))

    playBeep()
    flashTitle(newOrders.length)
  }, [orders, enabled])
}