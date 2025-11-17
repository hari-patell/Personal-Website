import { Project } from '../types'

export const projects: Project[] = [
  {
    id: '1',
    title: 'Yogi Cup Tournament Platform',
    description: 'Live tournament bracket and court queue system for 100 teams with real-time PostgreSQL data',
    longDescription: 'A comprehensive React Native mobile application featuring live tournament brackets for 100 teams, real-time court queue management for 6 courts using a custom TypeScript algorithm, and seamless PostgreSQL data integration. Built with Docker containerization and AWS hosting, utilizing Prisma for efficient database interactions. Collaborated with a 10-member team using GitHub and Trello for feature planning, code reviews, and QA testing.',
    technologies: ['React Native', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'TypeScript', 'Prisma'],
    githubUrl: 'https://github.com/hari-patell',
    featured: true,
  },
  {
    id: '2',
    title: 'NOSTYLIST Wardrobe Assistant',
    description: 'Personalized outfit recommendation engine with automated image processing for 500+ clothing items',
    longDescription: 'Led a team of 4 to build an intelligent wardrobe assistant featuring a personalized outfit recommendation engine using color-matching and contrast algorithms. Developed an automated Python image processing pipeline that categorizes and tags over 500 clothing items, eliminating manual data entry. Created a responsive React interface with drag-and-drop outfit builder and real-time preview. Optimized MongoDB queries and implemented caching layers, reducing page load time from 1.2s to 0.8s and improving backend throughput by 30%.',
    technologies: ['React', 'Python', 'Flask', 'MongoDB', 'TypeScript'],
    githubUrl: 'https://github.com/hari-patell',
    featured: true,
  },
  {
    id: '3',
    title: 'Neural Network from Scratch',
    description: 'Custom backpropagation implementation achieving 94.2% accuracy on MNIST dataset',
    longDescription: 'Implemented a complete neural network from scratch using only Python and NumPy, without any ML frameworks. Developed custom backpropagation algorithm and gradient descent optimization, achieving 94.2% accuracy on the MNIST dataset. Reduced training time by 60% through vectorized operations and mini-batch processing. Conducted systematic experimentation with activation functions and learning rates, documenting performance trade-offs in a detailed technical report.',
    technologies: ['Python', 'NumPy', 'Machine Learning'],
    githubUrl: 'https://github.com/hari-patell',
    featured: true,
  },
]

