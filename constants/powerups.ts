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
    title: 'stay hungry, stay foolish',
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
    title: 'Theme 2: Master Your Craft',
    status: 'locked',
    resources: [
      {
        id: '4',
        title: 'Self-Discipline',
        description: 'Build habits that drive consistent action',
        isCompleted: false,
        content: {
          type: 'text',
          title: 'The Science of Self-Discipline',
          summary: 'Self-discipline is doing what needs to be done, even when you don\'t feel like it. Start small, remove temptations, and create systems that support your goals.'
        }
      },
      {
        id: '5',
        title: 'Emotional Intelligence',
        description: 'Understand and manage emotions effectively',
        isCompleted: false,
        content: {
          type: 'text',
          title: 'Mastering Emotional Intelligence',
          summary: 'EQ involves recognizing, understanding and managing your emotions and those of others. Practice self-awareness, empathy, and emotional regulation daily.'
        }
      },
      {
        id: '6',
        title: 'Creative Thinking',
        description: 'Unlock innovative solutions and new perspectives',
        isCompleted: false,
        content: {
          type: 'text',
          title: 'Developing Creative Thinking',
          summary: 'Creative thinking involves looking at problems from different angles and generating novel solutions. Practice divergent thinking, question assumptions, and combine ideas in unexpected ways.'
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
