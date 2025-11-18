import { Github, Mail, Instagram, Linkedin, Code2, Binary, Terminal, Cpu, Database, Globe, Cloud } from "lucide-react"
import { SocialLink } from '../types'
import CipherText from './CipherText'
import FloatingIcon from './FloatingIcon'
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
    <section id="home" className="relative min-h-screen w-full bg-gradient-to-br from-black via-black to-zinc-900 text-white overflow-hidden flex items-center justify-center">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 w-full h-screen bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      
      {/* Gradient Overlay */}
      <div className="fixed inset-0 w-full h-screen bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0)_15%,rgba(0,0,0,0.3)_30%,rgba(0,0,0,0.7)_50%,rgba(0,0,0,0.9)_70%,rgba(0,0,0,1)_85%)] pointer-events-none"></div>

      {/* Floating Icons Container - Hidden on mobile for better performance */}
      <div className="hidden sm:block fixed inset-0 w-full h-screen overflow-hidden pointer-events-none">
        <FloatingIcon delay="animate-delay-2000" size="large" position={{ top: "12%", left: "18%" }}>
          <Binary className="w-8 h-8 text-orange-500/80" />
        </FloatingIcon>
        <FloatingIcon delay="animate-delay-3000" size="default" position={{ top: "27%", left: "78%" }}>
          <Code2 className="w-7 h-7 text-orange-500/70" />
        </FloatingIcon>
        <FloatingIcon delay="animate-delay-4000" size="small" position={{ top: "62%", left: "13%" }}>
          <Terminal className="w-6 h-6 text-orange-500/90" />
        </FloatingIcon>
        <FloatingIcon delay="animate-delay-5000" size="default" position={{ top: "38%", left: "88%" }}>
          <Cpu className="w-7 h-7 text-orange-500/80" />
        </FloatingIcon>
        <FloatingIcon delay="animate-delay-6000" size="small" position={{ top: "83%", left: "32%" }}>
          <Database className="w-6 h-6 text-orange-500/70" />
        </FloatingIcon>
        <FloatingIcon delay="animate-delay-7000" size="large" position={{ top: "8%", left: "63%" }}>
          <Globe className="w-8 h-8 text-orange-500/90" />
        </FloatingIcon>
        <FloatingIcon delay="animate-delay-8000" size="default" position={{ top: "73%", left: "67%" }}>
          <Cloud className="w-7 h-7 text-orange-500/80" />
        </FloatingIcon>
        
        <div className="hidden xl:block">
          <FloatingIcon delay="animate-delay-9000" size="large" position={{ top: "33%", left: "42%" }}>
            <Binary className="w-8 h-8 text-orange-500/70" />
          </FloatingIcon>
          <FloatingIcon delay="animate-delay-10000" size="default" position={{ top: "52%", left: "22%" }}>
            <Code2 className="w-7 h-7 text-orange-500/90" />
          </FloatingIcon>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full p-4 sm:p-8 safe-area-top safe-area-bottom">
        {/* Glass effect enhancement */}
        <div className="fixed top-0 left-0 w-full h-screen bg-gradient-to-tr from-zinc-900/20 via-black/10 to-zinc-800/20 blur-3xl opacity-50 pointer-events-none"></div>
        <div className="fixed bottom-0 right-0 w-full h-screen bg-gradient-to-bl from-zinc-800/20 via-black/10 to-zinc-900/20 blur-3xl opacity-50 pointer-events-none"></div>
        
        <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl backdrop-blur-sm bg-transparent border-0 relative overflow-hidden z-20">
          {/* Decorative Elements */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl overflow-hidden"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-orange-600/5 rounded-full blur-3xl overflow-hidden"></div>

          <div className="relative mb-6 text-center">
            <div className="relative">
              <div className="w-28 h-28 mx-auto mb-5 overflow-hidden rounded-full bg-gradient-to-r from-orange-500 to-orange-600 p-1">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile.jpg-EeWllMPYDsF3TgFrZLyr78EH91io3Q.jpeg"
                    alt="Hari-Krishna Patel"
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
                  />
                </div>
              </div>
              <div className="absolute inset-0 rounded-full animate-spin-slow [animation-duration:10s] bg-gradient-to-r from-orange-500/40 to-transparent blur-xl"></div>
            </div>
            <h1 className="mb-2 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
              Hari-Krishna Patel
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 relative inline-block">
              <span className="relative z-10">Software Engineer & Developer</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500/0 via-orange-500/50 to-orange-500/0"></span>
            </p>
          </div>

          <div className="grid gap-3">
            {socialLinks.map((link) => (
              <SocialLinkComponent key={link.label} {...link} />
            ))}
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
      className="flex items-center gap-2 px-4 py-2.5 transition-all duration-300 rounded-xl backdrop-blur-md bg-black/5 hover:bg-black/10 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20 group focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black"
    >
      <Icon className="w-5 h-5 text-orange-500 transition-transform duration-300 group-hover:rotate-12" aria-hidden="true" />
      <span className="relative overflow-hidden text-white">
        <CipherText text={label} />
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-orange-300 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
      </span>
    </a>
  )
}

