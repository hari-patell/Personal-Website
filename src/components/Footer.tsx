import { Github, Mail, Linkedin } from 'lucide-react'
import XIcon from './XIcon'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative py-12 px-6 border-t border-stone-200/60">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-stone-500 text-sm">
            &copy; {currentYear} Hari-Krishna Patel. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a
              href="mailto:hari1880patel@gmail.com"
              aria-label="Send email"
              className="text-stone-400 hover:text-stone-700 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 focus:ring-offset-cream-100 rounded"
            >
              <Mail className="w-5 h-5" aria-hidden="true" />
            </a>
            <a
              href="https://github.com/hari-patell"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit GitHub profile"
              className="text-stone-400 hover:text-stone-700 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 focus:ring-offset-cream-100 rounded"
            >
              <Github className="w-5 h-5" aria-hidden="true" />
            </a>
            <a
              href="https://www.linkedin.com/in/hari-krishna-patel"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit LinkedIn profile"
              className="text-stone-400 hover:text-stone-700 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 focus:ring-offset-cream-100 rounded"
            >
              <Linkedin className="w-5 h-5" aria-hidden="true" />
            </a>
            <a
              href="https://x.com/hari_patell"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit X profile"
              className="text-stone-400 hover:text-stone-700 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 focus:ring-offset-cream-100 rounded"
            >
              <XIcon className="w-5 h-5" aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="mt-6 text-center text-stone-400 text-xs font-light">
          Built with React, TypeScript, and Tailwind CSS
        </div>
      </div>
    </footer>
  )
}
