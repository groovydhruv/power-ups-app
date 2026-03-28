export interface Resource {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  thumbnail?: string;
  content: {
    type: 'text' | 'video';
    title: string;
    summary: string;
  };
}

export interface Theme {
  id: string;
  title: string;
  status: 'unlocked' | 'locked';
  resources: Resource[];
}

export const THEMES: Theme[] = [
  {
    id: 'theme-1',
    title: 'Stay hungry, stay foolish.',
    status: 'unlocked',
    resources: [
      {
        id: '1',
        title: "Steve Jobs' 2005 Stanford Commencement Address",
        description: 'watch, 15 min',
        isCompleted: false,
        thumbnail: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop',
        content: {
          type: 'video',
          title: "Steve Jobs' 2005 Stanford Commencement Address",
          summary: 'In this iconic speech, Steve Jobs shares three stories from his life about connecting the dots, love and loss, and death. His message about following your heart and intuition has inspired millions to pursue their passions and stay curious.'
        }
      },
      {
        id: '2',
        title: 'The Knowledge Project: The Angel Philosopher',
        description: 'listen, 120m',
        isCompleted: false,
        thumbnail: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=300&fit=crop',
        content: {
          type: 'text',
          title: 'The Knowledge Project: The Angel Philosopher',
          summary: 'Naval Ravikant shares his philosophy on wealth creation, happiness, and living a meaningful life. This deep conversation explores timeless wisdom about decision-making, mental models, and building a life of freedom and fulfillment.'
        }
      }
    ]
  },
  {
    id: 'theme-2',
    title: 'The unexamined life is not worth living.',
    status: 'locked',
    resources: [
      {
        id: '3',
        title: 'The Real Meaning of Life',
        description: 'watch, 12 min',
        isCompleted: false,
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
        content: {
          type: 'video',
          title: 'The Real Meaning of Life',
          summary: 'A philosophical exploration of what gives life meaning and purpose. This video examines different perspectives on the meaning of life and how we can find fulfillment through self-examination and conscious living.'
        }
      },
      {
        id: '4',
        title: 'Mark Manson: Self-Knowledge',
        description: 'read, 120 min',
        isCompleted: false,
        thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
        content: {
          type: 'text',
          title: 'Mark Manson: Self-Knowledge',
          summary: 'An in-depth article exploring the importance of knowing yourself. Mark Manson discusses how self-knowledge is the foundation for making better decisions, building healthier relationships, and living a more authentic life.'
        }
      },
      {
        id: '5',
        title: 'Mark Manson: Self-Awareness',
        description: 'read, 30 min',
        isCompleted: false,
        thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop',
        content: {
          type: 'text',
          title: 'Mark Manson: Self-Awareness',
          summary: 'Practical insights on developing self-awareness in daily life. This article explores how being conscious of your thoughts, emotions, and behaviors can lead to personal growth and better life outcomes.'
        }
      },
      {
        id: '6',
        title: 'Aristotle: Happiness and Eudaimonia',
        description: 'read, 15 min',
        isCompleted: false,
        thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
        content: {
          type: 'text',
          title: 'Aristotle: Happiness and Eudaimonia',
          summary: 'An exploration of Aristotle\'s concept of eudaimonia - human flourishing and the good life. Learn how ancient philosophy can guide us toward lasting happiness through virtue and purpose-driven living.'
        }
      }
    ]
  },
  {
    id: 'theme-3',
    title: 'Changing the default settings.',
    status: 'locked',
    resources: [
      {
        id: '7',
        title: 'Life Optimizer: Being Intentional',
        description: 'read, 3 min',
        isCompleted: false,
        thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop',
        content: {
          type: 'text',
          title: 'Life Optimizer: Being Intentional',
          summary: 'A practical guide to living with intention. Learn how to make conscious choices about how you spend your time, energy, and attention instead of defaulting to automatic behaviors.'
        }
      },
      {
        id: '8',
        title: 'The Subtle Art of Not Giving a F*ck - Summary',
        description: 'watch, 8 min',
        isCompleted: false,
        thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop',
        content: {
          type: 'video',
          title: 'The Subtle Art of Not Giving a F*ck - Summary',
          summary: 'A concise summary of Mark Manson\'s bestselling book. Discover why choosing what to care about is the key to a good life, and how to stop wasting energy on things that don\'t matter.'
        }
      },
      {
        id: '9',
        title: 'Why you should define your fears instead of your goals, Tim Ferriss',
        description: 'watch, 13 min',
        isCompleted: false,
        thumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop',
        content: {
          type: 'video',
          title: 'Why you should define your fears instead of your goals',
          summary: 'Tim Ferriss shares his "fear-setting" exercise - a practical framework for overcoming paralysis and making tough decisions by clearly defining and addressing your fears.'
        }
      },
      {
        id: '10',
        title: 'The Dunning-Kruger Effect',
        description: 'watch, 14 min',
        isCompleted: false,
        thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop',
        content: {
          type: 'video',
          title: 'The Dunning-Kruger Effect',
          summary: 'Understanding cognitive bias and self-awareness. Learn why we often overestimate our abilities and how recognizing this effect can help you grow and make better decisions.'
        }
      },
      {
        id: '11',
        title: '19 Great Truths My Grandmother Told Me',
        description: 'read, 10 min',
        isCompleted: false,
        thumbnail: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&h=300&fit=crop',
        content: {
          type: 'text',
          title: '19 Great Truths My Grandmother Told Me',
          summary: 'Timeless wisdom passed down through generations. Simple yet profound life lessons about happiness, relationships, resilience, and living authentically.'
        }
      }
    ]
  },
  {
    id: 'theme-4',
    title: 'Get shit done.',
    status: 'locked',
    resources: [
      {
        id: '12',
        title: 'Tim Urban: Inside the mind of a master procrastinator',
        description: 'watch, 14 min',
        isCompleted: false,
        thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
        content: {
          type: 'video',
          title: 'Tim Urban: Inside the mind of a master procrastinator',
          summary: 'A hilarious and insightful TED talk exploring why we procrastinate and how the "Instant Gratification Monkey" hijacks our decision-making. Tim Urban shares his personal struggles and offers perspective on overcoming procrastination.'
        }
      },
      {
        id: '13',
        title: 'Timeboxing: Elon Musk\'s Time Management Method',
        description: 'watch, 12 min',
        isCompleted: false,
        thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
        content: {
          type: 'video',
          title: 'Timeboxing: Elon Musk\'s Time Management Method',
          summary: 'Learn how one of the world\'s most productive entrepreneurs manages his time. Discover the timeboxing technique that helps Elon Musk run multiple companies and why scheduling every minute can maximize your productivity.'
        }
      },
      {
        id: '14',
        title: 'The Eisenhower matrix: How to manage your tasks',
        description: 'watch, 2 min',
        isCompleted: false,
        thumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop',
        content: {
          type: 'video',
          title: 'The Eisenhower matrix: How to manage your tasks',
          summary: 'A simple yet powerful framework for prioritizing tasks based on urgency and importance. Learn to distinguish between what\'s urgent and what\'s important to focus on what truly matters.'
        }
      },
      {
        id: '15',
        title: 'Tiny Changes, Remarkable Results - Atomic Habits by James Clear',
        description: 'watch, 11 min',
        isCompleted: false,
        thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop',
        content: {
          type: 'video',
          title: 'Tiny Changes, Remarkable Results - Atomic Habits',
          summary: 'A summary of James Clear\'s bestselling book on habit formation. Discover how small changes compound over time and learn practical strategies for building good habits and breaking bad ones.'
        }
      },
      {
        id: '16',
        title: 'The Truth About Hard Work, Kapil and Naval',
        description: 'read, 10 min',
        isCompleted: false,
        thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
        content: {
          type: 'text',
          title: 'The Truth About Hard Work, Kapil and Naval',
          summary: 'A conversation between Kapil Gupta and Naval Ravikant on the nature of hard work, productivity, and achievement. Explore a counterintuitive perspective on effort and success.'
        }
      },
      {
        id: '17',
        title: 'Social Media is Hacking You',
        description: 'watch, 15 min',
        isCompleted: false,
        thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
        content: {
          type: 'video',
          title: 'Social Media is Hacking You',
          summary: 'Understanding how social media platforms are designed to capture your attention and time. Learn about the psychology behind endless scrolling and how to reclaim control of your focus and productivity.'
        }
      }
    ]
  }
];

export function getAllResources(): Resource[] {
  return THEMES.flatMap(theme => theme.resources);
}

export function getResourceById(id: string): Resource | undefined {
  return getAllResources().find(resource => resource.id === id);
}

export const AI_RESPONSES = [
  "That's an interesting perspective! Can you explain how you would apply this concept in a real-world scenario?",
  "I see you're engaging with the material. What do you think is the most challenging aspect of implementing this mindset?",
  "Great insight! How does this relate to your personal experiences or goals?",
  "That shows good understanding. Can you describe a specific situation where this power-up would be valuable?",
  "Excellent! You're demonstrating strong comprehension of these concepts."
];
