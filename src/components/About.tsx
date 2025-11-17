import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import { Code2, Rocket, Target, Heart } from 'lucide-react'

export default function About() {
  const { ref, hasIntersected } = useIntersectionObserver()

  return (
    <section
      id="about"
      ref={ref}
      aria-label="About section"
      className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 safe-area-top"
    >
      <div className="max-w-4xl w-full">
        <div
          className={`transition-all duration-1000 ${
            hasIntersected
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-center bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
            About Me
          </h2>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mt-8 md:mt-12">
            <div className="space-y-4 md:space-y-6">
              <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                I'm a Software Engineering Intern at Honeywell with a passion for creating high-performance solutions.
                I've optimized systems achieving 96.67% performance improvements and built scalable applications
                serving 100+ teams. My expertise spans full-stack development, machine learning, and mobile applications.
              </p>
              <p className="text-gray-300 leading-relaxed text-base sm:text-lg">
                I thrive on solving complex problems through clean code and systematic optimization. Whether it's
                reducing execution time from 4.5 seconds to 150ms, achieving 94.2% accuracy with custom neural networks,
                or leading teams to build innovative solutions, I'm driven by measurable impact and continuous learning.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                <Code2 className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white mb-1">Clean Code</h3>
                  <p className="text-gray-400 text-sm">
                    Writing maintainable, scalable, and well-documented code
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                <Rocket className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white mb-1">Performance</h3>
                  <p className="text-gray-400 text-sm">
                    Optimizing applications for speed and efficiency
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                <Target className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white mb-1">Problem Solving</h3>
                  <p className="text-gray-400 text-sm">
                    Breaking down complex challenges into manageable solutions
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                <Heart className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white mb-1">Passion</h3>
                  <p className="text-gray-400 text-sm">
                    Genuine enthusiasm for technology and continuous growth
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

