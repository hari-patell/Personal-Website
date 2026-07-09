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

const ROBOT_HOLD_MS = 2100      // how long a robot finger holds a pose before jerking
const ROBOT_TRANSITION_MS = 150 // duration of the jerk itself (~2 frames @ 12fps)

// Every finger curls by ROTATING about its knuckle, so the tip swings through an
// arc while the finger keeps its length (no stretching). pivot = knuckle,
// tip = fingertip; width is the finger's half-width; amp is the peak angle (rad).
//   - 'curl' (human fingers): a smooth, one-directional ease in and out.
//   - 'sway' (human wrist): a slow drifting ± tilt about neutral, built from
//     two incommensurate sine harmonics so it never reads as a metronome.
//   - 'jerk' (robot): holds dead still, then snaps to a new angle and
//     freezes again — same rotation, but mechanical. seed/timeOffset stagger it.
type Finger = {
  pr: number; pc: number   // pivot / knuckle (art row, col)
  tr: number; tc: number   // fingertip (art row, col)
  width: number            // perpendicular half-width of the finger
  amp: number              // peak rotation angle (radians)
  motion: 'curl' | 'jerk' | 'sway'
  period?: number; phase?: number      // 'curl' / 'sway'
  seed?: number; timeOffset?: number    // 'jerk'
  rigid?: boolean          // wrists: no perp falloff — the hand moves as one slab
  knee?: number            // hinge softening distance at the pivot (default KNEE)
  hold?: number            // per-entry robot hold cadence (default ROBOT_HOLD_MS)
}
const FINGERS: Finger[] = [
  // Wrists — the DOMINANT motion. The whole hand rotates about the wrist as
  // one truly rigid slab (rigid: no perp falloff): the entire silhouette
  // sweeps together, so the rotation legibly originates at the wrist. The
  // angle is generous (~6 deg) but slow, so the sweep is graceful: the
  // fingertip end travels ~5 cells while the wrist line stays planted.
  // Adam: pivot at the forearm/hand junction; slow organic drooping sway.
  { pr: 50, pc: 128, tr: 76, tc: 172, width: 26, amp: 0.11, motion: 'sway', period: 9500, phase: 0.8, rigid: true, knee: 10 },
  // God: whole-hand servo repositions every 3.4s — slower than his fingers'
  // 2.1s ticks so the hand tick reads as the primary event. seed 19 changes
  // pose on every hold and starts non-zero.
  { pr: 62, pc: 288, tr: 87, tc: 233, width: 24, amp: 0.075, motion: 'jerk', seed: 19, timeOffset: 700, rigid: true, knee: 10, hold: 3400 },
  // Fingers — SECONDARY articulation layered on the wrist hinge, kept smaller
  // than the wrist's contribution so the hand reads as one rigid unit with a
  // little finger flex, not as fingers shifting on a static hand. (Adam's
  // strands also sit only a few columns apart — big swings smear them.)
  { pr: 56, pc: 167, tr: 71, tc: 170, width: 3.0, amp: 0.05, motion: 'curl', period: 4200, phase: 0.0 },
  { pr: 58, pc: 152, tr: 70, tc: 150, width: 2.8, amp: 0.05, motion: 'curl', period: 4800, phase: 2.0 },
  { pr: 71, pc: 237, tr: 88, tc: 236, width: 4.5, amp: 0.11, motion: 'jerk', seed: 11, timeOffset: 0 },
  { pr: 73, pc: 248, tr: 87, tc: 247, width: 4.0, amp: 0.10, motion: 'jerk', seed: 29, timeOffset: 760 },
  { pr: 77, pc: 263, tr: 88, tc: 262, width: 3.5, amp: 0.09, motion: 'jerk', seed: 47, timeOffset: 1340 },
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
function robotStep(elapsed: number, seed: number, timeOffset: number, holdMs: number): number {
  const t = elapsed + timeOffset
  const slot = Math.floor(t / holdMs)
  const prev = robotLevel(seed, slot - 1)
  const target = robotLevel(seed, slot)
  const into = t - slot * holdMs
  const k = Math.min(1, into / ROBOT_TRANSITION_MS)
  const eased = k * k * (3 - 2 * k) // smoothstep — fast but not an instant teleport
  return prev + (target - prev) * eased
}

// Swirl-to-smoke dissolve: when the spark is clicked the whole image billows
// apart like smoke. A turbulent displacement field grows over time (the texture
// rises and curls), and every cell fades to empty — radiating outward from the
// finger-gap origin so the dissipation appears to start at the spark.
const SWIRL_ORIGIN_R = 79
const SWIRL_ORIGIN_C = 200
const SWIRL_MAX_DIST = 215   // origin → far corner, in art cells
const SWIRL_SPREAD_MS = 500  // ms for the dissolve wavefront to reach the corners
const SWIRL_FADE_MS = 1000   // per-cell fade-to-nothing duration
const SWIRL_LIFETIME = 1400  // ms over which the turbulence grows to full strength
const SWIRL_RISE = 22        // rows of upward billow at full strength
const SWIRL_TURB = 6.5       // swirling turbulence amplitude (cells)
const SWIRL_CSS_MS = 1700    // CSS upward drift + blur + fade duration

export default function CreationBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const preRef = useRef<HTMLPreElement>(null)
  const { isDark } = useTheme()
  const { phase, completeIntro } = useIntro()

  // Refs so the render loop (inside a [grid]-dep useEffect) can read latest values
  // without being recreated on phase changes.
  const phaseRef = useRef(phase)
  const completeIntroRef = useRef(completeIntro)
  const swirlStartRef = useRef<number | null>(null)

  useEffect(() => { phaseRef.current = phase }, [phase])
  useEffect(() => { completeIntroRef.current = completeIntro }, [completeIntro])

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
      const knee = f.knee ?? KNEE
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
          // ramp in over the knee, full along the finger, fade just past the tip.
          // rigid entries (wrists) skip the perp falloff entirely so the whole
          // hand slab — silhouette included — rotates coherently.
          const wIn = Math.min(1, along / knee)
          const wOut = 1 - Math.max(0, Math.min(1, (along - len) / 6))
          const wPerp = f.rigid ? 1 : Math.exp(-(perp / f.width) * (perp / f.width))
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
        motion: f.motion,
        omega: f.period ? (Math.PI * 2) / f.period : 0,
        phase: f.phase ?? 0,
        seed: f.seed ?? 0,
        timeOffset: f.timeOffset ?? 0,
        hold: f.hold ?? ROBOT_HOLD_MS,
      }
    })

    // Precompute per-cell distance from the swirl origin once at setup — avoids
    // ~49k sqrt calls per frame during the smoke phase.
    const distGrid = new Float32Array(N)
    for (let r = 0; r < CREATION_ROWS; r++) {
      for (let c = 0; c < CREATION_COLS; c++) {
        const dr = r - SWIRL_ORIGIN_R
        const dc = c - SWIRL_ORIGIN_C
        distGrid[r * CREATION_COLS + c] = Math.sqrt(dr * dr + dc * dc)
      }
    }

    // Per-frame trig lookup arrays for swirl turbulence. Each of the three trig
    // terms depends on only one axis (col, row, or col+row diagonal), so we fill
    // these arrays before the inner loop (~1k calls) instead of calling
    // sin/cos/sqrt per cell (~197k calls at 49k cells × 4 ops).
    const colSin = new Float32Array(CREATION_COLS)
    const rowCos = new Float32Array(CREATION_ROWS)
    const diagSin = new Float32Array(CREATION_ROWS + CREATION_COLS)

    // Output as a typed byte buffer decoded once per frame — eliminates the GC
    // pressure from 49k string concatenations. Newlines are pre-filled once.
    const RAMP_CODES = Uint8Array.from(CREATION_RAMP, ch => ch.charCodeAt(0))
    const SPACE_CODE = 32
    const decoder = new TextDecoder()
    const LINE_STRIDE = CREATION_COLS + 1      // chars per row + newline
    const outBuf = new Uint8Array(CREATION_ROWS * LINE_STRIDE - 1)
    for (let r = 0; r < CREATION_ROWS - 1; r++)
      outBuf[(r + 1) * LINE_STRIDE - 1] = 10  // '\n'

    // Per-cell sampling offset (row + column), rebuilt each frame.
    const dRow = new Float32Array(N)
    const dCol = new Float32Array(N)
    const lastRow = CREATION_ROWS - 1
    const lastCol = CREATION_COLS - 1

    const render = (elapsed: number) => {
      // --- Swirl trigger (fires once when phase first becomes 'swirl') ---
      const curPhase = phaseRef.current
      if (curPhase === 'swirl' && swirlStartRef.current === null) {
        swirlStartRef.current = elapsed
        // Drift the whole plume up and out while blurring + fading — sells the
        // billowing-smoke feel on top of the per-cell turbulence below.
        pre.style.transition = `transform ${SWIRL_CSS_MS}ms ease-out, opacity ${SWIRL_CSS_MS}ms ease-in`
        pre.style.transform = 'translateY(-9%) scale(1.18)'
        pre.style.opacity = '0'
        setTimeout(() => completeIntroRef.current(), SWIRL_CSS_MS + 60)
      }

      dRow.fill(0)
      dCol.fill(0)

      // Rotate each finger's cells about its knuckle. Human fingers use a smooth
      // one-directional curl (0 -> amp -> 0); the human wrist sways symmetrically
      // about neutral; robot parts use the hold-then-jerk schedule, snapping
      // between angles and freezing. Either way the rotation maps to a
      // (dRow, dCol) sampling offset, so the tip arcs while length holds.
      for (const fld of fingerFields) {
        const a0 = elapsed * fld.omega + fld.phase
        const phi = fld.motion === 'jerk'
          ? fld.amp * robotStep(elapsed, fld.seed, fld.timeOffset, fld.hold)
          : fld.motion === 'sway'
            // two incommensurate harmonics -> slow drifting tilt, never metronomic
            ? fld.amp * (0.72 * Math.sin(a0) + 0.28 * Math.sin(1.73 * a0 + 1.1))
            : fld.amp * (0.5 - 0.5 * Math.cos(a0))
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

      // Time since swirl started (negative = not swirling). Precompute the
      // smoke growth factor and animated phases once per frame.
      const swirlT = swirlStartRef.current !== null ? elapsed - swirlStartRef.current : -1
      const swirling = swirlT >= 0
      const grow = swirling ? Math.min(1, swirlT / SWIRL_LIFETIME) ** 2 : 0
      const tt = swirlT / 1000

      // Fill per-axis trig lookup arrays once per swirl frame (~923 calls)
      // instead of per cell (~197k calls). Only computed when actually swirling.
      if (swirling) {
        for (let c = 0; c < CREATION_COLS; c++)
          colSin[c] = Math.sin(c * 0.10 + tt * 2.2) * SWIRL_TURB * grow
        for (let r = 0; r < CREATION_ROWS; r++)
          rowCos[r] = Math.cos(r * 0.12 + tt * 1.8) * SWIRL_TURB * grow
        for (let d = 0; d < CREATION_ROWS + CREATION_COLS; d++)
          diagSin[d] = Math.sin(d * 0.05 + tt * 3.0) * SWIRL_TURB * 0.6 * grow
      }

      for (let r = 0; r < CREATION_ROWS; r++) {
        const base = r * CREATION_COLS
        const lineBase = r * LINE_STRIDE
        for (let c = 0; c < CREATION_COLS; c++) {
          const i = base + c
          let sr = r - dRow[i]
          let sc = c - dCol[i]

          if (swirling) {
            sr += SWIRL_RISE * grow
            sr += colSin[c]
            sc += rowCos[r]
            sc += diagSin[r + c]
            if (sr < 0 || sr > lastRow || sc < 0 || sc > lastCol) {
              outBuf[lineBase + c] = SPACE_CODE
              continue
            }
          } else {
            if (sr < 0) sr = 0
            else if (sr > lastRow) sr = lastRow
            if (sc < 0) sc = 0
            else if (sc > lastCol) sc = lastCol
          }

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
          let kf = top * (1 - wr) + bot * wr

          if (swirling) {
            const dist = distGrid[i]
            const cellDelay = (dist / SWIRL_MAX_DIST) * SWIRL_SPREAD_MS
            const fade = Math.max(0, Math.min(1, (swirlT - cellDelay) / SWIRL_FADE_MS))
            kf *= 1 - fade
          }

          let k = (kf + 0.5) | 0
          if (k > max) k = max
          outBuf[lineBase + c] = RAMP_CODES[k]
        }
      }
      pre.textContent = decoder.decode(outBuf)
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

  // Unmount entirely once the intro is done — cancels the RAF loop and frees
  // the DOM element. Mobile always skips intro so this is a no-op there too.
  if (phase === 'done') return null

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
          isDark ? 'text-cream-100' : 'text-stone-900',
        ].join(' ')}
      />
    </div>
  )
}
