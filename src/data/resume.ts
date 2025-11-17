// Combined resume data for AI context
import { experiences } from './experience';
import { projects } from './projects';
import { skills } from './skills';

export function getResumeContext(): string {
  const experienceText = experiences.map(exp => 
    `Position: ${exp.position} at ${exp.company} (${exp.location}), ${exp.startDate} - ${exp.endDate}. ${exp.description}. Achievements: ${exp.achievements.join('. ')}. Technologies: ${exp.technologies.join(', ')}.`
  ).join('\n\n');

  const projectsText = projects.map(proj => 
    `Project: ${proj.title}. Description: ${proj.longDescription}. Technologies: ${proj.technologies.join(', ')}.`
  ).join('\n\n');

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(`${skill.name} (${skill.proficiency})`);
    return acc;
  }, {} as Record<string, string[]>);

  const skillsText = Object.entries(skillsByCategory).map(([category, skillList]) => 
    `${category}: ${skillList.join(', ')}`
  ).join('\n');

  return `Resume Information:

EXPERIENCE:
${experienceText}

PROJECTS:
${projectsText}

SKILLS:
${skillsText}

ABOUT:
I'm a Software Engineering Intern at Honeywell with a passion for creating high-performance solutions. I've optimized systems achieving 96.67% performance improvements and built scalable applications serving 100+ teams. My expertise spans full-stack development, machine learning, and mobile applications. I thrive on solving complex problems through clean code and systematic optimization. Whether it's reducing execution time from 4.5 seconds to 150ms, achieving 94.2% accuracy with custom neural networks, or leading teams to build innovative solutions, I'm driven by measurable impact and continuous learning.`;
}

