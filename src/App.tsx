// Updated on March 7, 2025 to fix deployment issue
//Swami Shriji

import { useEffect } from 'react'
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
    // Clear any hash that might cause auto-scrolling
    if (window.location.hash && !window.location.hash.includes('?')) {
      // Only clear if it's not from GitHub Pages routing (which has ? in hash)
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
    
    // Force scroll to top immediately and after other effects
    window.scrollTo(0, 0)
    const timer = setTimeout(() => {
      window.scrollTo(0, 0)
    }, 10)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-black via-black to-zinc-900 text-white overflow-x-hidden">
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
    </div>
  )
}

export default App
