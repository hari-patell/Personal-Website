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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-gray-400 text-center mb-8 sm:mb-12 text-sm sm:text-base px-2">
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
              <h3 className="text-2xl font-bold mb-6 text-gray-300">Other Projects</h3>
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
      className={`group relative overflow-hidden rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm transition-all duration-500 ${
        featured ? 'md:col-span-1' : ''
      } ${
        isHovered
          ? 'border-orange-500/50 shadow-2xl shadow-orange-500/20 scale-[1.02]'
          : 'hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10'
      }`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        animationDelay: `${index * 100}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards',
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-orange-500/0 group-hover:from-orange-500/10 group-hover:via-orange-500/5 group-hover:to-orange-500/10 transition-all duration-500" />

      <div className="relative p-6 h-full flex flex-col">
        {/* Icon */}
        <div className="mb-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
            <Code2 className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
          {project.title}
        </h3>
        <p className={`text-gray-400 mb-4 ${featured ? 'text-base' : 'text-sm'}`}>
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4 flex-grow items-start">
          {project.technologies.slice(0, featured ? 6 : 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-xs rounded-md bg-zinc-800/50 text-gray-300 border border-zinc-700/50 group-hover:border-orange-500/30 transition-colors leading-tight inline-flex items-center h-5"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > (featured ? 6 : 4) && (
            <span className="px-2 py-0.5 text-xs rounded-md bg-zinc-800/50 text-gray-400 border border-zinc-700/50 leading-tight inline-flex items-center h-5">
              +{project.technologies.length - (featured ? 6 : 4)}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-zinc-800/50">
            {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} source code on GitHub`}
              className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-900 rounded"
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
              className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-zinc-900 rounded"
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

