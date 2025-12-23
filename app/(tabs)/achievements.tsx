import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';

export default function AchievementsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Achievements</Text>
      </View>

      <View style={styles.comingSoonContainer}>
        <Text style={styles.comingSoonText}>Coming Soon</Text>
        <Text style={styles.comingSoonSubtext}>
          Track your progress and unlock achievements
        </Text>
      </View>
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
  comingSoonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  comingSoonText: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.dark.text,
    letterSpacing: -0.5,
    fontFamily: 'Fustat_700Bold',
  },
  comingSoonSubtext: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'Fustat_400Regular',
  },
});
