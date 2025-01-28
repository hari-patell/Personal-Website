//Swami Shriji
import type React from "react"
import { useEffect, useRef } from "react"
import { Github, Mail, Instagram, Linkedin, Code2, Binary, Terminal, Cpu, Database, Globe, Cloud } from "lucide-react"

// Custom X (Twitter) icon component
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        fill="currentColor"
      />
    </svg>
  )
}

function FloatingIcon({
  children,
  delay,
  size = "default",
}: { children: React.ReactNode; delay: string; size?: "small" | "default" | "large" }) {
  const sizeClasses = {
    small: "p-3",
    default: "p-4",
    large: "p-6",
  }

  return (
    <div
      className={`absolute animate-float ${delay} backdrop-blur-sm bg-orange-500/10 ${sizeClasses[size]} rounded-2xl border border-white/5`}
    >
      {children}
    </div>
  )
}

function CipherText({ text }: { text: string }) {
  const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
  const intervalRef = useRef<number>()

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <span className="cipher-text">
      {text.split("").map((char, index) => (
        <span
          key={index}
          className="cipher-char"
          data-char={char}
          data-scramble={chars[Math.floor(Math.random() * chars.length)]}
        >
          {char}
        </span>
      ))}
    </span>
  )
}

function SocialLink({ icon: Icon, href, label }: { icon: React.ElementType; href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-6 py-3 transition-all duration-300 rounded-xl backdrop-blur-md bg-white/5 hover:bg-white/10 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20 group"
    >
      <Icon className="w-5 h-5 text-orange-500 transition-transform duration-300 group-hover:rotate-12" />
      <span className="relative overflow-hidden">
        <CipherText text={label} />
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-orange-300 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
      </span>
    </a>
  )
}

function App() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-black to-zinc-900 text-white overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      {/* Floating Background Elements */}
      <FloatingIcon delay="animate-delay-2000" size="large">
        <Binary className="w-10 h-10 text-orange-500/50" />
      </FloatingIcon>
      <FloatingIcon delay="animate-delay-3000" size="default">
        <Code2 className="w-12 h-12 text-orange-500/30" />
      </FloatingIcon>
      <FloatingIcon delay="animate-delay-4000" size="small">
        <Terminal className="w-8 h-8 text-orange-500/40" />
      </FloatingIcon>
      <FloatingIcon delay="animate-delay-5000" size="default">
        <Cpu className="w-6 h-6 text-orange-500/60" />
      </FloatingIcon>
      <FloatingIcon delay="animate-delay-6000" size="small">
        <Database className="w-7 h-7 text-orange-500/45" />
      </FloatingIcon>
      <FloatingIcon delay="animate-delay-7000" size="large">
        <Globe className="w-9 h-9 text-orange-500/35" />
      </FloatingIcon>
      <FloatingIcon delay="animate-delay-8000" size="default">
        <Cloud className="w-8 h-8 text-orange-500/55" />
      </FloatingIcon>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-2xl p-8 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-orange-600/20 rounded-full blur-3xl"></div>

          <div className="relative mb-8 text-center">
            <div className="relative">
              <div className="w-32 h-32 mx-auto mb-6 overflow-hidden rounded-full bg-gradient-to-r from-orange-500 to-orange-600 p-1">
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
            <h1 className="mb-2 text-4xl font-bold bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
              Hari-Krishna Patel
            </h1>
            <p className="text-gray-400 relative inline-block">
              <span className="relative z-10">Software Engineer & Developer</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500/0 via-orange-500/50 to-orange-500/0"></span>
            </p>
          </div>

          <div className="grid gap-4">
            <SocialLink icon={Mail} href="mailto:hari1880patel@gmail.com" label="Email" />
            <SocialLink icon={XIcon} href="https://x.com/hari_patell" label="X" />
            <SocialLink icon={Instagram} href="https://instagram.com/hari_patell" label="Instagram" />
            <SocialLink icon={Linkedin} href="https://www.linkedin.com/in/hari-krishna-patel" label="LinkedIn" />
            <SocialLink icon={Github} href="https://github.com/hari-patell" label="GitHub" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

