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
const BOB_ROWS = 3 // how many rows the arms travel up/down
const PERIOD_MS = 5500 // one full up-down cycle

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

  // Render a frame at a fractional vertical offset, interpolating between rows
  // so glyphs morph rather than just jump by whole lines.
  useEffect(() => {
    const pre = preRef.current
    if (!pre) return
    const max = CREATION_RAMP.length - 1

    const render = (dy: number) => {
      let out = ''
      for (let r = 0; r < CREATION_ROWS; r++) {
        const src = r - dy
        let r0 = Math.floor(src)
        const w = src - r0
        if (r0 < 0) r0 = 0
        else if (r0 > CREATION_ROWS - 1) r0 = CREATION_ROWS - 1
        let r1 = r0 + 1
        if (r1 > CREATION_ROWS - 1) r1 = CREATION_ROWS - 1
        const o0 = r0 * CREATION_COLS
        const o1 = r1 * CREATION_COLS
        for (let c = 0; c < CREATION_COLS; c++) {
          const lvl = grid[o0 + c] * (1 - w) + grid[o1 + c] * w
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
      const dy = BOB_ROWS * Math.sin(((t - start) / PERIOD_MS) * Math.PI * 2)
      render(dy)
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
