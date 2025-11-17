import { useState } from 'react'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import { skills } from '../data/skills'
import { Skill } from '../types'

const categoryColors = {
  frontend: 'from-blue-500 to-cyan-500',
  backend: 'from-green-500 to-emerald-500',
  database: 'from-purple-500 to-pink-500',
  tools: 'from-yellow-500 to-orange-500',
  cloud: 'from-indigo-500 to-purple-500',
}

const proficiencyColors = {
  beginner: 'bg-gray-600',
  intermediate: 'bg-blue-600',
  advanced: 'bg-green-600',
  expert: 'bg-orange-600',
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
            Skills & Technologies
          </h2>
          <p className="text-gray-400 text-center mb-8 sm:mb-12 text-sm sm:text-base">
            Technologies I work with and continue to learn
          </p>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setSelectedCategory(null)}
              aria-label="Show all skills"
              aria-pressed={selectedCategory === null}
              className={`px-4 py-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black ${
                selectedCategory === null
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50'
                  : 'bg-zinc-900/50 text-gray-400 hover:text-white hover:bg-zinc-800/50 border border-zinc-800/50'
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
                className={`px-4 py-2 rounded-lg transition-all duration-300 capitalize focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50'
                    : 'bg-zinc-900/50 text-gray-400 hover:text-white hover:bg-zinc-800/50 border border-zinc-800/50'
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
      className={`group relative p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm transition-all duration-300 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/20 hover:scale-105 cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${index * 50}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards',
      }}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${
            categoryColors[skill.category]
          } flex items-center justify-center text-white font-bold text-lg transition-transform duration-300 ${
            isHovered ? 'scale-110 rotate-6' : ''
          }`}
        >
          {skill.name.charAt(0)}
        </div>
        <div className="text-center">
          <h3 className="text-white font-semibold text-sm mb-1">{skill.name}</h3>
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
                      : 'bg-gray-700'
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

