import { Github, Mail, Linkedin } from 'lucide-react'
import XIcon from './XIcon'

// Fixed square hit area with the icon centered — the global mobile 44px
// min-size rule would otherwise leave the icon pinned to the box's left edge
const linkClasses =
  'inline-flex items-center justify-center w-11 h-11 text-stone-400 dark:text-cream-400 hover:text-aegean dark:hover:text-aegean-light transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-aegean'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative pt-16 pb-12 px-6">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-8">
        <div className="serif-divider"></div>
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <a href="mailto:hari1880patel@gmail.com" aria-label="Send email" className={linkClasses}>
            <Mail className="w-4 h-4" aria-hidden="true" />
          </a>
          <a href="https://github.com/hari-patell" target="_blank" rel="noopener noreferrer" aria-label="Visit GitHub profile" className={linkClasses}>
            <Github className="w-4 h-4" aria-hidden="true" />
          </a>
          <a href="https://www.linkedin.com/in/hari-krishna-patel" target="_blank" rel="noopener noreferrer" aria-label="Visit LinkedIn profile" className={linkClasses}>
            <Linkedin className="w-4 h-4" aria-hidden="true" />
          </a>
          <a href="https://x.com/hari_patell" target="_blank" rel="noopener noreferrer" aria-label="Visit X profile" className={linkClasses}>
            <XIcon className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
        <p className="inscription text-center -mr-[0.28em] text-stone-400 dark:text-cream-400">
          &copy; {currentYear} Hari-Krishna Patel
        </p>
      </div>
    </footer>
  )
}
