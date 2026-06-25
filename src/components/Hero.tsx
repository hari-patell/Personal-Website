import { useEffect, useState } from 'react'
import { Github, Mail, Instagram, Linkedin, ArrowDown } from "lucide-react"
import { SocialLink } from '../types'
import XIcon from './XIcon'
import CreationBackground from './CreationBackground'
import profileImage from '../profile.jpg'
import { useIntro } from '../contexts/IntroContext'
import { useTheme } from '../contexts/ThemeContext'

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

  // Fade in the "begin" hint after a short pause so it doesn't compete with the
  // art on first load.
  const [showHint, setShowHint] = useState(false)
  useEffect(() => {
    if (!entering) { setShowHint(false); return }
    const t = setTimeout(() => setShowHint(true), 2200)
    return () => clearTimeout(t)
  }, [entering])

  return (
    <section id="home" className="relative min-h-screen w-full bg-cream-100 dark:bg-darkBg overflow-hidden flex items-center justify-center">
      <CreationBackground />

      {/* Divine spark — shown only on desktop during the enter phase.
          Positioned to sit in the gap between Adam's and God's fingertips. */}
      {entering && (
        <div className="pointer-events-none absolute inset-0 z-20 hidden md:flex items-center justify-center">
          <button
            onClick={startSwirl}
            aria-label="Enter"
            className="pointer-events-auto relative flex cursor-pointer flex-col items-center focus:outline-none"
            style={{ marginTop: '15vh' }}
          >
            <div className="relative flex items-center justify-center">
              {/* Expanding ping ring */}
              <span
                className="absolute h-4 w-4 animate-ping rounded-full"
                style={{
                  background: isDark
                    ? 'rgba(255,220,130,0.35)'
                    : 'rgba(160,120,50,0.28)',
                }}
              />
              {/* Centre glow dot */}
              <span
                className="block h-3 w-3 animate-pulse rounded-full"
                style={{
                  background: isDark
                    ? 'rgba(255,235,160,0.95)'
                    : 'rgba(155,115,35,0.9)',
                  boxShadow: isDark
                    ? '0 0 18px 7px rgba(255,200,80,0.45), 0 0 45px 20px rgba(220,160,50,0.18)'
                    : '0 0 14px 5px rgba(160,115,30,0.55), 0 0 35px 15px rgba(140,95,20,0.22)',
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
        introActive
          ? 'pointer-events-none select-none opacity-0'
          : 'transition-opacity duration-700 opacity-100',
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

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-5 h-5 text-stone-400 dark:text-cream-300" />
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
