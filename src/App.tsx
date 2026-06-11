import { lazy, Suspense } from 'react'
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

const sections = ['home', 'about', 'skills', 'experience', 'projects', 'AI']

function App() {
  return (
    <div className="relative min-h-screen w-full bg-cream-100 dark:bg-darkBg text-stone-900 dark:text-cream-100 font-sans overflow-x-hidden">
      <Navigation sections={sections} />
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
      <SpeedInsights />
      <Analytics />
    </div>
  )
}

export default App
