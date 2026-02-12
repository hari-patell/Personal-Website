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
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold mb-2 text-center text-stone-900 tracking-tight">
            <span className="italic font-medium">Experience</span>
          </h2>
          <div className="serif-divider my-6"></div>
          <p className="text-stone-500 text-center mb-12 text-sm sm:text-base">
            Professional experience and internships
          </p>

          <div className="space-y-6">
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
      className={`group relative overflow-hidden rounded-2xl bg-white/60 border backdrop-blur-sm transition-all duration-500 ${
        experience.incoming
          ? 'border-stone-400/50 shadow-sm hover:shadow-md hover:border-stone-400/70'
          : 'border-stone-200/60 hover:border-stone-300 hover:shadow-sm hover:bg-white'
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
            className="px-3 py-1.5 text-xs font-semibold tracking-widest uppercase rounded-md bg-stone-900 text-white"
          >
            Incoming
          </div>
        </div>
      )}

      <div className="relative p-6 sm:p-8">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-1 group-hover:text-stone-700 transition-colors">
                {experience.position}
              </h3>
              <div className="flex items-center gap-2 text-stone-600 font-medium">
                <Briefcase className="w-4 h-4 text-stone-400" />
                <span>{experience.company}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500 mt-3">
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
        <p className="text-stone-600 mb-4 text-sm sm:text-base leading-relaxed">
          {experience.description}
        </p>

        {/* Achievements */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-stone-500 mb-2 uppercase tracking-wider">Key Achievements</h4>
          <ul className="space-y-2">
            {experience.achievements.map((achievement, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-stone-600">
                <span className="text-stone-400 mt-1.5 text-xs">&#9679;</span>
                <span className="leading-relaxed">{achievement}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-stone-200/60">
          {experience.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-0.5 text-xs rounded-md bg-cream-200/80 text-stone-600 border border-stone-200/40 transition-colors leading-tight inline-flex items-center h-5 font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
