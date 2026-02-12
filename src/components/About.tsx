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
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold mb-2 text-center text-stone-900 tracking-tight">
            About <span className="italic font-medium">Me</span>
          </h2>
          <div className="serif-divider my-6"></div>
          <div className="grid md:grid-cols-2 gap-6 md:gap-10 mt-10 md:mt-14">
            <div className="space-y-5">
              <p className="text-stone-600 leading-relaxed text-base sm:text-lg">
                I'm a Software Engineering Intern at Honeywell with a passion for creating high-performance solutions.
                I've optimized systems achieving 96.67% performance improvements and built scalable applications
                serving 100+ teams. My expertise spans full-stack development, machine learning, and mobile applications.
              </p>
              <p className="text-stone-600 leading-relaxed text-base sm:text-lg">
                I thrive on solving complex problems through clean code and systematic optimization. Whether it's
                reducing execution time from 4.5 seconds to 150ms, achieving 94.2% accuracy with custom neural networks,
                or leading teams to build innovative solutions, I'm driven by measurable impact and continuous learning.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-5 rounded-xl bg-white/60 border border-stone-200/60 transition-all duration-300 hover:bg-white hover:shadow-sm hover:border-stone-300/60">
                <Code2 className="w-5 h-5 text-stone-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-serif font-semibold text-stone-900 mb-1">Clean Code</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    Writing maintainable, scalable, and well-documented code
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 rounded-xl bg-white/60 border border-stone-200/60 transition-all duration-300 hover:bg-white hover:shadow-sm hover:border-stone-300/60">
                <Rocket className="w-5 h-5 text-stone-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-serif font-semibold text-stone-900 mb-1">Performance</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    Optimizing applications for speed and efficiency
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 rounded-xl bg-white/60 border border-stone-200/60 transition-all duration-300 hover:bg-white hover:shadow-sm hover:border-stone-300/60">
                <Target className="w-5 h-5 text-stone-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-serif font-semibold text-stone-900 mb-1">Problem Solving</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    Breaking down complex challenges into manageable solutions
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5 rounded-xl bg-white/60 border border-stone-200/60 transition-all duration-300 hover:bg-white hover:shadow-sm hover:border-stone-300/60">
                <Heart className="w-5 h-5 text-stone-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-serif font-semibold text-stone-900 mb-1">Passion</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">
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
