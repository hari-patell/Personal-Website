import { useEffect, useRef, useCallback, useState } from 'react'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import { useTheme } from '../contexts/ThemeContext'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  baseRadius: number
  opacity: number
  life: number
  maxLife: number
  isBurst: boolean
}

const PARTICLE_COUNT = 80
const CONNECTION_DISTANCE = 120
const MOUSE_RADIUS = 150
const BURST_COUNT = 12

export default function Interactive() {
  const { ref, hasIntersected } = useIntersectionObserver()
  const { isDark } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000, isActive: false })
  const animationRef = useRef<number>(0)
  const dimensionsRef = useRef({ width: 0, height: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const createParticle = useCallback((
    x: number,
    y: number,
    isBurst = false
  ): Particle => {
    const speed = isBurst ? 1.5 + Math.random() * 2 : 0.15 + Math.random() * 0.35
    const angle = Math.random() * Math.PI * 2
    const radius = isBurst ? 1.5 + Math.random() * 2 : 1.5 + Math.random() * 2.5
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius,
      baseRadius: radius,
      opacity: isBurst ? 0.9 : 0.3 + Math.random() * 0.4,
      life: 0,
      maxLife: isBurst ? 60 + Math.random() * 40 : Infinity,
      isBurst,
    }
  }, [])

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(
        createParticle(
          Math.random() * width,
          Math.random() * height
        )
      )
    }
    particlesRef.current = particles
  }, [createParticle])

  const handleClick = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    for (let i = 0; i < BURST_COUNT; i++) {
      particlesRef.current.push(createParticle(x, y, true))
    }
  }, [createParticle])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const { width, height } = parent.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.scale(dpr, dpr)
      dimensionsRef.current = { width, height }

      if (particlesRef.current.length === 0) {
        initParticles(width, height)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        isActive: true,
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current.isActive = false
    }

    resize()
    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    canvas.addEventListener('click', handleClick)

    const animate = () => {
      const { width, height } = dimensionsRef.current
      ctx.clearRect(0, 0, width, height)

      const particles = particlesRef.current
      const mouse = mouseRef.current

      // Colors based on theme
      const particleColor = isDark ? '250, 247, 242' : '28, 25, 23'
      const lineColor = isDark ? '250, 247, 242' : '120, 113, 108'

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]

        // Mouse interaction - gentle attraction
        if (mouse.isActive) {
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MOUSE_RADIUS && dist > 0) {
            const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.02
            p.vx += (dx / dist) * force
            p.vy += (dy / dist) * force
            // Grow particles near mouse
            p.radius = p.baseRadius + (1 - dist / MOUSE_RADIUS) * 2
          } else {
            p.radius += (p.baseRadius - p.radius) * 0.05
          }
        } else {
          p.radius += (p.baseRadius - p.radius) * 0.05
        }

        // Apply velocity with dampening
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.99
        p.vy *= 0.99

        // Wrap around edges (non-burst particles)
        if (!p.isBurst) {
          if (p.x < -10) p.x = width + 10
          if (p.x > width + 10) p.x = -10
          if (p.y < -10) p.y = height + 10
          if (p.y > height + 10) p.y = -10
        }

        // Burst particle lifecycle
        if (p.isBurst) {
          p.life++
          p.opacity = Math.max(0, 0.9 * (1 - p.life / p.maxLife))
          p.vx *= 0.97
          p.vy *= 0.97
          if (p.life >= p.maxLife) {
            particles.splice(i, 1)
            continue
          }
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${particleColor}, ${p.opacity})`
        ctx.fill()
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < CONNECTION_DISTANCE) {
            const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      // Draw mouse connections
      if (mouse.isActive) {
        for (const p of particles) {
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MOUSE_RADIUS) {
            const opacity = (1 - dist / MOUSE_RADIUS) * 0.25
            ctx.beginPath()
            ctx.moveTo(mouse.x, mouse.y)
            ctx.lineTo(p.x, p.y)
            ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      canvas.removeEventListener('click', handleClick)
    }
  }, [isDark, initParticles, handleClick])

  return (
    <section
      id="interactive"
      ref={ref}
      aria-label="Interactive section"
      className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 safe-area-top"
    >
      <div className="max-w-5xl w-full">
        <div
          className={`transition-all duration-1000 ${
            hasIntersected
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold mb-2 text-center text-stone-900 dark:text-cream-100 tracking-tight">
            Particle <span className="italic font-medium">Canvas</span>
          </h2>
          <div className="serif-divider my-6"></div>
          <p className="text-center text-stone-500 dark:text-cream-200 text-base sm:text-lg mb-10 max-w-2xl mx-auto">
            Move your cursor to attract particles. Click to create bursts.
          </p>
          <div
            className="relative w-full rounded-2xl border border-stone-200/60 dark:border-stone-600/50 bg-white/40 dark:bg-stone-800/30 backdrop-blur-sm overflow-hidden"
            style={{ aspectRatio: '16 / 9' }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full cursor-crosshair"
            />
            <div
              className={`absolute bottom-4 right-4 text-xs text-stone-400 dark:text-stone-500 transition-opacity duration-500 pointer-events-none select-none ${
                isHovering ? 'opacity-0' : 'opacity-100'
              }`}
            >
              hover &amp; click to interact
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
