import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MapPin, Package, Clock, IndianRupee, Navigation } from 'lucide-react-native';
import { Button } from './Button';
import Colors from '@/constants/colors';
import { Trip } from '@/types';
import { formatCurrency, formatDistance, formatDuration } from '@/utils/helpers';

interface TripRequestCardProps {
  trip: Trip;
  onAccept: () => void;
  onReject: () => void;
  timeLeft?: number;
}

export default function TripRequestCard({ trip, onAccept, onReject, timeLeft = 30 }: TripRequestCardProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.02, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    pulse.start();

    Animated.timing(progressAnim, {
      toValue: 0,
      duration: timeLeft * 1000,
      useNativeDriver: false,
    }).start();

    return () => pulse.stop();
  }, [pulseAnim, progressAnim, timeLeft]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: pulseAnim }] }]}>
      <View style={styles.header}>
        <Text style={styles.title}>New Trip Request</Text>
        <View style={styles.timer}>
          <Clock size={14} color={Colors.warning} />
          <Text style={styles.timerText}>{timeLeft}s</Text>
        </View>
      </View>

      <View style={styles.progressBar}>
        <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
      </View>

      <View style={styles.priceSection}>
        <Text style={styles.priceLabel}>Estimated Earning</Text>
        <Text style={styles.price}>{formatCurrency(trip.price * 0.85)}</Text>
      </View>

      <View style={styles.route}>
        <View style={styles.locationRow}>
          <View style={[styles.dot, styles.pickupDot]} />
          <View style={styles.locationContent}>
            <Text style={styles.locationLabel}>PICKUP</Text>
            <Text style={styles.locationAddress} numberOfLines={2}>{trip.pickup.address}</Text>
          </View>
        </View>
        <View style={styles.routeLine} />
        <View style={styles.locationRow}>
          <View style={[styles.dot, styles.dropDot]} />
          <View style={styles.locationContent}>
            <Text style={styles.locationLabel}>DROP</Text>
            <Text style={styles.locationAddress} numberOfLines={2}>{trip.drop.address}</Text>
          </View>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Package size={16} color={Colors.textTertiary} />
          <Text style={styles.detailText}>{trip.goodsType}</Text>
        </View>
        <View style={styles.detailItem}>
          <Navigation size={16} color={Colors.textTertiary} />
          <Text style={styles.detailText}>{formatDistance(trip.distance)}</Text>
        </View>
        <View style={styles.detailItem}>
          <Clock size={16} color={Colors.textTertiary} />
          <Text style={styles.detailText}>{formatDuration(trip.estimatedDuration)}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          title="Reject"
          onPress={onReject}
          variant="outline"
          style={styles.rejectButton}
        />
        <Button
          title="Accept Trip"
          onPress={onAccept}
          style={styles.acceptButton}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    margin: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.warningLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  timerText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.warning,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.secondary,
    borderRadius: 2,
  },
  priceSection: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 16,
    backgroundColor: Colors.primary + '10',
    borderRadius: 12,
  },
  priceLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  price: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  route: {
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  pickupDot: {
    backgroundColor: Colors.accent,
  },
  dropDot: {
    backgroundColor: Colors.secondary,
  },
  routeLine: {
    width: 2,
    height: 24,
    backgroundColor: Colors.border,
    marginLeft: 5,
    marginVertical: 4,
  },
  locationContent: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.textTertiary,
    letterSpacing: 0.5,
  },
  locationAddress: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.text,
    lineHeight: 20,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  rejectButton: {
    flex: 1,
  },
  acceptButton: {
    flex: 2,
  },
});
