import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, Mic, Sparkles } from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { getResourceById } from '@/constants/powerups';
import { useProgress } from '@/contexts/ProgressContext';

interface Message {
  id: string;
  duration: number;
  isUser: boolean;
  timestamp: number;
  isPlaying?: boolean;
}

export default function ValidationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const resource = getResourceById(id);
  const { addXp } = useProgress();

  const [messages, setMessages] = useState<Message[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [showLevelUp, setShowLevelUp] = useState<boolean>(false);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const levelUpOpacity = useRef(new Animated.Value(0)).current;
  const levelUpScale = useRef(new Animated.Value(0.8)).current;
  const flatListRef = useRef<FlatList>(null);

  const handleComplete = useCallback(async () => {
    try {
      await AsyncStorage.setItem(`resource_${id}_completed`, 'true');
      addXp(25);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving completion:', error);
    }
  }, [id, addXp]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  useEffect(() => {
    if (showLevelUp) {
      Animated.parallel([
        Animated.timing(levelUpOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(levelUpScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        Animated.parallel([
          Animated.timing(levelUpOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(levelUpScale, {
            toValue: 1.2,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          handleComplete();
        });
      }, 2000);
    }
  }, [showLevelUp, levelUpOpacity, levelUpScale, handleComplete]);

  const handlePressIn = () => {
    setIsRecording(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Animated.spring(scaleAnim, {
      toValue: 1.1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsRecording(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    simulateVoiceMessage();
  };

  const simulateVoiceMessage = async () => {
    const userMessage: Message = {
      id: Date.now().toString(),
      duration: Math.floor(Math.random() * 30) + 10,
      isUser: true,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);

    await AsyncStorage.setItem(`validation_${id}_progress`, progress.toString());

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        duration: Math.floor(Math.random() * 45) + 15,
        isUser: false,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiResponse]);

      const newProgress = Math.min(progress + 25, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTimeout(() => {
          setShowLevelUp(true);
        }, 500);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }, 1000);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageRow, item.isUser && styles.messageRowUser]}>
      {!item.isUser && (
        <View
          style={[styles.messageAvatar, { backgroundColor: '#D4C5B0' }]}
        />
      )}
      <View
        style={[
          styles.voiceMessageBubble,
          item.isUser ? styles.userVoiceMessage : styles.aiVoiceMessage,
        ]}
      >
        <Pressable
          style={styles.playButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <View style={[styles.playIcon, item.isUser && styles.playIconUser]}>
            <View style={styles.playTriangle} />
          </View>
        </Pressable>
        <View style={styles.waveformContainer}>
          {Array.from({ length: 25 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.waveBar,
                item.isUser ? styles.waveBarUser : styles.waveBarAI,
                { height: Math.random() * 20 + 8 },
              ]}
            />
          ))}
        </View>
        <Text
          style={[
            styles.durationText,
            item.isUser ? styles.durationTextUser : styles.durationTextAI,
          ]}
        >
          {formatDuration(item.duration)}
        </Text>
      </View>
    </View>
  );

  if (!resource) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.headerWrapper}>
        <View style={styles.header}>
          <Pressable onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push('/(tabs)');
            }
          }} style={styles.backButton}>
            <ArrowLeft size={20} color={Colors.dark.text} />
          </Pressable>
          <View style={styles.headerCenter}>
            <View
              style={[styles.naviAvatar, { backgroundColor: '#D4C5B0' }]}
            />
            <View>
              <Text style={styles.headerTitle}>Navi</Text>
            </View>
          </View>
          <View style={{ width: 40 }} />
        </View>
        
        <View style={styles.resourceTitleContainer}>
          <Text style={styles.resourceTitle}>{resource.title}</Text>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Understanding</Text>
            <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<View style={styles.emptyState} />}
      />

      <View style={styles.inputContainer}>
        <Animated.View
          style={[styles.micButtonWrapper, { transform: [{ scale: scaleAnim }] }]}
        >
          <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[
              styles.micButton,
              {
                backgroundColor: isRecording ? Colors.dark.primary : Colors.dark.surface,
              },
            ]}
          >
            <Mic
              size={40}
              color={isRecording ? Colors.dark.background : Colors.dark.primary}
            />
          </Pressable>
        </Animated.View>
        {isRecording && <Text style={styles.recordingText}>Release to send</Text>}
      </View>

      {showLevelUp && (
        <Animated.View
          style={[
            styles.levelUpOverlay,
            {
              opacity: levelUpOpacity,
              transform: [{ scale: levelUpScale }],
            },
          ]}
        >
          <View style={styles.levelUpContent}>
            <Sparkles size={64} color={Colors.dark.success} />
            <Text style={styles.levelUpTitle}>Level Up!</Text>
            <Text style={styles.levelUpSubtitle}>
              You&apos;ve mastered {resource.title}
            </Text>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 8,
  },
  naviAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    fontFamily: 'Fustat_600SemiBold',
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.dark.textTertiary,
    fontFamily: 'Fustat_400Regular',
  },
  messagesContainer: {
    padding: 16,
    flexGrow: 1,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
    gap: 8,
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 60,
  },
  emptyAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    textAlign: 'center',
    fontFamily: 'Fustat_700Bold',
  },
  emptySubtext: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 32,
    fontFamily: 'Fustat_400Regular',
  },
  voiceMessageBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
    maxWidth: '75%',
  },
  userVoiceMessage: {
    backgroundColor: Colors.dark.primary,
    borderBottomRightRadius: 4,
  },
  aiVoiceMessage: {
    backgroundColor: Colors.dark.surface,
    borderBottomLeftRadius: 4,
  },
  playButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIconUser: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  playTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderLeftColor: '#FFFFFF',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 2,
  },
  waveformContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 28,
  },
  waveBar: {
    width: 2,
    borderRadius: 1,
  },
  waveBarUser: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  waveBarAI: {
    backgroundColor: Colors.dark.primary,
    opacity: 0.6,
  },
  durationText: {
    fontSize: 12,
    fontFamily: 'Fustat_400Regular',
  },
  durationTextUser: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  durationTextAI: {
    color: Colors.dark.textSecondary,
  },
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
  },
  micButtonWrapper: {
    alignItems: 'center',
  },
  micButton: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  recordingText: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    fontWeight: '500' as const,
    fontFamily: 'Fustat_600SemiBold',
  },
  levelUpOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 10, 15, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelUpContent: {
    alignItems: 'center',
    gap: 16,
  },
  levelUpTitle: {
    fontSize: 40,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    letterSpacing: -0.5,
    fontFamily: 'Fustat_700Bold',
  },
  levelUpSubtitle: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    letterSpacing: 0.2,
    fontFamily: 'Fustat_400Regular',
  },
  headerWrapper: {
    backgroundColor: Colors.dark.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  resourceTitleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  resourceTitle: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: Colors.dark.text,
    fontFamily: 'Fustat_500Medium',
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.dark.textSecondary,
    fontFamily: 'Fustat_600SemiBold',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.dark.primary,
    fontFamily: 'Fustat_700Bold',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: Colors.dark.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.dark.primary,
    borderRadius: 3,
  },
});
