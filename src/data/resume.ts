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

PERSONAL BACKGROUND:
Name: Hari-Krishna Patel
Role: Software Engineer & Developer
Location: Currently working in Fort Mill, SC (Honeywell)
Email: hari1880patel@gmail.com
LinkedIn: https://www.linkedin.com/in/hari-krishna-patel
GitHub: https://github.com/hari-patell
Twitter/X: https://x.com/hari_patell
Instagram: https://instagram.com/hari_patell

PROFESSIONAL SUMMARY:
I'm a Software Engineering Intern at Honeywell with a passion for creating high-performance solutions. I've optimized systems achieving 96.67% performance improvements and built scalable applications serving 100+ teams. My expertise spans full-stack development, machine learning, and mobile applications. I thrive on solving complex problems through clean code and systematic optimization. Whether it's reducing execution time from 4.5 seconds to 150ms, achieving 94.2% accuracy with custom neural networks, or leading teams to build innovative solutions, I'm driven by measurable impact and continuous learning.

CORE VALUES & WORK PHILOSOPHY:
- Clean Code: Writing maintainable, scalable, and well-documented code is a priority. I believe code should be readable and maintainable for future developers.
- Performance Optimization: I'm passionate about optimizing applications for speed and efficiency, always measuring impact with concrete metrics.
- Problem Solving: I excel at breaking down complex challenges into manageable solutions, approaching problems systematically.
- Passion for Technology: I have genuine enthusiasm for technology and continuous growth, always staying curious about new technologies and methodologies.
- Team Collaboration: I've successfully led teams (4-10 members) using tools like GitHub, Trello, and agile practices for feature planning, code reviews, and QA testing.
- Measurable Impact: I'm driven by quantifiable results - whether it's performance improvements, accuracy metrics, or user impact.

TECHNICAL EXPERTISE:
${skillsText}

EXPERIENCE:
${experienceText}

PROJECTS:
${projectsText}

KEY ACHIEVEMENTS & METRICS:
- Performance Optimization: Achieved 96.67% performance improvement (4.5 seconds to 150ms) on TSPL Parser optimization
- Machine Learning: Built neural network from scratch achieving 94.2% accuracy on MNIST dataset, reducing training time by 60%
- Scalability: Built applications serving 100+ teams with real-time data processing
- Team Leadership: Led teams of 4-10 members on complex projects with successful delivery
- Backend Optimization: Improved backend throughput by 30% and reduced page load time from 1.2s to 0.8s
- Quality Assurance: Created comprehensive testing frameworks catching 15+ edge cases and preventing production crashes
- Hardware Integration: Enhanced mobile apps with hardware compatibility for 3 new printers, improving reliability

TECHNICAL INTERESTS:
- Full-stack development with modern frameworks (React, React Native, Node.js)
- Machine learning and neural networks (implemented from scratch)
- Mobile application development (Android, React Native)
- System optimization and performance engineering
- Cloud infrastructure and DevOps (AWS, Docker)
- Database design and optimization (PostgreSQL, MongoDB)
- Real-time systems and data processing

CAREER FOCUS:
I'm passionate about building high-performance, scalable solutions that make a real impact. I enjoy working on challenging problems that require both technical depth and creative problem-solving. My goal is to continue growing as a software engineer while contributing to meaningful projects that push the boundaries of what's possible with technology.

HOBBIES & PERSONAL INTERESTS:
- Photography: I'm passionate about photography and currently use a Fujifilm XT-30 II camera to capture moments and explore creative expression through visual storytelling.
- Volunteering: I actively volunteer at BAPS charities, contributing to community service and humanitarian efforts.
- Tech & Startup Ecosystem: I stay up to date on the latest developments in the tech world as well as the San Francisco founder/startup ecosystem via X (Twitter), keeping informed about emerging technologies, startup trends, and industry insights.`;
}

