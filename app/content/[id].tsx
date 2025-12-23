import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, Stack, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { ArrowLeft, Play } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors from '@/constants/colors';
import { getResourceById } from '@/constants/powerups';

export default function ContentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const resource = getResourceById(id);
  const [hasStartedValidation, setHasStartedValidation] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const checkValidationStatus = useCallback(async () => {
    try {
      const progress = await AsyncStorage.getItem(`validation_${id}_progress`);
      const completed = await AsyncStorage.getItem(`resource_${id}_completed`);
      setHasStartedValidation(progress !== null && progress !== '0');
      setIsCompleted(completed === 'true');
    } catch (error) {
      console.error('Error checking validation status:', error);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      checkValidationStatus();
    }, [checkValidationStatus])
  );

  if (!resource) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push('/(tabs)');
            }
          }}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={Colors.dark.text} />
        </Pressable>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.badge} />
        <View 
          style={styles.iconCircle}
        >
          <Play size={40} color={Colors.dark.primary} fill={Colors.dark.primary} />
        </View>

        <View style={styles.content}>
          <Text style={styles.category}>{resource.description}</Text>
          <Text style={styles.title}>{resource.title}</Text>
          <Text style={styles.description}>{resource.content.summary}</Text>
        </View>
      </ScrollView>

      {!isCompleted && (
        <View style={styles.footer}>
          <Pressable
            style={styles.button}
            onPress={() => router.push(`/validation/${resource.id}` as any)}
          >
            <Text style={styles.buttonText}>
              {hasStartedValidation ? 'Continue Conversation' : 'Start Conversation'}
            </Text>
          </Pressable>
        </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: Colors.dark.surface,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  badge: {
    height: 4,
    width: 60,
    backgroundColor: Colors.dark.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 32,
    backgroundColor: Colors.dark.primary + '20',
    borderColor: Colors.dark.primary,
  },
  content: {
    gap: 12,
    marginBottom: 32,
  },
  category: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.dark.textTertiary,
    letterSpacing: 1.5,
    fontFamily: 'Fustat_700Bold',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.dark.text,
    letterSpacing: -0.5,
    fontFamily: 'Fustat_700Bold',
  },
  description: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    lineHeight: 24,
    fontFamily: 'Fustat_400Regular',
  },
  footer: {
    padding: 24,
  },
  button: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.success,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.dark.background,
    letterSpacing: 0.2,
    fontFamily: 'Fustat_700Bold',
  },
});
