import { Github, Mail, Linkedin } from 'lucide-react'
import XIcon from './XIcon'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative py-12 px-6 border-t border-stone-200/60 dark:border-stone-700/60">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-stone-500 dark:text-cream-200 text-sm">
            &copy; {currentYear} Hari-Krishna Patel. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a
              href="mailto:hari1880patel@gmail.com"
              aria-label="Send email"
              className="text-stone-400 dark:text-cream-300 hover:text-stone-700 dark:hover:text-cream-100 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-cream-400 focus:ring-offset-2 focus:ring-offset-cream-100 dark:focus:ring-offset-darkBg rounded"
            >
              <Mail className="w-5 h-5" aria-hidden="true" />
            </a>
            <a
              href="https://github.com/hari-patell"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit GitHub profile"
              className="text-stone-400 dark:text-cream-300 hover:text-stone-700 dark:hover:text-cream-100 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-cream-400 focus:ring-offset-2 focus:ring-offset-cream-100 dark:focus:ring-offset-darkBg rounded"
            >
              <Github className="w-5 h-5" aria-hidden="true" />
            </a>
            <a
              href="https://www.linkedin.com/in/hari-krishna-patel"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit LinkedIn profile"
              className="text-stone-400 dark:text-cream-300 hover:text-stone-700 dark:hover:text-cream-100 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-cream-400 focus:ring-offset-2 focus:ring-offset-cream-100 dark:focus:ring-offset-darkBg rounded"
            >
              <Linkedin className="w-5 h-5" aria-hidden="true" />
            </a>
            <a
              href="https://x.com/hari_patell"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit X profile"
              className="text-stone-400 dark:text-cream-300 hover:text-stone-700 dark:hover:text-cream-100 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-cream-400 focus:ring-offset-2 focus:ring-offset-cream-100 dark:focus:ring-offset-darkBg rounded"
            >
              <XIcon className="w-5 h-5" aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="mt-6 text-center text-stone-400 dark:text-cream-300/80 text-xs font-light">
          Built with React, TypeScript, and Tailwind CSS
        </div>
      </div>
    </footer>
  )
}
