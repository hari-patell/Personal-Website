import { Experience } from '../types'

export const experiences: Experience[] = [
  {
    id: '3',
    company: 'Amazon Web Services',
    position: 'Software Development Intern',
    current: true,
    location: 'Bellevue, WA',
    startDate: 'Sep. 2026',
    endDate: 'Nov. 2026',
    description: 'Software Development Intern on the Applied AI team, building infrastructure to evaluate and benchmark AI agents.',
    achievements: [
      'Building an agent evaluation platform that combines 4 evaluation methodologies into a proprietary scoring framework for measuring AI agent performance across multiple internal agent platforms',
      'Developing an MCP server and evaluation API supporting expensive, multi-hour evaluation workloads with reliable execution and lifecycle management to prevent orphaned runs',
      'Collaborating directly with an Applied AI Scientist to translate evaluation research into reusable infrastructure for benchmarking and comparing agent behavior across heterogeneous systems',
    ],
    technologies: ['AI Agents', 'MCP', 'LLM Evaluation', 'AWS', 'APIs'],
  },
  {
    id: '2',
    company: 'Capital One',
    position: 'Software Engineering Intern',
    location: 'McLean, VA',
    startDate: 'Jun. 2026',
    endDate: 'Aug. 2026',
    description: 'Built a production backend endpoint for a Capital One mobile surface serving 2.5M daily users.',
    achievements: [
      'Shipped a production TypeScript/AWS Lambda endpoint for a Capital One mobile surface serving 2.5M daily users, collapsing 12 months of paginated transaction data into a single response across three derived views',
      'Engineered a subscription-cadence detector classifying weekly-to-annual recurring charges via gap-tolerance banding; resolved precision and tie-break bugs producing false price-change signals',
      'Owned the API contract with the server-driven UI team to eliminate client-side transformation; deployed via AWS CDK with ~3,200 lines of unit, Pact contract, and E2E tests',
    ],
    technologies: ['TypeScript', 'AWS Lambda', 'AWS CDK', 'Pact', 'E2E Testing'],
  },
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

