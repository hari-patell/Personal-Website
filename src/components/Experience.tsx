import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import { experiences } from '../data/experience'
import type { Experience } from '../types'
import SectionHeader from './SectionHeader'

export default function Experience() {
  const { ref, hasIntersected } = useIntersectionObserver()

  return (
    <section
      id="experience"
      ref={ref}
      aria-label="Experience section"
      className="flex items-center justify-center py-28 sm:py-36 px-6 safe-area-top"
    >
      <div className="max-w-4xl w-full">
        <div
          className={`transition-all duration-1000 ${
            hasIntersected
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <SectionHeader title="Experience" />

          <ol className="border-b border-stone-300/70 dark:border-stone-700">
            {experiences.map((experience) => (
              <ExperienceRow key={experience.id} experience={experience} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function ExperienceRow({ experience }: { experience: Experience }) {
  const status = experience.current ? 'Current' : experience.incoming ? 'Incoming' : null

  return (
    <li className="grid md:grid-cols-[13rem_1fr] gap-x-10 gap-y-3 border-t border-stone-300/70 dark:border-stone-700 py-10 sm:py-12">
      <div className="inscription text-stone-400 dark:text-cream-400 leading-relaxed md:pt-2">
        <div>{experience.startDate} – {experience.endDate}</div>
        <div className="mt-1 normal-case tracking-normal text-xs font-light">{experience.location}</div>
        {status && <div className="mt-3 text-aegean dark:text-aegean-light">{status}</div>}
      </div>

      <div>
        <h3 className="font-serif text-3xl font-medium text-stone-900 dark:text-cream-100 leading-tight">
          {experience.company}
        </h3>
        <p className="mt-1 text-stone-500 dark:text-cream-300 italic font-serif text-lg">{experience.position}</p>

        <ul className="mt-6 space-y-3">
          {experience.achievements.map((achievement, idx) => (
            <li key={idx} className="flex gap-3 text-sm sm:text-[0.95rem] text-stone-600 dark:text-cream-200 leading-relaxed font-light">
              <span aria-hidden="true" className="text-stone-300 dark:text-stone-600">—</span>
              <span>{achievement}</span>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-xs text-stone-400 dark:text-cream-400 tracking-wide">
          {experience.technologies.join('  ·  ')}
        </p>
      </div>
    </li>
  )
}
