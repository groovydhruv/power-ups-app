import { Award, Lock, Star, Target, TrendingUp } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { useProgress } from '@/contexts/ProgressContext';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'star' | 'target' | 'trending' | 'award';
  isUnlocked: boolean;
  progress?: number;
  goal?: number;
}

export default function AchievementsScreen() {
  const { level, streak, xp } = useProgress();

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first resource',
      icon: 'star',
      isUnlocked: xp >= 25,
    },
    {
      id: '2',
      title: 'Knowledge Seeker',
      description: 'Reach Level 5',
      icon: 'target',
      isUnlocked: level >= 5,
      progress: level,
      goal: 5,
    },
    {
      id: '3',
      title: 'On Fire',
      description: 'Maintain a 7-day streak',
      icon: 'trending',
      isUnlocked: streak >= 7,
      progress: streak,
      goal: 7,
    },
    {
      id: '4',
      title: 'Level Master',
      description: 'Reach Level 10',
      icon: 'award',
      isUnlocked: level >= 10,
      progress: level,
      goal: 10,
    },
    {
      id: '5',
      title: 'Consistency Champion',
      description: 'Maintain a 30-day streak',
      icon: 'trending',
      isUnlocked: streak >= 30,
      progress: streak,
      goal: 30,
    },
    {
      id: '6',
      title: 'Power Player',
      description: 'Reach Level 25',
      icon: 'award',
      isUnlocked: level >= 25,
      progress: level,
      goal: 25,
    },
  ];

  const renderIcon = (iconType: string, isUnlocked: boolean) => {
    const color = isUnlocked ? Colors.dark.primary : Colors.dark.locked;
    const size = 32;

    switch (iconType) {
      case 'star':
        return <Star size={size} color={color} fill={isUnlocked ? color : 'transparent'} />;
      case 'target':
        return <Target size={size} color={color} />;
      case 'trending':
        return <TrendingUp size={size} color={color} />;
      case 'award':
        return <Award size={size} color={color} fill={isUnlocked ? color : 'transparent'} />;
      default:
        return <Star size={size} color={color} />;
    }
  };

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Achievements</Text>
        <Text style={styles.headerSubtitle}>
          {unlockedCount} of {achievements.length} unlocked
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.achievementsGrid}>
          {achievements.map((achievement) => (
            <View
              key={achievement.id}
              style={[
                styles.achievementCard,
                !achievement.isUnlocked && styles.achievementCardLocked,
              ]}
            >
              <View style={styles.iconContainer}>
                {renderIcon(achievement.icon, achievement.isUnlocked)}
                {!achievement.isUnlocked && (
                  <View style={styles.lockOverlay}>
                    <Lock size={20} color={Colors.dark.locked} />
                  </View>
                )}
              </View>

              <Text
                style={[
                  styles.achievementTitle,
                  !achievement.isUnlocked && styles.achievementTitleLocked,
                ]}
              >
                {achievement.title}
              </Text>

              <Text
                style={[
                  styles.achievementDescription,
                  !achievement.isUnlocked && styles.achievementDescriptionLocked,
                ]}
              >
                {achievement.description}
              </Text>

              {!achievement.isUnlocked && achievement.progress !== undefined && achievement.goal !== undefined && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${(achievement.progress / achievement.goal) * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {achievement.progress}/{achievement.goal}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 4,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.dark.text,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    letterSpacing: 0.2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  achievementsGrid: {
    gap: 16,
  },
  achievementCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.dark.primary,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    gap: 12,
  },
  achievementCardLocked: {
    borderColor: Colors.dark.border,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    opacity: 0.7,
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: Colors.dark.surfaceLight,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.dark.text,
    letterSpacing: 0.2,
  },
  achievementTitleLocked: {
    color: Colors.dark.textTertiary,
  },
  achievementDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.dark.textSecondary,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  achievementDescriptionLocked: {
    color: Colors.dark.textTertiary,
  },
  progressContainer: {
    gap: 8,
    marginTop: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.dark.surfaceLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.dark.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
    letterSpacing: 0.2,
  },
});
