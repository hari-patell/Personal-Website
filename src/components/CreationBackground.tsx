import { useEffect, useRef } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import {
  CREATION_DOTS,
  CREATION_DESIGN_W,
  CREATION_DESIGN_H,
  CREATION_GAP_X,
} from '../data/creationDots'

/**
 * Hero background: a halftone dot rendering of the "Creation of Adam" reaching
 * hands. The left hand is human (a halftone of the fresco); the right hand is a
 * robot hand — segmented fingers and articulated knuckle joints — for a human/AI
 * motif. The two hands gently breathe and reach toward each other, the dots
 * shimmer faintly, and a soft spark pulses in the gap where the fingertips meet.
 *
 * Style and composition follow github.com/RayhaanFay/xfce-creation-of-adam.
 * Rendered to <canvas>; decorative only (aria-hidden, pointer-events-none) and
 * static when the user prefers reduced motion.
 */
export default function CreationBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { isDark } = useTheme()
  // Read the live theme inside the animation loop without re-subscribing it.
  const isDarkRef = useRef(isDark)
  isDarkRef.current = isDark

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Spark sits in the gap where the two index fingertips reach toward each other.
    const SPARK_X = CREATION_GAP_X - 4
    const SPARK_Y = 440
    const REACH_AMP = 7 // design-space px the fingertips travel as the hands breathe

    let raf = 0
    let cssW = 0
    let cssH = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      cssW = canvas.clientWidth
      cssH = canvas.clientHeight
      canvas.width = Math.round(cssW * dpr)
      canvas.height = Math.round(cssH * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (t: number) => {
      // "cover" mapping of the 1600×900 design space onto the canvas
      const scale = Math.max(cssW / CREATION_DESIGN_W, cssH / CREATION_DESIGN_H)
      const ox = (cssW - CREATION_DESIGN_W * scale) / 2
      const oy = (cssH - CREATION_DESIGN_H * scale) / 2

      ctx.clearRect(0, 0, cssW, cssH)

      const dark = isDarkRef.current
      ctx.fillStyle = dark ? 'rgb(245,240,232)' : 'rgb(68,64,60)'
      ctx.globalAlpha = dark ? 0.6 : 0.42

      const breathe = reduceMotion ? 0 : Math.sin(t * 0.0006)

      const dots = CREATION_DOTS
      for (let i = 0; i < dots.length; i += 3) {
        const dx = dots[i]
        const dy = dots[i + 1]
        let r = dots[i + 2]

        let x = dx
        let y = dy
        if (!reduceMotion) {
          // Reaching: dots near the central gap move most, forearms stay anchored.
          const human = dx < CREATION_GAP_X
          const f = human
            ? dx / CREATION_GAP_X
            : (CREATION_DESIGN_W - dx) / (CREATION_DESIGN_W - CREATION_GAP_X)
          const dir = human ? 1 : -1
          x += dir * REACH_AMP * breathe * f
          y += -REACH_AMP * 0.45 * breathe * f
          // Faint per-dot shimmer
          r *= 1 + 0.16 * Math.sin(t * 0.002 + dx * 0.045 + dy * 0.05)
        }

        ctx.beginPath()
        ctx.arc(ox + x * scale, oy + y * scale, r * scale, 0, Math.PI * 2)
        ctx.fill()
      }

      // Soft pulsing spark in the gap between the fingertips
      const pulse = reduceMotion ? 0.5 : 0.5 + 0.5 * Math.sin(t * 0.0024)
      const sx = ox + SPARK_X * scale
      const sy = oy + SPARK_Y * scale
      const sr = (10 + 14 * pulse) * scale
      const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr)
      const core = dark ? '255,250,240' : '120,110,100'
      grad.addColorStop(0, `rgba(${core},${(dark ? 0.5 : 0.4) * (0.5 + pulse)})`)
      grad.addColorStop(1, `rgba(${core},0)`)
      ctx.globalAlpha = 1
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(sx, sy, sr, 0, Math.PI * 2)
      ctx.fill()

      if (!reduceMotion) raf = requestAnimationFrame(draw)
    }

    const onResize = () => {
      resize()
      if (reduceMotion) draw(0)
    }

    resize()
    if (reduceMotion) {
      draw(0)
    } else {
      raf = requestAnimationFrame(draw)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full select-none"
    />
  )
}
