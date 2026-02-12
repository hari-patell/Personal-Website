import { useState } from 'react'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import { projects } from '../data/projects'
import { Project } from '../types'
import { Github, ExternalLink, Code2 } from 'lucide-react'

export default function Projects() {
  const { ref, hasIntersected } = useIntersectionObserver()
  const [hoveredProject, setHoveredProject] = useState<string | null>(null)

  const featuredProjects = projects.filter((p) => p.featured)
  const otherProjects = projects.filter((p) => !p.featured)

  return (
    <section
      id="projects"
      ref={ref}
      aria-label="Projects section"
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
            Featured <span className="italic font-medium">Projects</span>
          </h2>
          <div className="serif-divider my-6"></div>
          <p className="text-stone-500 text-center mb-8 sm:mb-12 text-sm sm:text-base px-2">
            A selection of projects showcasing my skills and experience
          </p>

          {/* Featured Projects */}
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-12 sm:mb-16">
            {featuredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                isHovered={hoveredProject === project.id}
                onHover={() => setHoveredProject(project.id)}
                onLeave={() => setHoveredProject(null)}
                featured
              />
            ))}
          </div>

          {/* Other Projects */}
          {otherProjects.length > 0 && (
            <>
              <h3 className="font-serif text-2xl font-bold mb-6 text-stone-700">Other Projects</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index + featuredProjects.length}
                    isHovered={hoveredProject === project.id}
                    onHover={() => setHoveredProject(project.id)}
                    onLeave={() => setHoveredProject(null)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({
  project,
  index,
  isHovered,
  onHover,
  onLeave,
  featured = false,
}: {
  project: Project
  index: number
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
  featured?: boolean
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-white/60 border border-stone-200/60 transition-all duration-500 ${
        featured ? 'md:col-span-1' : ''
      } ${
        isHovered
          ? 'border-stone-300 shadow-md bg-white scale-[1.01]'
          : 'hover:border-stone-300 hover:shadow-sm hover:bg-white'
      }`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards',
      }}
    >
      <div className="relative p-6 sm:p-8 h-full flex flex-col">
        {/* Icon */}
        <div className="mb-5">
          <div className="w-12 h-12 rounded-xl bg-stone-900 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <Code2 className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Content */}
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-2 group-hover:text-stone-700 transition-colors">
          {project.title}
        </h3>
        <p className={`text-stone-500 mb-4 leading-relaxed ${featured ? 'text-base' : 'text-sm'}`}>
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4 flex-grow items-start">
          {project.technologies.slice(0, featured ? 6 : 4).map((tech) => (
            <span
              key={tech}
              className="px-2.5 py-0.5 text-xs rounded-md bg-cream-200/80 text-stone-600 border border-stone-200/40 transition-colors leading-tight inline-flex items-center h-5 font-medium"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > (featured ? 6 : 4) && (
            <span className="px-2.5 py-0.5 text-xs rounded-md bg-cream-200/80 text-stone-400 border border-stone-200/40 leading-tight inline-flex items-center h-5">
              +{project.technologies.length - (featured ? 6 : 4)}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-stone-200/60">
            {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} source code on GitHub`}
              className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 focus:ring-offset-cream-100 rounded"
            >
              <Github className="w-4 h-4" aria-hidden="true" />
              <span>Code</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} live demo`}
              className="flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2 focus:ring-offset-cream-100 rounded"
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              <span>Live</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
