import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState } from 'react';

interface ProgressData {
  xp: number;
  level: number;
  streak: number;
  lastCompletionDate: string | null;
}

const XP_PER_LEVEL = 100;
const XP_PER_COMPLETION = 25;

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
        setLevel(data.level);
        setStreak(data.streak);
        setLastCompletionDate(data.lastCompletionDate);
        console.log('Progress loaded:', data);
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

  const calculateLevel = (totalXp: number): number => {
    return Math.floor(totalXp / XP_PER_LEVEL) + 1;
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

  const addXp = (amount: number = XP_PER_COMPLETION) => {
    const newXp = xp + amount;
    const newLevel = calculateLevel(newXp);
    const today = new Date().toISOString();
    const newStreak = calculateStreak(lastCompletionDate);

    setXp(newXp);
    setLevel(newLevel);
    setStreak(newStreak);
    setLastCompletionDate(today);

    saveProgress(newXp, newLevel, newStreak, today);
  };

  const getCurrentLevelXp = (): number => {
    return xp % XP_PER_LEVEL;
  };

  const getXpToNextLevel = (): number => {
    return XP_PER_LEVEL - getCurrentLevelXp();
  };

  return {
    xp,
    level,
    streak,
    isLoaded,
    addXp,
    getCurrentLevelXp,
    getXpToNextLevel,
    XP_PER_LEVEL,
  };
});
