import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import { skills } from '../data/skills'
import type { Skill } from '../types'
import SectionHeader from './SectionHeader'

const categoryOrder: { key: Skill['category']; label: string }[] = [
  { key: 'backend', label: 'Backend' },
  { key: 'frontend', label: 'Frontend' },
  { key: 'database', label: 'Data' },
  { key: 'cloud', label: 'Cloud' },
  { key: 'tools', label: 'Tools' },
]

export default function Skills() {
  const { ref, hasIntersected } = useIntersectionObserver()

  return (
    <section
      id="skills"
      ref={ref}
      aria-label="Skills section"
      className="flex items-center justify-center py-28 sm:py-36 px-6 safe-area-top"
    >
      <div className="max-w-5xl w-full">
        <div
          className={`transition-all duration-1000 ${
            hasIntersected
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <SectionHeader title="Skills" />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-12">
            {categoryOrder.map(({ key, label }) => (
              <div key={key} className="border-t border-stone-300/70 dark:border-stone-700 pt-5">
                <h3 className="inscription text-stone-400 dark:text-cream-400 mb-5">{label}</h3>
                <ul className="space-y-2.5">
                  {skills
                    .filter((s) => s.category === key)
                    .map((skill) => (
                      <li key={skill.name} className="font-serif text-xl text-stone-800 dark:text-cream-100">
                        {skill.name}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
