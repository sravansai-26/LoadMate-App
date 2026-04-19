import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';

interface AvailabilityToggleProps {
  isAvailable: boolean;
  onToggle: () => void;
}

export default function AvailabilityToggle({ isAvailable, onToggle }: AvailabilityToggleProps) {
  const translateX = useRef(new Animated.Value(isAvailable ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: isAvailable ? 1 : 0,
      friction: 8,
      tension: 50,
      useNativeDriver: true,
    }).start();
  }, [isAvailable, translateX]);

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    
    onToggle();
  };

  const thumbTranslate = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 56],
  });

  const backgroundColorInterpolate = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.textTertiary, Colors.success],
  });

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleToggle}
        style={styles.container}
      >
        <Animated.View
          style={[
            styles.track,
            { backgroundColor: backgroundColorInterpolate },
          ]}
        >
          <Animated.View
            style={[
              styles.thumb,
              { transform: [{ translateX: thumbTranslate }] },
            ]}
          />
          <View style={styles.labels}>
            <Text style={[styles.label, !isAvailable && styles.activeLabel]}>OFF</Text>
            <Text style={[styles.label, isAvailable && styles.activeLabel]}>ON</Text>
          </View>
        </Animated.View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, isAvailable && styles.statusDotActive]} />
          <Text style={[styles.statusText, isAvailable && styles.statusTextActive]}>
            {isAvailable ? 'Available for trips' : 'Currently offline'}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
  },
  track: {
    width: 100,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  thumb: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  label: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: 'rgba(255,255,255,0.5)',
  },
  activeLabel: {
    color: '#fff',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textTertiary,
  },
  statusDotActive: {
    backgroundColor: Colors.success,
  },
  statusText: {
    fontSize: 14,
    color: Colors.textTertiary,
    fontWeight: '500' as const,
  },
  statusTextActive: {
    color: Colors.success,
  },
});
