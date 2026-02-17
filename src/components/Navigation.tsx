import { useEffect, useState } from 'react'
import { useScrollPosition } from '../hooks/useScrollPosition'
import { useTheme } from '../contexts/ThemeContext'
import { Menu, X, Moon, Sun } from 'lucide-react'

interface NavigationProps {
  sections: string[]
}

export default function Navigation({ sections }: NavigationProps) {
  const [activeSection, setActiveSection] = useState('home')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [clickedButton, setClickedButton] = useState<string | null>(null)
  const { isScrolled } = useScrollPosition()
  const { isDark, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [sections])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (
        isMobileMenuOpen &&
        !target.closest('nav') &&
        !target.closest('[role="navigation"]') &&
        !target.closest('[aria-label="Toggle mobile menu"]')
      ) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside)
      }, 100)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setIsMobileMenuOpen(false)
    }
  }

  const handleButtonClick = (sectionId: string) => {
    setClickedButton(sectionId)
    scrollToSection(sectionId)
    setTimeout(() => {
      setClickedButton(null)
    }, 600)
  }

  const handleKeyDown = (e: React.KeyboardEvent, sectionId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      scrollToSection(sectionId)
    }
  }

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-area-top ${
          isScrolled
            ? 'bg-cream-100/90 dark:bg-darkBg/95 backdrop-blur-xl border-b border-stone-200/60 dark:border-stone-700/60 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <span className="text-lg sm:text-xl font-serif font-bold text-stone-900 dark:text-cream-100 tracking-tight">
              Hari Patel
            </span>
            <div className="hidden md:flex items-center gap-1" role="menubar">
              {sections.map((section) => (
                <button
                  key={section}
                  onClick={() => handleButtonClick(section)}
                  onKeyDown={(e) => handleKeyDown(e, section)}
                  aria-label={`Navigate to ${section} section`}
                  aria-current={activeSection === section ? 'page' : undefined}
                  role="menuitem"
                  className={`px-3 py-2 text-sm font-medium transition-all duration-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 dark:focus-visible:ring-cream-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-100 dark:focus-visible:ring-offset-darkBg ${
                    clickedButton === section
                      ? 'ring-2 ring-stone-400 dark:ring-cream-400 ring-offset-2 ring-offset-cream-100 dark:ring-offset-darkBg animate-[fadeOut_0.6s_ease-out_forwards]'
                      : ''
                  } ${
                    activeSection === section
                      ? 'text-stone-900 dark:text-cream-100 bg-stone-900/5 dark:bg-cream-100/10'
                      : 'text-stone-500 dark:text-cream-200 hover:text-stone-900 dark:hover:text-cream-100 hover:bg-stone-900/5 dark:hover:bg-cream-100/10'
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={toggleTheme}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                className="p-2 rounded-lg text-stone-600 dark:text-cream-200 hover:text-stone-900 dark:hover:text-cream-100 hover:bg-stone-900/5 dark:hover:bg-cream-100/10 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-cream-400 focus:ring-offset-2 focus:ring-offset-cream-100 dark:focus:ring-offset-darkBg"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsMobileMenuOpen(!isMobileMenuOpen)
                }}
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
                className="md:hidden text-stone-700 dark:text-cream-200 hover:text-stone-900 dark:hover:text-cream-100 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-cream-400 focus:ring-offset-2 focus:ring-offset-cream-100 dark:focus:ring-offset-darkBg rounded p-2 z-50 relative"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      <div
        className={`fixed top-[64px] left-0 right-0 z-40 md:hidden transition-all duration-300 safe-area-top ${
          isMobileMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-cream-100/95 dark:bg-darkBg/98 backdrop-blur-xl border-b border-stone-200/60 dark:border-stone-700/60 shadow-sm">
          <div className="px-4 py-4 space-y-2">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => handleButtonClick(section)}
                onKeyDown={(e) => handleKeyDown(e, section)}
                aria-label={`Navigate to ${section} section`}
                className={`w-full text-left px-4 py-3 text-base font-medium transition-all duration-300 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 dark:focus-visible:ring-cream-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-100 dark:focus-visible:ring-offset-darkBg ${
                  clickedButton === section
                    ? 'ring-2 ring-stone-400 dark:ring-cream-400 ring-offset-2 ring-offset-cream-100 dark:ring-offset-darkBg animate-[fadeOut_0.6s_ease-out_forwards]'
                    : ''
                } ${
                  activeSection === section
                    ? 'text-stone-900 dark:text-cream-100 bg-stone-900/5 dark:bg-cream-100/10'
                    : 'text-stone-500 dark:text-cream-200 hover:text-stone-900 dark:hover:text-cream-100 hover:bg-stone-900/5 dark:hover:bg-cream-100/10'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
