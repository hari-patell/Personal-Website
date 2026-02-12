import { Github, Mail, Instagram, Linkedin, ArrowDown } from "lucide-react"
import { SocialLink } from '../types'
import CipherText from './CipherText'
import XIcon from './XIcon'

const socialLinks: SocialLink[] = [
  { icon: Mail, href: "mailto:hari1880patel@gmail.com", label: "Email" },
  { icon: XIcon, href: "https://x.com/hari_patell", label: "X" },
  { icon: Instagram, href: "https://instagram.com/hari_patell", label: "Instagram" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/hari-krishna-patel", label: "LinkedIn" },
  { icon: Github, href: "https://github.com/hari-patell", label: "GitHub" },
]

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen w-full bg-cream-100 overflow-hidden flex items-center justify-center">
      {/* Subtle decorative elements */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-cream-200/60 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-cream-200/40 to-transparent pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full px-6 sm:px-8 safe-area-top safe-area-bottom">
        <div className="w-full max-w-2xl text-center">
          {/* Profile Image */}
          <div className="relative mb-8 inline-block">
            <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto overflow-hidden rounded-full ring-2 ring-stone-200 ring-offset-4 ring-offset-cream-100">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile.jpg-EeWllMPYDsF3TgFrZLyr78EH91io3Q.jpeg"
                alt="Hari-Krishna Patel"
                className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

          {/* Name - Large Serif */}
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-stone-900 tracking-tight leading-[0.95] mb-4">
            Hari-Krishna
            <br />
            <span className="italic font-medium">Patel</span>
          </h1>

          {/* Thin divider */}
          <div className="serif-divider my-6"></div>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-stone-500 font-light tracking-wide mb-10">
            Software Engineer & Developer
          </p>

          {/* Social Links - Horizontal row */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {socialLinks.map((link) => (
              <SocialLinkComponent key={link.label} {...link} />
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-5 h-5 text-stone-400" />
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
      className="flex items-center gap-2 px-4 py-2.5 transition-all duration-300 rounded-xl bg-white/60 border border-stone-200/60 hover:bg-white hover:border-stone-300 hover:shadow-sm group focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 focus:ring-offset-cream-100"
    >
      <Icon className="w-4 h-4 text-stone-500 transition-colors duration-300 group-hover:text-stone-800" aria-hidden="true" />
      <span className="relative overflow-hidden text-stone-700 text-sm font-medium">
        <CipherText text={label} />
      </span>
    </a>
  )
}
