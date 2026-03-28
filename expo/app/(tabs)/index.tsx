import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { CheckCircle2, Flame, Headphones, Lock, Play, Zap, Circle } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { THEMES, Resource, Theme } from '@/constants/powerups';
import { useProgress } from '@/contexts/ProgressContext';

export default function HomeScreen() {
  const [completedResources, setCompletedResources] = useState<Set<string>>(new Set());
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const { level, getCurrentLevelXp, getXpPerLevel, streak, isLoaded } = useProgress();
  const [currentLevelXp, setCurrentLevelXp] = useState<number>(0);
  const [xpPerLevel, setXpPerLevel] = useState<number>(0);

  const loadCompletedResources = useCallback(async () => {
    const completed = new Set<string>();
    for (const theme of THEMES) {
      for (const resource of theme.resources) {
        try {
          const value = await AsyncStorage.getItem(`resource_${resource.id}_completed`);
          if (value === 'true') {
            completed.add(resource.id);
          }
        } catch (error) {
          console.error('Error loading completion status:', error);
        }
      }
    }
    setCompletedResources(completed);
  }, []);

  const isThemeUnlocked = (theme: Theme, themeIndex: number): boolean => {
    if (themeIndex === 0) return true;
    
    const previousTheme = THEMES[themeIndex - 1];
    const allPreviousCompleted = previousTheme.resources.every(r => 
      completedResources.has(r.id)
    );
    
    return allPreviousCompleted;
  };

  useFocusEffect(
    useCallback(() => {
      loadCompletedResources();
    }, [loadCompletedResources])
  );

  useEffect(() => {
    const loadXpData = async () => {
      const levelXp = await getCurrentLevelXp();
      const totalXpForLevel = await getXpPerLevel();
      setCurrentLevelXp(levelXp);
      setXpPerLevel(totalXpForLevel);
    };

    if (isLoaded) {
      loadXpData();
    }
  }, [level, isLoaded, getCurrentLevelXp, getXpPerLevel]);

  const getResourceStatus = (theme: Theme, resource: Resource, resourceIndex: number, themeIndex: number) => {
    if (!isThemeUnlocked(theme, themeIndex)) {
      return 'locked';
    }
    
    if (completedResources.has(resource.id)) {
      return 'completed';
    }
    
    const allPreviousCompleted = theme.resources
      .slice(0, resourceIndex)
      .every(r => completedResources.has(r.id));
    
    if (allPreviousCompleted) {
      return 'in-progress';
    }
    
    return 'locked';
  };

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const ResourceNode = ({ 
    resource, 
    theme, 
    index,
    resourceIndex,
    themeIndex
  }: { 
    resource: Resource; 
    theme: Theme;
    index: number;
    resourceIndex: number;
    themeIndex: number;
  }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          delay: index * 80,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          delay: index * 80,
          useNativeDriver: true,
        }),
      ]).start();
    }, [fadeAnim, scaleAnim, index]);

    const status = getResourceStatus(theme, resource, resourceIndex, themeIndex);
    const isInProgress = status === 'in-progress';

    useEffect(() => {
      if (isInProgress) {
        const pulse = Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.05,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        );
        pulse.start();
        return () => pulse.stop();
      }
    }, [isInProgress, pulseAnim]);

    const handlePress = () => {
      if (status === 'locked') {
        triggerShake();
      } else if (status === 'in-progress' || status === 'completed') {
        router.push(`/content/${resource.id}` as any);
      }
    };

    return (
      <Animated.View
        style={[
          styles.nodeWrapper,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { scale: isInProgress ? pulseAnim : 1 }
            ],
          },
        ]}
      >
        <Pressable
          onPress={handlePress}
          style={[
            styles.resourceCard,
            status === 'locked' && styles.resourceCardLocked,
            status === 'completed' && styles.resourceCardCompleted,
            status === 'in-progress' && styles.resourceCardInProgress,
          ]}
        >
          {resource.thumbnail && status !== 'locked' ? (
            <View style={styles.thumbnailContainer}>
              <Image 
                source={{ uri: resource.thumbnail }} 
                style={styles.thumbnail}
              />
              {status === 'completed' && (
                <View style={styles.completedOverlay}>
                  <CheckCircle2 size={32} color={Colors.dark.success} strokeWidth={3} />
                </View>
              )}
              {status === 'in-progress' && (
                <View style={styles.inProgressOverlay}>
                  <View style={styles.inProgressBadge}>
                    <Circle size={8} color={Colors.dark.primary} fill={Colors.dark.primary} />
                    <Text style={styles.inProgressText}>IN PROGRESS</Text>
                  </View>
                </View>
              )}
            </View>
          ) : (
            <View style={[styles.thumbnailContainer, styles.thumbnailPlaceholder]}>
              {status === 'locked' ? (
                <Lock size={32} color={Colors.dark.locked} strokeWidth={2.5} />
              ) : (
                <Play size={32} color={Colors.dark.primary} strokeWidth={2.5} />
              )}
            </View>
          )}
          
          <View style={styles.resourceInfo}>
            <Text 
              style={[
                styles.resourceTitle,
                status === 'locked' && styles.resourceTitleLocked
              ]}
              numberOfLines={2}
            >
              {resource.title}
            </Text>
            
            <View style={styles.metaRow}>
              {resource.description.includes('watch') ? (
                <Play size={14} color={status === 'locked' ? Colors.dark.textTertiary : Colors.dark.textSecondary} />
              ) : (
                <Headphones size={14} color={status === 'locked' ? Colors.dark.textTertiary : Colors.dark.textSecondary} />
              )}
              <Text style={[
                styles.resourceMeta,
                status === 'locked' && styles.resourceMetaLocked
              ]}>
                {resource.description}
              </Text>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  const ThemeSection = ({ theme, startIndex, themeIndex }: { theme: Theme; startIndex: number; themeIndex: number }) => {
    const isUnlocked = isThemeUnlocked(theme, themeIndex);
    
    return (
      <View style={styles.themeSection}>
        <View style={[
          styles.themeHeader,
          !isUnlocked && styles.themeHeaderLocked
        ]}>
          <Text style={[
            styles.themeTitle,
            !isUnlocked && styles.themeTitleLocked
          ]}>
            {theme.title}
          </Text>
        </View>

        <View style={styles.resourcesContainer}>
          {theme.resources.map((resource, index) => (
            <View key={resource.id} style={styles.resourceWrapper}>
              {index < theme.resources.length - 1 && (
                <View style={[
                  styles.dashedLine,
                  !isUnlocked && styles.dashedLineLocked
                ]} />
              )}
              <ResourceNode 
                resource={resource} 
                theme={theme}
                index={startIndex + index}
                resourceIndex={index}
                themeIndex={themeIndex}
              />
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Power-ups</Text>
          <Text style={styles.headerSubtitle}>Level up your mindset</Text>
        </View>
        
        {isLoaded && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Zap size={18} color={Colors.dark.primary} fill={Colors.dark.primary} />
              <View style={styles.statTextContainer}>
                <Text style={styles.statValue}>Level {level}</Text>
                <Text style={styles.statLabel}>{currentLevelXp}/{xpPerLevel} XP</Text>
              </View>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <Flame size={18} color={Colors.dark.accent} fill={Colors.dark.accent} />
              <View style={styles.statTextContainer}>
                <Text style={styles.statValue}>{streak}</Text>
                <Text style={styles.statLabel}>day streak</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.path, { transform: [{ translateX: shakeAnim }] }]}>
          {THEMES.map((theme, themeIndex) => {
            const startIndex = THEMES.slice(0, themeIndex).reduce(
              (sum, t) => sum + t.resources.length, 
              0
            );
            return (
              <ThemeSection 
                key={theme.id} 
                theme={theme} 
                startIndex={startIndex}
                themeIndex={themeIndex}
              />
            );
          })}
        </Animated.View>
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
    gap: 16,
  },
  headerTextContainer: {
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
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  statTextContainer: {
    gap: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark.text,
    letterSpacing: 0.2,
    fontFamily: 'Fustat_700Bold',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
    letterSpacing: 0.2,
    fontFamily: 'Fustat_600SemiBold',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.dark.border,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  path: {
    paddingVertical: 20,
  },
  themeSection: {
    marginBottom: 60,
  },
  themeHeader: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignSelf: 'center',
    marginBottom: 48,
    borderWidth: 1.5,
    borderColor: Colors.dark.border,
  },
  themeHeaderLocked: {
    borderColor: Colors.dark.border,
    opacity: 0.5,
  },
  themeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
    letterSpacing: 1,
    textTransform: 'lowercase' as const,
    fontFamily: 'Fustat_600SemiBold',
  },
  themeTitleLocked: {
    color: Colors.dark.textTertiary,
  },
  resourcesContainer: {
    alignItems: 'center',
    gap: 0,
  },
  resourceWrapper: {
    alignItems: 'center',
    position: 'relative',
  },
  dashedLine: {
    width: 4,
    height: 56,
    backgroundColor: 'transparent',
    borderLeftWidth: 4,
    borderLeftColor: Colors.dark.primary,
    borderStyle: 'dashed',
    marginVertical: 4,
    opacity: 0.5,
  },
  dashedLineLocked: {
    borderLeftColor: Colors.dark.border,
    opacity: 0.3,
  },
  nodeWrapper: {
    width: '100%',
    marginBottom: 16,
  },
  resourceCard: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.dark.primary,
    overflow: 'hidden',
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  resourceCardLocked: {
    borderColor: Colors.dark.border,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    opacity: 0.7,
  },
  resourceCardCompleted: {
    borderColor: Colors.dark.success,
    shadowColor: Colors.dark.success,
  },
  resourceCardInProgress: {
    borderColor: Colors.dark.primary,
    shadowColor: Colors.dark.primary,
    shadowOpacity: 0.4,
  },
  thumbnailContainer: {
    width: 120,
    height: 120,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    backgroundColor: Colors.dark.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inProgressOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 8,
  },
  inProgressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  inProgressText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.dark.primary,
    letterSpacing: 0.5,
    fontFamily: 'Fustat_700Bold',
  },
  resourceInfo: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    gap: 8,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark.text,
    lineHeight: 22,
    letterSpacing: 0.1,
    fontFamily: 'Fustat_700Bold',
  },
  resourceTitleLocked: {
    color: Colors.dark.textTertiary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resourceMeta: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
    letterSpacing: 0.2,
    fontFamily: 'Fustat_600SemiBold',
  },
  resourceMetaLocked: {
    color: Colors.dark.textTertiary,
  },
});
