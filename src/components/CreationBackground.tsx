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

// Localized flex points placed on the fingertips of both hands. Each one nudges
// only the glyphs around it (Gaussian falloff), so the fingers curl/twitch while
// the arms and palms stay put. Coordinates are in art rows/cols (123 x 400).
// sx/sy are the influence radii.
//
// The left (human) hand uses smooth sine motion (phase/period). The right hand
// is the AI: instead of oscillating, it holds dead still, then jerks quickly to
// a new small offset and freezes again — slow, mechanical, never waving.
// seed/timeOffset drive that per-finger hold-and-jerk schedule.
type Flex = {
  r: number; c: number; amp: number; sx: number; sy: number
  phase: number; period: number
  robotic?: boolean; seed?: number; timeOffset?: number
}
const ROBOT_HOLD_MS = 2100      // how long a robot finger holds a pose before jerking
const ROBOT_TRANSITION_MS = 150 // duration of the jerk itself (~2 frames @ 12fps)
const FLEX_POINTS: Flex[] = [
  // God's hand (right) = AI / robot: hold-then-jerk, staggered per finger
  { r: 88, c: 230, amp: 2.0, sx: 13, sy: 18, phase: 0, period: 0, robotic: true, seed: 11, timeOffset: 0 },
  { r: 87, c: 256, amp: 2.0, sx: 13, sy: 18, phase: 0, period: 0, robotic: true, seed: 29, timeOffset: 760 },
  { r: 70, c: 324, amp: 1.6, sx: 19, sy: 13, phase: 0, period: 0, robotic: true, seed: 47, timeOffset: 1340 },
  // Adam's hand (left): dangling fingers + the iconic reaching index fingertip
  { r: 70, c: 165, amp: 2.8, sx: 14, sy: 16, phase: 2.3, period: 3200 },
  { r: 58, c: 210, amp: 2.6, sx: 20, sy: 13, phase: 4.2, period: 2500 },
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

    // Precompute each flex point's influence as a sparse list of (cell, weight)
    // pairs, so a frame only touches the few hundred glyphs near each fingertip
    // instead of the whole grid.
    const fields = FLEX_POINTS.map((f) => {
      const idx: number[] = []
      const wts: number[] = []
      const rMin = Math.max(0, Math.floor(f.r - 3 * f.sy))
      const rMax = Math.min(CREATION_ROWS - 1, Math.ceil(f.r + 3 * f.sy))
      const cMin = Math.max(0, Math.floor(f.c - 3 * f.sx))
      const cMax = Math.min(CREATION_COLS - 1, Math.ceil(f.c + 3 * f.sx))
      for (let r = rMin; r <= rMax; r++) {
        for (let c = cMin; c <= cMax; c++) {
          const dr = (r - f.r) / f.sy
          const dc = (c - f.c) / f.sx
          const w = f.amp * Math.exp(-(dr * dr + dc * dc))
          if (w < 0.02) continue
          idx.push(r * CREATION_COLS + c)
          wts.push(w)
        }
      }
      return {
        idx: Int32Array.from(idx),
        wts: Float32Array.from(wts),
        omega: f.period ? (Math.PI * 2) / f.period : 0,
        phase: f.phase,
        robotic: f.robotic ?? false,
        seed: f.seed ?? 0,
        timeOffset: f.timeOffset ?? 0,
      }
    })

    // Per-cell vertical displacement, rebuilt each frame.
    const dyField = new Float32Array(N)

    const render = (elapsed: number) => {
      const drift = DRIFT_AMP * Math.sin((elapsed / DRIFT_PERIOD) * Math.PI * 2)
      dyField.fill(drift)
      for (const fld of fields) {
        const s = fld.robotic
          ? robotStep(elapsed, fld.seed, fld.timeOffset)
          : Math.sin(elapsed * fld.omega + fld.phase)
        const { idx, wts } = fld
        for (let j = 0; j < idx.length; j++) dyField[idx[j]] += wts[j] * s
      }

      let out = ''
      for (let r = 0; r < CREATION_ROWS; r++) {
        const base = r * CREATION_COLS
        for (let c = 0; c < CREATION_COLS; c++) {
          const src = r - dyField[base + c]
          let r0 = Math.floor(src)
          const w = src - r0
          if (r0 < 0) r0 = 0
          else if (r0 > CREATION_ROWS - 1) r0 = CREATION_ROWS - 1
          let r1 = r0 + 1
          if (r1 > CREATION_ROWS - 1) r1 = CREATION_ROWS - 1
          const lvl = grid[r0 * CREATION_COLS + c] * (1 - w) + grid[r1 * CREATION_COLS + c] * w
          let i = (lvl + 0.5) | 0
          if (i > max) i = max
          out += CREATION_RAMP[i]
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
