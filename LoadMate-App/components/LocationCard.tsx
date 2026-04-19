import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapPin, Navigation, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Location } from '@/types';

interface LocationCardProps {
  location: Location;
  type: 'pickup' | 'drop';
  onPress?: () => void;
  editable?: boolean;
}

export default function LocationCard({ location, type, onPress, editable = false }: LocationCardProps) {
  const isPickup = type === 'pickup';
  const iconColor = isPickup ? Colors.accent : Colors.secondary;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={!editable}
      activeOpacity={editable ? 0.7 : 1}
    >
      <View style={[styles.iconContainer, { backgroundColor: iconColor + '15' }]}>
        {isPickup ? (
          <Navigation size={20} color={iconColor} />
        ) : (
          <MapPin size={20} color={iconColor} />
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>{isPickup ? 'PICKUP' : 'DROP'}</Text>
        <Text style={styles.address} numberOfLines={2}>
          {location.address}
        </Text>
        {location.landmark && (
          <Text style={styles.landmark}>Near {location.landmark}</Text>
        )}
      </View>
      {editable && (
        <ChevronRight size={20} color={Colors.textTertiary} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.textTertiary,
    letterSpacing: 1,
    marginBottom: 2,
  },
  address: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.text,
    lineHeight: 20,
  },
  landmark: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
});
