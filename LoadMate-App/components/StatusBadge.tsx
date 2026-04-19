import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TRIP_STATUS_CONFIG, TripStatus } from '@/types';

interface StatusBadgeProps {
  status: TripStatus;
  size?: 'small' | 'medium';
}

export default function StatusBadge({ status, size = 'medium' }: StatusBadgeProps) {
  const config = TRIP_STATUS_CONFIG[status];
  
  return (
    <View
      style={[
        styles.badge,
        size === 'small' && styles.badgeSmall,
        { backgroundColor: config.color + '20' },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text
        style={[
          styles.text,
          size === 'small' && styles.textSmall,
          { color: config.color },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  badgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  text: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  textSmall: {
    fontSize: 11,
  },
});
