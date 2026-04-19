import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin, Package, Truck, Clock, IndianRupee } from 'lucide-react-native';
import { Image } from 'expo-image';
import Card from './Card';
import StatusBadge from './StatusBadge';
import Colors from '@/constants/colors';
import { Trip, VEHICLE_TYPES } from '@/types';
import { formatCurrency, formatDistance, formatDuration, formatDateTime } from '@/utils/helpers';

interface TripCardProps {
  trip: Trip;
  onPress?: () => void;
  showDriver?: boolean;
}

export default function TripCard({ trip, onPress, showDriver = true }: TripCardProps) {
  return (
    <Card variant="elevated" onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <StatusBadge status={trip.status} size="small" />
        <Text style={styles.date}>{formatDateTime(trip.createdAt)}</Text>
      </View>

      <View style={styles.route}>
        <View style={styles.locationRow}>
          <View style={[styles.dot, styles.pickupDot]} />
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>Pickup</Text>
            <Text style={styles.locationAddress} numberOfLines={1}>
              {trip.pickup.address}
            </Text>
          </View>
        </View>
        <View style={styles.routeLine} />
        <View style={styles.locationRow}>
          <View style={[styles.dot, styles.dropDot]} />
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>Drop</Text>
            <Text style={styles.locationAddress} numberOfLines={1}>
              {trip.drop.address}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Package size={16} color={Colors.textTertiary} />
          <Text style={styles.detailText}>{trip.goodsType}</Text>
        </View>
        <View style={styles.detailItem}>
          <MapPin size={16} color={Colors.textTertiary} />
          <Text style={styles.detailText}>{formatDistance(trip.distance)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Clock size={16} color={Colors.textTertiary} />
          <Text style={styles.detailText}>{formatDuration(trip.estimatedDuration)}</Text>
        </View>
      </View>

      {showDriver && trip.driver && (
        <>
          <View style={styles.divider} />
          <View style={styles.driverSection}>
            <Image
              source={{ uri: trip.driver.avatar }}
              style={styles.driverAvatar}
              contentFit="cover"
            />
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{trip.driver.name}</Text>
              <Text style={styles.vehicleInfo}>
                {trip.driver.vehicleNumber} • {VEHICLE_TYPES[trip.driver.vehicleType].name}
              </Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Total</Text>
              <Text style={styles.price}>{formatCurrency(trip.price)}</Text>
            </View>
          </View>
        </>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  date: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  route: {
    gap: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  pickupDot: {
    backgroundColor: Colors.accent,
  },
  dropDot: {
    backgroundColor: Colors.secondary,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: Colors.border,
    marginLeft: 5,
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 11,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  locationAddress: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  details: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  driverSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceSecondary,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  vehicleInfo: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 11,
    color: Colors.textTertiary,
  },
  price: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
});
