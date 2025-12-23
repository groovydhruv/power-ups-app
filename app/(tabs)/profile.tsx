import AsyncStorage from '@react-native-async-storage/async-storage';
import { Award, Flame, LogOut, User, Zap } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { useProgress } from '@/contexts/ProgressContext';

export default function ProfileScreen() {
  const { level, xp, streak, getCurrentLevelXp, getXpToNextLevel, XP_PER_LEVEL } = useProgress();
  const [isResetting, setIsResetting] = useState(false);
  const [userName] = useState('User');

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            Alert.alert('Logged Out', 'You have been logged out successfully.');
          },
        },
      ]
    );
  }, []);

  const handleResetProgress = useCallback(() => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all your progress? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            setIsResetting(true);
            try {
              await AsyncStorage.clear();
              Alert.alert('Success', 'Your progress has been reset. Please restart the app.');
            } catch (error) {
              console.error('Error resetting progress:', error);
              Alert.alert('Error', 'Failed to reset progress');
            } finally {
              setIsResetting(false);
            }
          },
        },
      ]
    );
  }, []);

  const currentLevelXp = getCurrentLevelXp();
  const progressPercentage = (currentLevelXp / XP_PER_LEVEL) * 100;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSubtitle}>Your mindset journey</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <User size={32} color={Colors.dark.primary} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userName}</Text>
            <Text style={styles.userEmail}>user@example.com</Text>
          </View>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color={Colors.dark.textSecondary} />
          </Pressable>
        </View>

        <View style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <View style={styles.levelIconContainer}>
              <Zap size={36} color={Colors.dark.primary} fill={Colors.dark.primary} />
            </View>
            <View style={styles.levelInfo}>
              <Text style={styles.levelLabel}>Current Level</Text>
              <Text style={styles.levelValue}>Level {level}</Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressLabel}>Progress to Level {level + 1}</Text>
              <Text style={styles.progressValue}>
                {currentLevelXp} / {XP_PER_LEVEL} XP
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
            </View>
            <Text style={styles.xpRemaining}>{getXpToNextLevel()} XP to next level</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Flame size={28} color={Colors.dark.accent} fill={Colors.dark.accent} />
            </View>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Award size={28} color={Colors.dark.primary} />
            </View>
            <Text style={styles.statValue}>{xp}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
        </View>

        <Pressable
          style={styles.resetButton}
          onPress={handleResetProgress}
          disabled={isResetting}
        >
          <Text style={styles.resetButtonText}>
            {isResetting ? 'Resetting...' : 'Reset Progress'}
          </Text>
        </Pressable>
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
    fontFamily: 'Fustat_800ExtraBold',
  },
  headerSubtitle: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    letterSpacing: 0.2,
    fontFamily: 'Fustat_400Regular',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 20,
  },
  userCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    backgroundColor: Colors.dark.surfaceLight,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.dark.primary,
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.dark.text,
    letterSpacing: -0.3,
    fontFamily: 'Fustat_700Bold',
  },
  userEmail: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    letterSpacing: 0.2,
    fontFamily: 'Fustat_400Regular',
  },
  logoutButton: {
    width: 44,
    height: 44,
    backgroundColor: Colors.dark.surfaceLight,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: Colors.dark.primary,
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    gap: 20,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  levelIconContainer: {
    width: 72,
    height: 72,
    backgroundColor: Colors.dark.surfaceLight,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelInfo: {
    flex: 1,
    gap: 4,
  },
  levelLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
    letterSpacing: 0.3,
    fontFamily: 'Fustat_600SemiBold',
  },
  levelValue: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.dark.text,
    letterSpacing: -0.5,
    fontFamily: 'Fustat_800ExtraBold',
  },
  progressSection: {
    gap: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
    letterSpacing: 0.2,
    fontFamily: 'Fustat_600SemiBold',
  },
  progressValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.dark.text,
    letterSpacing: 0.2,
    fontFamily: 'Fustat_700Bold',
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: Colors.dark.surfaceLight,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.dark.primary,
    borderRadius: 5,
  },
  xpRemaining: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
    letterSpacing: 0.2,
    textAlign: 'center',
    fontFamily: 'Fustat_600SemiBold',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignItems: 'center',
    gap: 12,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    backgroundColor: Colors.dark.surfaceLight,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.dark.text,
    letterSpacing: -0.3,
    fontFamily: 'Fustat_800ExtraBold',
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
    letterSpacing: 0.2,
    fontFamily: 'Fustat_600SemiBold',
  },

  resetButton: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DC2626',
    alignItems: 'center',
    marginTop: 8,
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#DC2626',
    letterSpacing: 0.3,
    fontFamily: 'Fustat_700Bold',
  },
});
