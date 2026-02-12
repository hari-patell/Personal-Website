import { useState } from 'react'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import { skills } from '../data/skills'
import { Skill } from '../types'

const categoryColors = {
  frontend: 'from-stone-600 to-stone-500',
  backend: 'from-stone-700 to-stone-600',
  database: 'from-stone-500 to-stone-400',
  tools: 'from-stone-800 to-stone-700',
  cloud: 'from-stone-600 to-stone-500',
}

const proficiencyColors = {
  beginner: 'bg-stone-300',
  intermediate: 'bg-stone-400',
  advanced: 'bg-stone-600',
  expert: 'bg-stone-800',
}

export default function Skills() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { ref, hasIntersected } = useIntersectionObserver()

  const categories = Array.from(new Set(skills.map((s) => s.category)))
  const filteredSkills = selectedCategory
    ? skills.filter((s) => s.category === selectedCategory)
    : skills

  return (
    <section
      id="skills"
      ref={ref}
      aria-label="Skills section"
      className="min-h-screen flex items-center justify-center py-20 px-4 sm:px-6 safe-area-top"
    >
      <div className="max-w-6xl w-full">
        <div
          className={`transition-all duration-1000 ${
            hasIntersected
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold mb-2 text-center text-stone-900 tracking-tight">
            Skills & <span className="italic font-medium">Technologies</span>
          </h2>
          <div className="serif-divider my-6"></div>
          <p className="text-stone-500 text-center mb-8 sm:mb-12 text-sm sm:text-base">
            Technologies I work with and continue to learn
          </p>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => setSelectedCategory(null)}
              aria-label="Show all skills"
              aria-pressed={selectedCategory === null}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 focus:ring-offset-cream-100 ${
                selectedCategory === null
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-white/60 text-stone-500 hover:text-stone-800 hover:bg-white border border-stone-200/60'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                aria-label={`Filter skills by ${category}`}
                aria-pressed={selectedCategory === category}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 capitalize focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 focus:ring-offset-cream-100 ${
                  selectedCategory === category
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'bg-white/60 text-stone-500 hover:text-stone-800 hover:bg-white border border-stone-200/60'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredSkills.map((skill, index) => (
              <SkillCard key={skill.name} skill={skill} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="group relative p-4 rounded-xl bg-white/60 border border-stone-200/60 transition-all duration-300 hover:bg-white hover:border-stone-300 hover:shadow-sm cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${index * 50}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards',
      }}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className={`w-11 h-11 rounded-lg bg-gradient-to-br ${
            categoryColors[skill.category]
          } flex items-center justify-center text-white font-serif font-bold text-lg transition-transform duration-300 ${
            isHovered ? 'scale-110' : ''
          }`}
        >
          {skill.name.charAt(0)}
        </div>
        <div className="text-center">
          <h3 className="text-stone-800 font-medium text-sm mb-1.5">{skill.name}</h3>
          <div className="flex items-center gap-1 justify-center">
            {['beginner', 'intermediate', 'advanced', 'expert'].map((level, i) => {
              const levelIndex = ['beginner', 'intermediate', 'advanced', 'expert'].indexOf(
                skill.proficiency
              )
              return (
                <div
                  key={level}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i <= levelIndex
                      ? proficiencyColors[skill.proficiency as keyof typeof proficiencyColors]
                      : 'bg-stone-200'
                  }`}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
