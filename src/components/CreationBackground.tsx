import { useEffect, useRef } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { CREATION_FRAMES, CREATION_COLS } from '../data/creationFrames'

const FPS = 10          // frame rate for the ASCII swap
const MS_PER_FRAME = 1000 / FPS

export default function CreationBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const preRef = useRef<HTMLPreElement>(null)
  const { isDark } = useTheme()

  // Fit font-size so exactly CREATION_COLS chars span the container width.
  useEffect(() => {
    const pre = preRef.current
    const container = containerRef.current
    if (!pre || !container) return

    const fit = () => {
      // Measure real char width at a known font-size via a hidden span
      const probe = document.createElement('span')
      probe.style.cssText =
        'position:absolute;visibility:hidden;font-family:"Courier New",Courier,monospace;font-size:100px;white-space:pre;'
      probe.textContent = 'X'.repeat(10)
      document.body.appendChild(probe)
      const charW100 = probe.getBoundingClientRect().width / 10
      document.body.removeChild(probe)

      const ratio = charW100 / 100          // ch width as fraction of font-size
      const fontSize = container.clientWidth / (ratio * CREATION_COLS)
      pre.style.fontSize = `${fontSize}px`
    }

    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(container)
    return () => ro.disconnect()
  }, [])

  // Animate frames
  useEffect(() => {
    const pre = preRef.current
    if (!pre) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      pre.textContent = CREATION_FRAMES[0].join('\n')
      return
    }

    let frame = 0
    let last = 0
    let raf = 0

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick)
      if (t - last < MS_PER_FRAME) return
      last = t
      pre.textContent = CREATION_FRAMES[frame].join('\n')
      frame = (frame + 1) % CREATION_FRAMES.length
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
    >
      <pre
        ref={preRef}
        style={{ fontFamily: '"Courier New", Courier, monospace', lineHeight: 1 }}
        className={[
          'm-0 p-0 whitespace-pre',
          isDark
            ? 'text-stone-300 opacity-[0.22]'
            : 'text-stone-500 opacity-[0.18]',
        ].join(' ')}
      />
    </div>
  )
}
