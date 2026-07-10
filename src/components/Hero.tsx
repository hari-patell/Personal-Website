import { useEffect, useRef, useState } from 'react'
import { Github, Mail, Instagram, Linkedin, ArrowDown } from "lucide-react"
import { SocialLink } from '../types'
import XIcon from './XIcon'
import CreationBackground from './CreationBackground'
import profileImage from '../profile.jpg'
import { useIntro } from '../contexts/IntroContext'
import { useTheme } from '../contexts/ThemeContext'

// Divine spark rendered as a tiny ASCII starburst: a tight radial core plus
// four rays of light mapped onto a brightness ramp, breathing on a slow pulse
// with a gentle per-cell boil so it feels like living light. The star shape
// distinguishes it from the round textured masses of the hands. Chars are
// ~2x taller than wide, so dx is scaled to keep the shape round.
const ORB_ROWS = 11
const ORB_COLS = 21
const ORB_RAMP = ' .:-~=+*#%@'
const ORB_MS_PER_FRAME = 1000 / 12

function orbFrame(t: number): string {
  const cx = (ORB_COLS - 1) / 2
  const cy = (ORB_ROWS - 1) / 2
  const kMax = ORB_RAMP.length - 1
  const pulse = 0.8 + 0.2 * Math.sin((t / 2200) * Math.PI * 2)
  const twinkle = 0.7 + 0.3 * Math.sin(t / 700)  // rays flare on their own beat
  let out = ''
  for (let r = 0; r < ORB_ROWS; r++) {
    for (let c = 0; c < ORB_COLS; c++) {
      const dx = (c - cx) * 0.55
      const dy = r - cy
      const d = Math.hypot(dx, dy)
      // four-pointed star: rays along the horizontal/vertical axes
      const theta = Math.atan2(dy, dx)
      const rays = Math.abs(Math.cos(theta * 2)) ** 6 * Math.max(0, 1 - d / 5.4) * 0.7 * twinkle
      const boil = 0.14 * Math.sin(t / 260 + c * 1.9 + r * 2.6)
      const b = (1.3 - d / 2.9) * pulse + rays * pulse + boil
      let k = Math.round(b * kMax)
      if (k < 0) k = 0
      else if (k > kMax) k = kMax
      out += ORB_RAMP[k]
    }
    if (r < ORB_ROWS - 1) out += '\n'
  }
  return out
}

const socialLinks: SocialLink[] = [
  { icon: Mail, href: "mailto:hari1880patel@gmail.com", label: "Email" },
  { icon: XIcon, href: "https://x.com/hari_patell", label: "X" },
  { icon: Instagram, href: "https://instagram.com/hari_patell", label: "Instagram" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/hari-krishna-patel", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/hari-patell", label: "GitHub" },
]

export default function Hero() {
  const { phase, startSwirl } = useIntro()
  const { isDark } = useTheme()
  const introActive = phase === 'enter' || phase === 'swirl'
  const entering = phase === 'enter'

  // Crossfade the site in beneath the dissipating smoke: reveal the hero
  // partway through the swirl instead of waiting for it to finish, so there's
  // never a blank frame between the hands and the content. Timed so the smoke
  // is mostly dissipated before the content starts rising — the hands get
  // their moment to fade, then the site takes over. Without an intro (mobile,
  // returning visitors) reveal immediately, as before.
  const [revealed, setRevealed] = useState(phase === 'done')
  useEffect(() => {
    if (phase === 'done') { setRevealed(true); return }
    if (phase !== 'swirl') return
    const t = setTimeout(() => setRevealed(true), 1000)
    return () => clearTimeout(t)
  }, [phase])

  // Fade in the "begin" hint after a short pause so it doesn't compete with the
  // art on first load.
  const [showHint, setShowHint] = useState(false)
  useEffect(() => {
    if (!entering) { setShowHint(false); return }
    const t = setTimeout(() => setShowHint(true), 2200)
    return () => clearTimeout(t)
  }, [entering])

  // Animate the ASCII orb while the intro is showing (through the swirl too,
  // so it keeps living while it fades out instead of freezing mid-fade).
  const orbRef = useRef<HTMLPreElement>(null)
  useEffect(() => {
    if (!introActive) return
    const pre = orbRef.current
    if (!pre) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      pre.textContent = orbFrame(550)
      return
    }
    let raf = 0
    let last = 0
    const start = performance.now()
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      if (now - last < ORB_MS_PER_FRAME) return
      last = now
      pre.textContent = orbFrame(now - start)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [introActive])

  return (
    <section id="home" className="relative min-h-screen w-full bg-cream-100 dark:bg-darkBg overflow-hidden flex items-center justify-center">
      <CreationBackground />

      {/* Divine spark — shown during the intro, positioned to sit in the gap
          between Adam's and God's fingertips. Stays mounted through the swirl
          and fades out with the smoke rather than vanishing in a single frame
          on click. */}
      {introActive && (
        <div
          className={[
            'pointer-events-none absolute inset-0 z-20 flex items-center justify-center',
            'transition-opacity duration-500 ease-out',
            // intro-art-reveal fades the spark in with the hands on load; the
            // class is dropped when the swirl starts (a filled animation would
            // otherwise pin opacity and block the fade-out transition)
            entering ? 'intro-art-reveal opacity-100' : 'opacity-0',
          ].join(' ')}
        >
          <button
            onClick={startSwirl}
            aria-label="Enter"
            className={[
              'relative flex cursor-pointer flex-col items-center focus:outline-none',
              entering ? 'pointer-events-auto' : 'pointer-events-none',
            ].join(' ')}
            style={{ marginTop: '15vh' }}
          >
            {/* ASCII starburst — same character medium as the hands, but golden,
                haloed, and set in a soft clearing that dims the art behind it.
                Glyphs render at --creation-glyph-size (published by
                CreationBackground) so the star sits at exactly the art's
                scale; halo and glow are in em so they shrink with it. */}
            <div
              className="relative flex items-center justify-center"
              style={{ fontSize: 'var(--creation-glyph-size, 9px)' }}
            >
              <span
                aria-hidden="true"
                className="absolute rounded-full"
                style={{
                  width: '19em',
                  height: '15.5em',
                  background: isDark
                    ? 'radial-gradient(ellipse, rgba(23,23,23,0.95) 0%, rgba(23,23,23,0.6) 45%, transparent 72%)'
                    : 'radial-gradient(ellipse, rgba(250,247,242,0.95) 0%, rgba(250,247,242,0.6) 45%, transparent 72%)',
                }}
              />
              <pre
                ref={orbRef}
                aria-hidden="true"
                className="relative m-0 p-0 select-none"
                style={{
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: 'inherit',
                  lineHeight: 1,
                  color: isDark ? '#ffdf94' : 'rgba(146,104,22,0.95)',
                  textShadow: isDark
                    ? '0 0 0.9em rgba(255,205,90,0.9), 0 0 2.4em rgba(255,180,60,0.5), 0 0 5.3em rgba(220,150,40,0.3)'
                    : '0 0 0.9em rgba(170,120,30,0.55), 0 0 2.2em rgba(150,100,20,0.3)',
                }}
              />
            </div>
            {/* Delayed hint label */}
            <span
              className="mt-7 block text-[10px] tracking-[0.4em] uppercase transition-opacity duration-700 select-none"
              style={{
                color: isDark ? 'rgba(168,162,158,0.55)' : 'rgba(120,113,108,0.5)',
                opacity: showHint ? 1 : 0,
              }}
            >
              begin
            </span>
          </button>
        </div>
      )}

      <div className={[
        'relative z-10 flex flex-col items-center justify-center min-h-screen w-full px-6 sm:px-8 safe-area-top safe-area-bottom',
        // No fade on the container itself — the hero-animate children carry
        // the staggered fade-in; a container fade on top would double-fade
        // everything and make the reveal feel sluggish.
        revealed ? 'hero-revealed' : 'pointer-events-none select-none opacity-0',
      ].join(' ')}>
        <div className="w-full max-w-2xl text-center">
          {/* Profile Image */}
          <div className="relative mb-8 inline-block hero-animate hero-animate-delay-1">
            <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto overflow-hidden rounded-full ring-2 ring-stone-200 dark:ring-stone-600 ring-offset-4 ring-offset-cream-100 dark:ring-offset-darkBg">
              <img
                src={profileImage}
                alt="Hari-Krishna Patel"
                width={320}
                height={320}
                fetchPriority="high"
                className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

          {/* Name - Large Serif */}
          <h1 className="hero-animate hero-animate-delay-2 font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-stone-900 dark:text-cream-100 tracking-tight leading-[0.95] mb-4">
            Hari-Krishna
            <br />
            <span className="italic font-medium">Patel</span>
          </h1>

          {/* Thin divider */}
          <div className="serif-divider my-6 hero-divider-animate"></div>

          {/* Subtitle */}
          <p className="hero-animate hero-animate-delay-4 text-base sm:text-lg text-stone-500 dark:text-cream-200 font-light tracking-wide mb-10">
            Software Engineer & Developer
          </p>

          {/* Social Links - Horizontal row */}
          <div className="hero-animate hero-animate-delay-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {socialLinks.map((link) => (
              <SocialLinkComponent key={link.label} {...link} />
            ))}
          </div>
        </div>

        {/* Scroll indicator — entrance fade on its own wrapper (bounce and
            heroFadeIn both set `animation`, so they can't share an element) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="hero-animate hero-animate-delay-5">
            <div className="animate-bounce">
              <ArrowDown className="w-5 h-5 text-stone-400 dark:text-cream-300" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function SocialLinkComponent({ icon: Icon, href, label }: SocialLink) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${label} profile`}
      className="flex items-center gap-2 px-4 py-2.5 transition-all duration-300 rounded-xl bg-white/60 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-600/60 hover:bg-white dark:hover:bg-stone-700/80 hover:border-stone-300 dark:hover:border-stone-500 hover:shadow-sm group focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-cream-400 focus:ring-offset-2 focus:ring-offset-cream-100 dark:focus:ring-offset-darkBg"
    >
      <Icon className="w-4 h-4 text-stone-500 dark:text-cream-300 transition-colors duration-300 group-hover:text-stone-800 dark:group-hover:text-cream-100" aria-hidden="true" />
      <span className="text-stone-700 dark:text-cream-200 text-sm font-medium transition-colors duration-300 group-hover:text-stone-900 dark:group-hover:text-cream-100">
        {label}
      </span>
    </a>
  )
}
