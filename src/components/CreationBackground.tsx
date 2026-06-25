import { useEffect, useMemo, useRef } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useIntro } from '../contexts/IntroContext'
import {
  CREATION_ART,
  CREATION_COLS,
  CREATION_ROWS,
  CREATION_RAMP,
} from '../data/creationArt'

const FPS = 12
const MS_PER_FRAME = 1000 / FPS

const DRIFT_AMP = 0.45
const DRIFT_PERIOD = 9000

const ROBOT_HOLD_MS = 2100
const ROBOT_TRANSITION_MS = 150

type Finger = {
  pr: number; pc: number
  tr: number; tc: number
  width: number
  amp: number
  motion: 'curl' | 'jerk'
  period?: number; phase?: number
  seed?: number; timeOffset?: number
}
const FINGERS: Finger[] = [
  { pr: 56, pc: 167, tr: 71, tc: 170, width: 4.5, amp: 0.24, motion: 'curl', period: 4200, phase: 0.0 },
  { pr: 58, pc: 152, tr: 70, tc: 150, width: 4.0, amp: 0.20, motion: 'curl', period: 4800, phase: 2.0 },
  { pr: 71, pc: 237, tr: 88, tc: 236, width: 4.5, amp: 0.22, motion: 'jerk', seed: 11, timeOffset: 0 },
  { pr: 73, pc: 248, tr: 87, tc: 247, width: 4.0, amp: 0.20, motion: 'jerk', seed: 29, timeOffset: 760 },
  { pr: 77, pc: 263, tr: 88, tc: 262, width: 3.5, amp: 0.18, motion: 'jerk', seed: 47, timeOffset: 1340 },
]

function robotLevel(seed: number, slot: number): number {
  let x = (Math.imul(seed, 374761393) + Math.imul(slot, 668265263)) >>> 0
  x = Math.imul(x ^ (x >>> 13), 1274126177) >>> 0
  return Math.round((x / 4294967295) * 4) / 2 - 1
}

function robotStep(elapsed: number, seed: number, timeOffset: number): number {
  const t = elapsed + timeOffset
  const slot = Math.floor(t / ROBOT_HOLD_MS)
  const prev = robotLevel(seed, slot - 1)
  const target = robotLevel(seed, slot)
  const into = t - slot * ROBOT_HOLD_MS
  const k = Math.min(1, into / ROBOT_TRANSITION_MS)
  const eased = k * k * (3 - 2 * k)
  return prev + (target - prev) * eased
}

// How fast the pre element fades out when swirl begins.
const SWIRL_PRE_FADE_MS = 350

// Full-screen canvas smoke overlay. Runs its own 60fps RAF loop independently
// of the pre's 12fps animation, so the two never contend. The canvas is appended
// directly to document.body so it truly covers everything (nav, hero, all).
function startSmoke(isDark: boolean, onComplete: () => void): () => void {
  const FONT = 18
  const CW = FONT * 0.601   // Courier New char width / font-size ratio
  const CH = FONT * 1.15    // line height
  const CHARS = ' .:-~+=*#@'
  const NC = CHARS.length
  const BG = isDark ? '#171717' : '#FAF7F2'
  const FG = isDark ? '215,205,185' : '60,52,42'
  const TOTAL = 1700
  const FADE_IN = 380
  const FADE_OUT_START = 950

  const cv = document.createElement('canvas')
  cv.style.cssText = 'position:fixed;inset:0;z-index:999;pointer-events:none;'
  document.body.appendChild(cv)
  const ctx = cv.getContext('2d')!
  cv.width = window.innerWidth
  cv.height = window.innerHeight

  let startT = 0
  let raf = 0

  function frame(now: number) {
    if (startT === 0) startT = now
    const t = now - startT
    if (t >= TOTAL) {
      cancelAnimationFrame(raf)
      cv.remove()
      onComplete()
      return
    }
    raf = requestAnimationFrame(frame)

    const alpha =
      t < FADE_IN
        ? t / FADE_IN
        : t > FADE_OUT_START
          ? 1 - (t - FADE_OUT_START) / (TOTAL - FADE_OUT_START)
          : 1.0

    const cols = Math.ceil(cv.width / CW) + 1
    const rows = Math.ceil(cv.height / CH) + 1
    const tt = t / 1000

    // Solid background — one fillRect, no per-cell cost
    ctx.globalAlpha = 1
    ctx.fillStyle = BG
    ctx.fillRect(0, 0, cv.width, cv.height)

    // Smoke chars — fillStyle and font set once per frame
    ctx.font = `${FONT}px "Courier New", Courier, monospace`
    ctx.fillStyle = `rgb(${FG})`
    ctx.globalAlpha = alpha

    for (let row = 0; row < rows; row++) {
      // Shift the noise sample row upward over time so smoke visually rises
      const nr = row - tt * 4
      const y = row * CH + CH
      for (let col = 0; col < cols; col++) {
        // Three trig layers at different frequencies and speeds — cheap, turbulent
        const n1 = Math.sin(col * 0.17 + tt * 2.1) * Math.cos(nr * 0.22 + tt * 1.8)
        const n2 = Math.sin((col * 0.11 - nr * 0.09) + tt * 3.0) * 0.62
        const n3 = Math.cos(col * 0.08 + nr * 0.15 + tt * 4.3) * 0.38
        const noise = Math.max(0, Math.min(1, (n1 + n2 + n3 + 2) / 4))
        if (noise < 0.08) continue
        const ch = CHARS[Math.min(NC - 1, Math.floor(noise * NC))]
        if (ch === ' ') continue
        ctx.fillText(ch, col * CW, y)
      }
    }
  }

  raf = requestAnimationFrame(frame)
  return () => { cancelAnimationFrame(raf); cv.remove() }
}

export default function CreationBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const preRef = useRef<HTMLPreElement>(null)
  const { isDark } = useTheme()
  const { phase, completeIntro } = useIntro()

  // Refs so the 12fps render loop can read current values without being rebuilt
  const phaseRef = useRef(phase)
  const completeIntroRef = useRef(completeIntro)
  const isDarkRef = useRef(isDark)
  const swirlStartRef = useRef<number | null>(null)
  const smokeCleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => { phaseRef.current = phase }, [phase])
  useEffect(() => { completeIntroRef.current = completeIntro }, [completeIntro])
  useEffect(() => { isDarkRef.current = isDark }, [isDark])

  // When the intro finishes, reset the pre element back to its normal style.
  // It will be invisible behind the fading-in hero content, so the instant
  // transform snap is unnoticeable.
  useEffect(() => {
    if (phase !== 'done') return
    swirlStartRef.current = null
    smokeCleanupRef.current?.()
    smokeCleanupRef.current = null
    const pre = preRef.current
    if (!pre) return
    pre.style.transition = 'opacity 0.6s ease-out'
    pre.style.transform = ''
    pre.style.opacity = ''
    const id = setTimeout(() => { pre.style.transition = '' }, 700)
    return () => clearTimeout(id)
  }, [phase])

  const grid = useMemo(() => {
    const g = new Int8Array(CREATION_ROWS * CREATION_COLS)
    for (let r = 0; r < CREATION_ROWS; r++) {
      const line = CREATION_ART[r]
      for (let c = 0; c < CREATION_COLS; c++) {
        const idx = CREATION_RAMP.indexOf(line[c] ?? ' ')
        g[r * CREATION_COLS + c] = idx < 0 ? 0 : idx
      }
    }
    return g
  }, [])

  useEffect(() => {
    const pre = preRef.current
    if (!pre) return
    const max = CREATION_RAMP.length - 1
    const N = CREATION_ROWS * CREATION_COLS

    const KNEE = 4
    const fingerFields = FINGERS.map((f) => {
      const ar = f.tr - f.pr
      const ac = f.tc - f.pc
      const len = Math.hypot(ar, ac) || 1
      const ur = ar / len
      const uc = ac / len
      const idx: number[] = []
      const relRow: number[] = []
      const relCol: number[] = []
      const wts: number[] = []
      const margin = 3 * f.width + 2
      const rMin = Math.max(0, Math.floor(Math.min(f.pr, f.tr) - margin))
      const rMax = Math.min(CREATION_ROWS - 1, Math.ceil(Math.max(f.pr, f.tr) + margin))
      const cMin = Math.max(0, Math.floor(Math.min(f.pc, f.tc) - margin))
      const cMax = Math.min(CREATION_COLS - 1, Math.ceil(Math.max(f.pc, f.tc) + margin))
      for (let r = rMin; r <= rMax; r++) {
        for (let c = cMin; c <= cMax; c++) {
          const rr = r - f.pr
          const cc = c - f.pc
          const along = rr * ur + cc * uc
          const perp = Math.abs(rr * uc - cc * ur)
          if (along < 0) continue
          const wIn = Math.min(1, along / KNEE)
          const wOut = 1 - Math.max(0, Math.min(1, (along - len) / 6))
          const wPerp = Math.exp(-(perp / f.width) * (perp / f.width))
          const w = wIn * wOut * wPerp
          if (w < 0.05) continue
          idx.push(r * CREATION_COLS + c)
          relRow.push(rr)
          relCol.push(cc)
          wts.push(w)
        }
      }
      return {
        idx: Int32Array.from(idx),
        relRow: Float32Array.from(relRow),
        relCol: Float32Array.from(relCol),
        wts: Float32Array.from(wts),
        amp: f.amp,
        jerk: f.motion === 'jerk',
        omega: f.period ? (Math.PI * 2) / f.period : 0,
        phase: f.phase ?? 0,
        seed: f.seed ?? 0,
        timeOffset: f.timeOffset ?? 0,
      }
    })

    const dRow = new Float32Array(N)
    const dCol = new Float32Array(N)
    const lastRow = CREATION_ROWS - 1
    const lastCol = CREATION_COLS - 1

    const render = (elapsed: number) => {
      const curPhase = phaseRef.current

      // During swirl: fire the canvas overlay once, then stop touching the pre.
      // The canvas handles all the visible smoke; the pre just CSS-fades away.
      if (curPhase === 'swirl') {
        if (swirlStartRef.current === null) {
          swirlStartRef.current = elapsed
          pre.style.transition = `opacity ${SWIRL_PRE_FADE_MS}ms ease-in`
          pre.style.opacity = '0'
          smokeCleanupRef.current = startSmoke(isDarkRef.current, () =>
            completeIntroRef.current(),
          )
        }
        return
      }

      const drift = DRIFT_AMP * Math.sin((elapsed / DRIFT_PERIOD) * Math.PI * 2)
      dRow.fill(drift)
      dCol.fill(0)

      for (const fld of fingerFields) {
        const phi = fld.jerk
          ? fld.amp * robotStep(elapsed, fld.seed, fld.timeOffset)
          : fld.amp * (0.5 - 0.5 * Math.cos(elapsed * fld.omega + fld.phase))
        const { idx, relRow, relCol, wts } = fld
        for (let j = 0; j < idx.length; j++) {
          const a = phi * wts[j]
          const ca1 = 1 - Math.cos(a)
          const sa = Math.sin(a)
          const y = relRow[j]
          const x = relCol[j]
          dCol[idx[j]] += x * ca1 - y * sa
          dRow[idx[j]] += x * sa + y * ca1
        }
      }

      let out = ''
      for (let r = 0; r < CREATION_ROWS; r++) {
        const base = r * CREATION_COLS
        for (let c = 0; c < CREATION_COLS; c++) {
          const i = base + c
          let sr = r - dRow[i]
          let sc = c - dCol[i]
          if (sr < 0) sr = 0
          else if (sr > lastRow) sr = lastRow
          if (sc < 0) sc = 0
          else if (sc > lastCol) sc = lastCol
          const r0 = sr | 0
          const c0 = sc | 0
          const wr = sr - r0
          const wc = sc - c0
          const r1 = r0 < lastRow ? r0 + 1 : r0
          const c1 = c0 < lastCol ? c0 + 1 : c0
          const o0 = r0 * CREATION_COLS
          const o1 = r1 * CREATION_COLS
          const top = grid[o0 + c0] * (1 - wc) + grid[o0 + c1] * wc
          const bot = grid[o1 + c0] * (1 - wc) + grid[o1 + c1] * wc
          let k = (top * (1 - wr) + bot * wr + 0.5) | 0
          if (k > max) k = max
          out += CREATION_RAMP[k]
        }
        if (r < CREATION_ROWS - 1) out += '\n'
      }
      pre.textContent = out
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      render(0)
      return
    }

    let raf = 0
    let last = 0
    const start = performance.now()
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick)
      if (t - last < MS_PER_FRAME) return
      last = t
      render(t - start)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      smokeCleanupRef.current?.()
      smokeCleanupRef.current = null
    }
  }, [grid])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 hidden select-none items-center justify-center overflow-hidden md:flex"
    >
      <pre
        ref={preRef}
        style={{ fontFamily: '"Courier New", Courier, monospace', lineHeight: 1 }}
        className={[
          'm-0 p-0 whitespace-pre',
          isDark ? 'text-stone-200 opacity-[0.34]' : 'text-stone-700 opacity-[0.32]',
        ].join(' ')}
      />
    </div>
  )
}
