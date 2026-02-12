// Updated on March 7, 2025 to fix deployment issue
//Swami Shriji

import { useEffect } from 'react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/react'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Footer from './components/Footer'
import ResumeChat from './components/ResumeChat'

const sections = ['home', 'about', 'skills', 'experience', 'projects', 'AI']

function App() {
  useEffect(() => {
    // Ensure page starts at the top on initial load
    // Ensure page starts at the top on initial load
    if (window.location.hash) {
      // Standard hash handling if needed, or just remove the specific GH pages check
    }

    // Force scroll to top immediately and after other effects
    window.scrollTo(0, 0)
    const timer = setTimeout(() => {
      window.scrollTo(0, 0)
    }, 10)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative min-h-screen w-full bg-cream-100 text-stone-900 font-sans overflow-x-hidden">
      <Navigation sections={sections} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <ResumeChat />
      </main>
      <Footer />
      <SpeedInsights />
      <Analytics />
    </div>
  )
}

export default App
