// Updated on March 7, 2025 to fix deployment issue
//Swami Shriji

import Navigation from './components/Navigation'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Footer from './components/Footer'
import ResumeChat from './components/ResumeChat'

const sections = ['home', 'about', 'skills', 'experience', 'projects']

function App() {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-black via-black to-zinc-900 text-white overflow-x-hidden">
      <Navigation sections={sections} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
      </main>
      <Footer />
      <ResumeChat />
    </div>
  )
}

export default App
