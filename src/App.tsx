import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/react'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Footer from './components/Footer'

// Below the fold and pulls in markdown rendering — load it in its own chunk
const ResumeChat = lazy(() => import('./components/ResumeChat'))
// Easter egg — only fetched the first time someone opens it
const Terminal = lazy(() => import('./components/Terminal'))

const sections = ['home', 'about', 'skills', 'experience', 'projects', 'AI']

function App() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false)
  // Keep the terminal mounted after first open so its scrollback survives closing
  const [terminalLoaded, setTerminalLoaded] = useState(false)

  const openTerminal = useCallback(() => {
    // Desktop-only easter egg; matches the md breakpoint that shows the nav icon
    if (!window.matchMedia('(min-width: 768px)').matches) return
    setTerminalLoaded(true)
    setIsTerminalOpen(true)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== '`' && e.key !== '~') return
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }
      e.preventDefault()
      openTerminal()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [openTerminal])

  return (
    <div className="relative min-h-screen w-full bg-cream-100 dark:bg-darkBg text-stone-900 dark:text-cream-100 font-sans overflow-x-hidden">
      <Navigation sections={sections} onOpenTerminal={openTerminal} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Suspense fallback={<section id="AI" className="min-h-screen" />}>
          <ResumeChat />
        </Suspense>
      </main>
      <Footer />
      {terminalLoaded && (
        <Suspense fallback={null}>
          <Terminal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
        </Suspense>
      )}
      <SpeedInsights />
      <Analytics />
    </div>
  )
}

export default App
