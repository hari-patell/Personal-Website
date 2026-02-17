import { useEffect, useRef } from 'react'
import { useTheme } from '../contexts/ThemeContext'

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: -1000, y: -1000 })
  const currentRef = useRef({ x: -1000, y: -1000 })
  const rafRef = useRef<number>(0)
  const visibleRef = useRef(false)
  const fadeTimerRef = useRef<number>(0)
  const { isDark } = useTheme()

  useEffect(() => {
    const glow = glowRef.current
    if (!glow) return

    const isTouch = window.matchMedia('(hover: none)').matches

    const show = (x: number, y: number) => {
      posRef.current = { x, y }
      clearTimeout(fadeTimerRef.current)
      if (!visibleRef.current) {
        visibleRef.current = true
        // On touch, snap immediately so glow doesn't lerp in from offscreen
        if (isTouch) {
          currentRef.current = { x, y }
        }
        glow.style.opacity = '1'
      }
    }

    const hide = () => {
      visibleRef.current = false
      glow.style.opacity = '0'
    }

    // --- Desktop: mouse ---
    const handleMouseMove = (e: MouseEvent) => show(e.clientX, e.clientY)
    const handleMouseLeave = () => hide()

    // --- Mobile: touch ---
    const handleTouchStart = (e: TouchEvent) => {
      const t = e.touches[0]
      show(t.clientX, t.clientY)
    }
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0]
      show(t.clientX, t.clientY)
    }
    const handleTouchEnd = () => {
      // Linger briefly then fade out
      fadeTimerRef.current = window.setTimeout(hide, 600)
    }

    // --- Animation loop ---
    const animate = () => {
      const lerp = isTouch ? 0.15 : 0.07
      currentRef.current.x += (posRef.current.x - currentRef.current.x) * lerp
      currentRef.current.y += (posRef.current.y - currentRef.current.y) * lerp

      glow.style.transform = `translate(${currentRef.current.x}px, ${currentRef.current.y}px) translate(-50%, -50%)`
      rafRef.current = requestAnimationFrame(animate)
    }

    if (isTouch) {
      window.addEventListener('touchstart', handleTouchStart, { passive: true })
      window.addEventListener('touchmove', handleTouchMove, { passive: true })
      window.addEventListener('touchend', handleTouchEnd, { passive: true })
    } else {
      window.addEventListener('mousemove', handleMouseMove, { passive: true })
      document.addEventListener('mouseleave', handleMouseLeave)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      clearTimeout(fadeTimerRef.current)
      cancelAnimationFrame(rafRef.current)
      if (isTouch) {
        window.removeEventListener('touchstart', handleTouchStart)
        window.removeEventListener('touchmove', handleTouchMove)
        window.removeEventListener('touchend', handleTouchEnd)
      } else {
        window.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-40 will-change-transform"
      style={{
        width: 550,
        height: 550,
        opacity: 0,
        transition: 'opacity 0.8s ease',
        borderRadius: '50%',
        background: isDark
          ? 'radial-gradient(circle, rgba(250,247,242,0.035) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(180,170,155,0.12) 0%, transparent 70%)',
      }}
    />
  )
}
