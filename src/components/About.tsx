import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import SectionHeader from './SectionHeader'

export default function About() {
  const { ref, hasIntersected } = useIntersectionObserver()

  return (
    <section
      id="about"
      ref={ref}
      aria-label="About section"
      className="flex items-center justify-center py-28 sm:py-36 px-6 safe-area-top"
    >
      <div className="max-w-2xl w-full">
        <div
          className={`transition-all duration-1000 ${
            hasIntersected
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <SectionHeader title="About" />
          <div className="space-y-6 text-stone-600 dark:text-cream-200 leading-loose text-base sm:text-lg font-light">
            <p>
              I'm a Computer Science student at the University of Florida and a Software Development Intern at
              Amazon Web Services on the Applied AI team, with a passion for creating high-performance solutions.
              I've shipped production APIs serving 2.5M daily users at Capital One and optimized systems by 96.67% at Honeywell. My expertise spans full-stack development, machine learning, and mobile applications.
            </p>
            <p>
              I thrive on solving complex problems through clean code and systematic optimization. Whether it's
              reducing execution time from 4.5 seconds to 150ms, achieving 94.2% accuracy with custom neural networks,
              or leading teams to build innovative solutions, I'm driven by measurable impact and continuous learning.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
