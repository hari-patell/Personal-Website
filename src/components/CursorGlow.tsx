import { useEffect, useRef } from 'react'
import { useTheme } from '../contexts/ThemeContext'

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: -1000, y: -1000 })
  const currentRef = useRef({ x: -1000, y: -1000 })
  const rafRef = useRef<number>(0)
  const visibleRef = useRef(false)
  const { isDark } = useTheme()

  useEffect(() => {
    const glow = glowRef.current
    if (!glow) return

    // Hide on touch devices — no persistent cursor
    const isTouch = window.matchMedia('(hover: none)').matches
    if (isTouch) return

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY }
      if (!visibleRef.current) {
        visibleRef.current = true
        glow.style.opacity = '1'
      }
    }

    const handleMouseLeave = () => {
      visibleRef.current = false
      glow.style.opacity = '0'
    }

    const animate = () => {
      const lerp = 0.07
      currentRef.current.x += (posRef.current.x - currentRef.current.x) * lerp
      currentRef.current.y += (posRef.current.y - currentRef.current.y) * lerp

      glow.style.transform = `translate(${currentRef.current.x}px, ${currentRef.current.y}px) translate(-50%, -50%)`

      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(rafRef.current)
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
