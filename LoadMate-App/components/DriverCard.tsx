import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star, MapPin, Truck } from 'lucide-react-native';
import { Image } from 'expo-image';
import Card from './Card';
import Colors from '@/constants/colors';
import { Driver, VEHICLE_TYPES } from '@/types';
import { formatDistance } from '@/utils/helpers';

interface DriverCardProps {
  driver: Driver;
  distance?: number;
  onPress?: () => void;
  selected?: boolean;
}

export default function DriverCard({ driver, distance, onPress, selected }: DriverCardProps) {
  return (
    <Card
      variant={selected ? 'elevated' : 'outlined'}
      onPress={onPress}
      style={{ ...styles.card, ...(selected && styles.selectedCard) }}
    >
      <View style={styles.content}>
        <Image
          source={{ uri: driver.avatar }}
          style={styles.avatar}
          contentFit="cover"
        />
        <View style={styles.info}>
          <Text style={styles.name}>{driver.name}</Text>
          <View style={styles.vehicleRow}>
            <Truck size={14} color={Colors.textTertiary} />
            <Text style={styles.vehicle}>
              {VEHICLE_TYPES[driver.vehicleType].name} • {driver.vehicleNumber}
            </Text>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.rating}>
              <Star size={14} color={Colors.warning} fill={Colors.warning} />
              <Text style={styles.ratingText}>{driver.rating.toFixed(1)}</Text>
            </View>
            <Text style={styles.trips}>{driver.totalTrips} trips</Text>
            {distance !== undefined && (
              <>
                <View style={styles.separator} />
                <View style={styles.distanceRow}>
                  <MapPin size={12} color={Colors.accent} />
                  <Text style={styles.distance}>{formatDistance(distance)}</Text>
                </View>
              </>
            )}
          </View>
        </View>
        {driver.isAvailable && (
          <View style={styles.availableBadge}>
            <View style={styles.availableDot} />
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surfaceSecondary,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  vehicle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  trips: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  separator: {
    width: 1,
    height: 12,
    backgroundColor: Colors.border,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: '500' as const,
  },
  availableBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.successLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  availableDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.success,
  },
});
