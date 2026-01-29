import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import { experiences } from '../data/experience'
import type { Experience } from '../types'
import { Briefcase, MapPin, Calendar } from 'lucide-react'

export default function Experience() {
  const { ref, hasIntersected } = useIntersectionObserver()

  return (
    <section
      id="experience"
      ref={ref}
      aria-label="Experience section"
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
            Experience
          </h2>
          <p className="text-gray-400 text-center mb-12 text-sm sm:text-base">
            Professional experience and internships
          </p>

          <div className="space-y-8">
            {experiences.map((experience, index) => (
              <ExperienceCard key={experience.id} experience={experience} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ExperienceCard({ experience, index }: { experience: Experience; index: number }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-zinc-900/50 border backdrop-blur-sm transition-all duration-500 ${
        experience.incoming
          ? 'border-orange-500/40 shadow-lg shadow-orange-500/10 hover:border-orange-500/60 hover:shadow-xl hover:shadow-orange-500/15'
          : 'border-zinc-800/50 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10'
      }`}
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards',
      }}
    >
      {/* Incoming badge */}
      {experience.incoming && (
        <div className="absolute top-4 right-4 z-10">
          <div
            className="px-3 py-1.5 text-xs font-bold tracking-widest uppercase rounded-md bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 bg-[length:200%_100%] text-white animate-shimmer"
          >
            Incoming
          </div>
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-orange-500/0 group-hover:from-orange-500/10 group-hover:via-orange-500/5 group-hover:to-orange-500/10 transition-all duration-500" />

      <div className="relative p-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
            <div>
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">
                {experience.position}
              </h3>
              <div className="flex items-center gap-2 text-orange-500 font-semibold">
                <Briefcase className="w-4 h-4" />
                <span>{experience.company}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mt-3">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{experience.startDate} – {experience.endDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>{experience.location}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 mb-4 text-sm sm:text-base leading-relaxed">
          {experience.description}
        </p>

        {/* Achievements */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-400 mb-2">Key Achievements:</h4>
          <ul className="space-y-2">
            {experience.achievements.map((achievement, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-orange-500 mt-1.5">•</span>
                <span className="leading-relaxed">{achievement}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-zinc-800/50">
          {experience.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-xs rounded-md bg-zinc-800/50 text-gray-300 border border-zinc-700/50 group-hover:border-orange-500/30 transition-colors leading-tight inline-flex items-center h-5"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

