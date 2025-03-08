// Updated on March 7, 2025 to fix deployment issue
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
  position,
}: { 
  children: React.ReactNode; 
  delay: string; 
  size?: "small" | "default" | "large";
  position?: { top?: string; left?: string; right?: string; bottom?: string; };
}) {
  // Define consistent square sizes
  const sizeDimensions = {
    small: "48px",
    default: "56px",
    large: "64px",
  }

  // Define padding based on size
  const paddingClasses = {
    small: "p-2.5",
    default: "p-3",
    large: "p-3.5",
  }

  // Extract delay number for positioning if no position is provided
  const delayNum = delay.match(/\d+/)?.[0] || "0";
  const delayInt = parseInt(delayNum, 10);
  
  // Create more random positions based on the delay number
  // Use different prime numbers for more varied distribution
  const defaultPosition = position ? position : {
    left: `${(delayInt * 13 + 7) % 85 + Math.floor((delayInt * 17) % 10)}%`,
    top: `${(delayInt * 17 + 3) % 80 + Math.floor((delayInt * 13) % 15)}%`,
  };

  // Determine which animation to use based on the delay number
  const animationClass = `animate-float-${(delayInt % 3) + 1}`;
  
  // Add slight random rotation
  const rotation = (delayInt * 7) % 10 - 5; // Between -5 and 5 degrees

  return (
    <div
      className={`absolute ${animationClass} backdrop-blur-sm bg-zinc-900/30 rounded-2xl border border-zinc-800/30 z-0 flex items-center justify-center`}
      style={{ 
        ...defaultPosition,
        width: sizeDimensions[size],
        height: sizeDimensions[size],
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <div className={`flex items-center justify-center w-full h-full ${paddingClasses[size]}`}>
        {children}
      </div>
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


//these are the links
function SocialLink({ icon: Icon, href, label }: { icon: React.ElementType; href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-4 py-2.5 transition-all duration-300 rounded-xl backdrop-blur-md bg-black/5 hover:bg-black/10 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20 group"
    >
      <Icon className="w-5 h-5 text-orange-500 transition-transform duration-300 group-hover:rotate-12" />
      <span className="relative overflow-hidden text-white">
        <CipherText text={label} />
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-orange-300 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
      </span>
    </a>
  )
}

function App() {
  return (
    <div className="relative min-h-screen w-screen bg-gradient-to-br from-black via-black to-zinc-900 text-white overflow-hidden">
      {/* Animated Background Grid - Full screen */}
      <div className="fixed inset-0 w-screen h-screen bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      
      {/* Gradient Overlay - Dramatic circular spotlight effect */}
      <div className="fixed inset-0 w-screen h-screen bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0)_15%,rgba(0,0,0,0.3)_30%,rgba(0,0,0,0.7)_50%,rgba(0,0,0,0.9)_70%,rgba(0,0,0,1)_85%)] pointer-events-none"></div>

      {/* Floating Icons Container - positioned to fill the entire viewport */}
      <div className="fixed inset-0 w-screen h-screen overflow-visible pointer-events-none">
        {/* Floating Background Elements - with varied positions */}
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
        
        {/* Additional icons for wider screens - hidden on smaller screens */}
        <div className="hidden xl:block">
          <FloatingIcon delay="animate-delay-9000" size="large" position={{ top: "33%", left: "42%" }}>
            <Binary className="w-8 h-8 text-orange-500/70" />
          </FloatingIcon>
          <FloatingIcon delay="animate-delay-10000" size="default" position={{ top: "52%", left: "22%" }}>
            <Code2 className="w-7 h-7 text-orange-500/90" />
          </FloatingIcon>
        </div>
      </div>

      {/* Main Content - centered with max width for wider screens */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full p-8">
        {/* Glass effect enhancement - monochromatic blur elements */}
        <div className="fixed top-0 left-0 w-screen h-screen bg-gradient-to-tr from-zinc-900/20 via-black/10 to-zinc-800/20 blur-3xl opacity-50 pointer-events-none"></div>
        <div className="fixed bottom-0 right-0 w-screen h-screen bg-gradient-to-bl from-zinc-800/20 via-black/10 to-zinc-900/20 blur-3xl opacity-50 pointer-events-none"></div>
        
        <div className="w-full max-w-md p-8 rounded-3xl backdrop-blur-xl bg-black/5 border border-zinc-800/50 shadow-2xl shadow-orange-500/5 relative overflow-hidden z-20">
          {/* Decorative Elements */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-orange-600/20 rounded-full blur-3xl"></div>

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
            <h1 className="mb-2 text-3xl font-bold bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
              Hari-Krishna Patel
            </h1>
            <p className="text-sm text-gray-400 relative inline-block">
              <span className="relative z-10">Software Engineer & Developer</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500/0 via-orange-500/50 to-orange-500/0"></span>
            </p>
          </div>

          <div className="grid gap-3">
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

