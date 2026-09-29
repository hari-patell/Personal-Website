import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import { projects } from '../data/projects'
import { Project } from '../types'
import { ArrowUpRight } from 'lucide-react'
import SectionHeader from './SectionHeader'

export default function Projects() {
  const { ref, hasIntersected } = useIntersectionObserver()

  return (
    <section
      id="projects"
      ref={ref}
      aria-label="Projects section"
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
          <SectionHeader numeral="Δ" title="Projects" />

          <div className="grid md:grid-cols-2 gap-x-14 gap-y-16">
            {projects.map((project, index) => (
              <ProjectEntry key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const linkClasses =
  'inline-flex items-center gap-1 inscription text-stone-500 dark:text-cream-300 hover:text-aegean dark:hover:text-aegean-light transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-aegean'

function ProjectEntry({ project, index }: { project: Project; index: number }) {
  return (
    <article className="border-t border-stone-300/70 dark:border-stone-700 pt-6 flex flex-col">
      <span className="font-serif text-base [font-variant-numeric:lining-nums] text-stone-400 dark:text-cream-400 mb-3">
        {String(index + 1).padStart(2, '0')}
      </span>
      <h3 className="font-serif text-3xl font-medium text-stone-900 dark:text-cream-100 leading-tight mb-3">
        {project.title}
      </h3>
      <p className="text-stone-600 dark:text-cream-200 leading-relaxed font-light mb-5">
        {project.description}
      </p>
      <p className="text-xs text-stone-400 dark:text-cream-400 tracking-wide mb-6">
        {project.technologies.join('  ·  ')}
      </p>

      {(project.githubUrl || project.liveUrl) && (
        <div className="flex items-center gap-6 mt-auto">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} source code on GitHub`}
              className={linkClasses}
            >
              Code <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} live demo`}
              className={linkClasses}
            >
              Live <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          )}
        </div>
      )}
    </article>
  )
}
