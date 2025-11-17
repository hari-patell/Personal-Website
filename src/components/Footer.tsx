import { Github, Mail, Linkedin } from 'lucide-react'
import XIcon from './XIcon'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative py-12 px-6 border-t border-zinc-800/50 bg-black/20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-gray-400 text-sm">
            © {currentYear} Hari-Krishna Patel. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a
              href="mailto:hari1880patel@gmail.com"
              aria-label="Send email"
              className="text-gray-400 hover:text-orange-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black rounded"
            >
              <Mail className="w-5 h-5" aria-hidden="true" />
            </a>
            <a
              href="https://github.com/hari-patell"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit GitHub profile"
              className="text-gray-400 hover:text-orange-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black rounded"
            >
              <Github className="w-5 h-5" aria-hidden="true" />
            </a>
            <a
              href="https://www.linkedin.com/in/hari-krishna-patel"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit LinkedIn profile"
              className="text-gray-400 hover:text-orange-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black rounded"
            >
              <Linkedin className="w-5 h-5" aria-hidden="true" />
            </a>
            <a
              href="https://x.com/hari_patell"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit X profile"
              className="text-gray-400 hover:text-orange-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black rounded"
            >
              <XIcon className="w-5 h-5" aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="mt-6 text-center text-gray-500 text-xs">
          Built with React, TypeScript, and Tailwind CSS
        </div>
      </div>
    </footer>
  )
}

