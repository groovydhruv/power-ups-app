import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState } from 'react';

interface ProgressData {
  xp: number;
  level: number;
  streak: number;
  lastCompletionDate: string | null;
}

const XP_PER_RESOURCE = 150;

export const [ProgressContext, useProgress] = createContextHook(() => {
  const [xp, setXp] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [streak, setStreak] = useState<number>(0);
  const [lastCompletionDate, setLastCompletionDate] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    console.log('Loading progress from AsyncStorage...');
    try {
      const stored = await AsyncStorage.getItem('user_progress');
      console.log('Stored progress:', stored);
      if (stored) {
        const data: ProgressData = JSON.parse(stored);
        setXp(data.xp);
        // Recalculate level based on completed topics
        const recalculatedLevel = await calculateLevel(data.xp);
        setLevel(recalculatedLevel);
        setStreak(data.streak);
        setLastCompletionDate(data.lastCompletionDate);
        console.log('Progress loaded:', data);
        console.log('Recalculated level:', recalculatedLevel);
      } else {
        console.log('No stored progress found');
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      console.log('Setting isLoaded to true');
      setIsLoaded(true);
    }
  };

  const saveProgress = async (newXp: number, newLevel: number, newStreak: number, newDate: string | null) => {
    try {
      const data: ProgressData = {
        xp: newXp,
        level: newLevel,
        streak: newStreak,
        lastCompletionDate: newDate,
      };
      await AsyncStorage.setItem('user_progress', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const calculateLevel = async (totalXp: number): Promise<number> => {
    // Level is based on completed topics, not XP
    // Check how many complete topics the user has finished
    try {
      const { THEMES } = await import('@/constants/powerups');
      let completedTopics = 0;
      
      for (const theme of THEMES) {
        let allResourcesCompleted = true;
        for (const resource of theme.resources) {
          const completed = await AsyncStorage.getItem(`resource_${resource.id}_completed`);
          if (completed !== 'true') {
            allResourcesCompleted = false;
            break;
          }
        }
        if (allResourcesCompleted) {
          completedTopics++;
        } else {
          break; // Stop at first incomplete topic
        }
      }
      
      return completedTopics + 1;
    } catch (error) {
      console.error('Error calculating level:', error);
      return 1;
    }
  };

  const calculateStreak = (lastDate: string | null): number => {
    if (!lastDate) return 1;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const last = new Date(lastDate);
    last.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - last.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return streak;
    } else if (diffDays === 1) {
      return streak + 1;
    } else {
      return 1;
    }
  };

  const addXp = async (amount: number) => {
    const newXp = xp + amount;
    const newLevel = await calculateLevel(newXp);
    const today = new Date().toISOString();
    const newStreak = calculateStreak(lastCompletionDate);

    setXp(newXp);
    setLevel(newLevel);
    setStreak(newStreak);
    setLastCompletionDate(today);

    await saveProgress(newXp, newLevel, newStreak, today);
  };

  const getCurrentTopicResourceCount = async (): Promise<number> => {
    try {
      const { THEMES } = await import('@/constants/powerups');
      const currentLevel = level;
      if (currentLevel > 0 && currentLevel <= THEMES.length) {
        return THEMES[currentLevel - 1].resources.length;
      }
      return 0;
    } catch (error) {
      console.error('Error getting topic resource count:', error);
      return 0;
    }
  };

  const getXpPerLevel = async (): Promise<number> => {
    const resourceCount = await getCurrentTopicResourceCount();
    return resourceCount * XP_PER_RESOURCE;
  };

  const getCurrentLevelXp = async (): Promise<number> => {
    try {
      const { THEMES } = await import('@/constants/powerups');
      const currentLevel = level;
      
      // Calculate total XP needed for all previous levels
      let totalXpForPreviousLevels = 0;
      for (let i = 0; i < currentLevel - 1; i++) {
        if (i < THEMES.length) {
          totalXpForPreviousLevels += THEMES[i].resources.length * XP_PER_RESOURCE;
        }
      }
      
      // Current level XP is total XP minus XP from previous levels
      return xp - totalXpForPreviousLevels;
    } catch (error) {
      console.error('Error calculating current level XP:', error);
      return 0;
    }
  };

  const getXpToNextLevel = async (): Promise<number> => {
    const xpPerLevel = await getXpPerLevel();
    const currentLevelXp = await getCurrentLevelXp();
    return xpPerLevel - currentLevelXp;
  };

  return {
    xp,
    level,
    streak,
    isLoaded,
    addXp,
    getCurrentLevelXp,
    getXpToNextLevel,
    getXpPerLevel,
  };
});
