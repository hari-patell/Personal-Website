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
const TWIST_AMP = 4    // max row shift at the extreme edges (twist)
const FLEX_AMP = 2     // extra row shift at fingertips (flex)
const TWIST_PERIOD = 6000  // ms per full twist cycle (slow, whole-hand rotation)
const FLEX_PERIOD = 2400   // ms per full flex cycle (faster, finger curl)

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
    // Reusable per-column displacement buffer — avoids allocation each frame.
    const colDy = new Float32Array(CREATION_COLS)

    const render = (elapsed: number) => {
      const sinTwist = Math.sin((elapsed / TWIST_PERIOD) * Math.PI * 2)
      const sinFlex  = Math.sin((elapsed / FLEX_PERIOD)  * Math.PI * 2)

      // Precompute vertical displacement for each column.
      // cn ∈ [-1, +1]: left edge = -1, right edge = +1.
      // Twist: linear — left goes up while right goes down (opposing shear).
      // Flex: quadratic — fingertips (|cn| ≈ 1) curl more than the palm centre.
      for (let c = 0; c < CREATION_COLS; c++) {
        const cn = (c / (CREATION_COLS - 1)) * 2 - 1
        colDy[c] = TWIST_AMP * sinTwist * cn + FLEX_AMP * sinFlex * cn * Math.abs(cn)
      }

      let out = ''
      for (let r = 0; r < CREATION_ROWS; r++) {
        for (let c = 0; c < CREATION_COLS; c++) {
          const src = r - colDy[c]
          let r0 = Math.floor(src)
          const w = src - r0
          if (r0 < 0) r0 = 0
          else if (r0 > CREATION_ROWS - 1) r0 = CREATION_ROWS - 1
          let r1 = r0 + 1
          if (r1 > CREATION_ROWS - 1) r1 = CREATION_ROWS - 1
          const lvl = grid[r0 * CREATION_COLS + c] * (1 - w) + grid[r1 * CREATION_COLS + c] * w
          let i = (lvl + 0.5) | 0
          if (i > max) i = max
          out += i < 2 ? ' ' : CREATION_RAMP[i]
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
          isDark ? 'text-stone-300 opacity-[0.20]' : 'text-stone-500 opacity-[0.16]',
        ].join(' ')}
      />
    </div>
  )
}
