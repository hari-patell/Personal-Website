import type { ComponentType } from 'react'

export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  imageUrl?: string
  featured?: boolean
}

export interface Skill {
  name: string
  category: 'frontend' | 'backend' | 'tools' | 'database' | 'cloud'
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  icon?: string
}

export interface SocialLink {
  icon: ComponentType<{ className?: string }>
  href: string
  label: string
}

export interface Experience {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  description: string
  achievements: string[]
  technologies: string[]
  incoming?: boolean
}
