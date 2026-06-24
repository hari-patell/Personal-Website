import { useEffect, useMemo, useRef } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import {
  CREATION_ART,
  CREATION_COLS,
  CREATION_ROWS,
  CREATION_RAMP,
} from '../data/creationArt'

const FPS = 12
const MS_PER_FRAME = 1000 / FPS

// A barely-there global drift keeps the whole image alive without reading as
// the arms sliding up and down.
const DRIFT_AMP = 0.45     // rows
const DRIFT_PERIOD = 9000  // ms

const ROBOT_HOLD_MS = 2100      // how long a robot finger holds a pose before jerking
const ROBOT_TRANSITION_MS = 150 // duration of the jerk itself (~2 frames @ 12fps)

// Every finger curls by ROTATING about its knuckle, so the tip swings through an
// arc while the finger keeps its length (no stretching). pivot = knuckle,
// tip = fingertip; width is the finger's half-width; amp is the peak angle (rad).
//   - 'curl' (human/left hand): a smooth, one-directional ease in and out.
//   - 'jerk' (robot/right hand): holds dead still, then snaps to a new angle and
//     freezes again — same rotation, but mechanical. seed/timeOffset stagger it.
type Finger = {
  pr: number; pc: number   // pivot / knuckle (art row, col)
  tr: number; tc: number   // fingertip (art row, col)
  width: number            // perpendicular half-width of the finger
  amp: number              // peak rotation angle (radians)
  motion: 'curl' | 'jerk'
  period?: number; phase?: number      // 'curl'
  seed?: number; timeOffset?: number    // 'jerk'
}
const FINGERS: Finger[] = [
  // Adam's hand (left) = human: smooth curl
  { pr: 56, pc: 167, tr: 71, tc: 170, width: 4.5, amp: 0.24, motion: 'curl', period: 4200, phase: 0.0 },
  { pr: 58, pc: 152, tr: 70, tc: 150, width: 4.0, amp: 0.20, motion: 'curl', period: 4800, phase: 2.0 },
  // God's hand (right) = AI / robot: three dangling fingers, jerky rotation
  { pr: 71, pc: 237, tr: 88, tc: 236, width: 4.5, amp: 0.22, motion: 'jerk', seed: 11, timeOffset: 0 },
  { pr: 73, pc: 248, tr: 87, tc: 247, width: 4.0, amp: 0.20, motion: 'jerk', seed: 29, timeOffset: 760 },
  { pr: 77, pc: 263, tr: 88, tc: 262, width: 3.5, amp: 0.18, motion: 'jerk', seed: 47, timeOffset: 1340 },
]

// Deterministic pseudo-random pose level in { -1, -0.5, 0, 0.5, 1 } for a given
// finger seed and time slot — lets a robot finger pick a fresh small offset each
// hold without any per-frame randomness.
function robotLevel(seed: number, slot: number): number {
  let x = (Math.imul(seed, 374761393) + Math.imul(slot, 668265263)) >>> 0
  x = Math.imul(x ^ (x >>> 13), 1274126177) >>> 0
  return Math.round((x / 4294967295) * 4) / 2 - 1
}

// Hold-then-jerk waveform: flat for most of each hold, then a quick eased snap
// to the next pose. Returns a value in [-1, 1].
function robotStep(elapsed: number, seed: number, timeOffset: number): number {
  const t = elapsed + timeOffset
  const slot = Math.floor(t / ROBOT_HOLD_MS)
  const prev = robotLevel(seed, slot - 1)
  const target = robotLevel(seed, slot)
  const into = t - slot * ROBOT_HOLD_MS
  const k = Math.min(1, into / ROBOT_TRANSITION_MS)
  const eased = k * k * (3 - 2 * k) // smoothstep — fast but not an instant teleport
  return prev + (target - prev) * eased
}

export default function CreationBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const preRef = useRef<HTMLPreElement>(null)
  const { isDark } = useTheme()

  // Parse the art into a numeric brightness grid once.
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

  // Size the font so all CREATION_COLS columns span the container width.
  useEffect(() => {
    const pre = preRef.current
    const container = containerRef.current
    if (!pre || !container) return

    const fit = () => {
      const probe = document.createElement('span')
      probe.style.cssText =
        'position:absolute;visibility:hidden;font-family:"Courier New",Courier,monospace;font-size:100px;white-space:pre;'
      probe.textContent = 'X'.repeat(10)
      document.body.appendChild(probe)
      const ratio = probe.getBoundingClientRect().width / 10 / 100
      document.body.removeChild(probe)
      pre.style.fontSize = `${(container.clientWidth / (ratio * CREATION_COLS)) * 1.4}px`
    }

    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(container)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const pre = preRef.current
    if (!pre) return
    const max = CREATION_RAMP.length - 1
    const N = CREATION_ROWS * CREATION_COLS

    // For each finger, precompute the cells along it plus, per cell, its offset
    // from the knuckle (relRow/relCol) and a membership weight. At render time we
    // rotate those offsets about the knuckle, which swings the fingertip through
    // an arc without changing the finger's length. Works for both hands; only the
    // angle waveform differs (smooth curl vs. mechanical jerk).
    const KNEE = 4 // rows over which the rotation ramps in from the static knuckle
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
          const along = rr * ur + cc * uc           // distance from knuckle along finger
          const perp = Math.abs(rr * uc - cc * ur)   // distance off the finger axis
          if (along < 0) continue                    // nothing above the knuckle moves
          // ramp in over the knee, full along the finger, fade just past the tip
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

    // Per-cell sampling offset (row + column), rebuilt each frame.
    const dRow = new Float32Array(N)
    const dCol = new Float32Array(N)
    const lastRow = CREATION_ROWS - 1
    const lastCol = CREATION_COLS - 1

    const render = (elapsed: number) => {
      const drift = DRIFT_AMP * Math.sin((elapsed / DRIFT_PERIOD) * Math.PI * 2)
      dRow.fill(drift)
      dCol.fill(0)

      // Rotate each finger's cells about its knuckle. Human fingers use a smooth
      // one-directional curl (0 -> amp -> 0); robot fingers use the hold-then-jerk
      // schedule, so they snap between angles and freeze. Either way the rotation
      // maps to a (dRow, dCol) sampling offset, so the tip arcs while length holds.
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
          // bilinear sample of the brightness grid
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
    return () => cancelAnimationFrame(raf)
  }, [grid])

  return (
    // Hidden on mobile (below the md breakpoint).
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
