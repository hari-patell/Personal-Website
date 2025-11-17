import { Experience } from '../types'

export const experiences: Experience[] = [
  {
    id: '1',
    company: 'Honeywell',
    position: 'Software Engineering Intern',
    location: 'Fort Mill, SC',
    startDate: 'Jun. 2025',
    endDate: 'Aug. 2025',
    description: 'Collaborated with senior engineers to optimize critical systems and enhance mobile applications.',
    achievements: [
      'Created optimized TSPL Parser, improving execution time from 4.5 seconds to 150ms for 1000 commands (96.67% improvement)',
      'Built comprehensive C++ testing framework with automated validation, catching 15+ edge cases and preventing production crashes',
      'Enhanced Print Set MC Android app by implementing hardware compatibility for 3 new printers, improving connection reliability and reducing setup confusion',
    ],
    technologies: ['C++', 'Android', 'Kotlin', 'Testing', 'Java'],
  },
]

