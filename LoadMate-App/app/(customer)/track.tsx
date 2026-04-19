import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import {
  Phone,
  MessageCircle,
  Navigation,
  MapPin,
  Clock,
  Package,
  ChevronUp,
  ChevronDown,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Card from '@/components/Card';
import StatusBadge from '@/components/StatusBadge';
import { Button } from '@/components/Button';
import Colors from '@/constants/colors';
import { MOCK_TRIPS } from '@/mocks/data';
import { formatCurrency, formatDistance, formatDuration } from '@/utils/helpers';

const { width, height } = Dimensions.get('window');

export default function TrackScreen() {
  const activeTrip = MOCK_TRIPS.find(t => t.status === 'in_transit') || MOCK_TRIPS[0];
  const [isExpanded, setIsExpanded] = useState(false);
  
  const slideAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: isExpanded ? 1 : 0,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [isExpanded, slideAnim]);

  const panelTranslate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -150],
  });

  const tripStages = [
    { key: 'accepted', label: 'Order Confirmed', done: true },
    { key: 'pickup_started', label: 'Driver En Route to Pickup', done: true },
    { key: 'goods_collected', label: 'Goods Collected', done: true },
    { key: 'in_transit', label: 'In Transit', done: true, current: true },
    { key: 'arrived', label: 'Arrived at Drop', done: false },
    { key: 'delivered', label: 'Delivered', done: false },
  ];

  if (!activeTrip) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Package size={64} color={Colors.textTertiary} />
          <Text style={styles.emptyTitle}>No Active Shipment</Text>
          <Text style={styles.emptyText}>
            You don't have any active shipments to track right now.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <LinearGradient
          colors={['#E8F4FD', '#D1E9FC', '#B8DDF9']}
          style={styles.mapPlaceholder}
        >
          <View style={styles.mapOverlay}>
            <View style={styles.routePath} />
            
            <Animated.View
              style={[
                styles.driverMarker,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <View style={styles.driverMarkerInner}>
                <Navigation size={16} color="#fff" />
              </View>
            </Animated.View>
            
            <View style={[styles.locationMarker, styles.pickupMarker]}>
              <View style={styles.markerDot} />
            </View>
            
            <View style={[styles.locationMarker, styles.dropMarker]}>
              <MapPin size={20} color={Colors.secondary} />
            </View>
          </View>
        </LinearGradient>

        <SafeAreaView edges={['top']} style={styles.mapHeader}>
          <View style={styles.etaCard}>
            <Clock size={16} color={Colors.primary} />
            <Text style={styles.etaText}>ETA: {formatDuration(activeTrip.estimatedDuration)}</Text>
          </View>
        </SafeAreaView>
      </View>

      <Animated.View
        style={[
          styles.bottomPanel,
          { transform: [{ translateY: panelTranslate }] },
        ]}
      >
        <TouchableOpacity
          style={styles.panelHandle}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <View style={styles.handleBar} />
          {isExpanded ? (
            <ChevronDown size={20} color={Colors.textTertiary} />
          ) : (
            <ChevronUp size={20} color={Colors.textTertiary} />
          )}
        </TouchableOpacity>

        <View style={styles.panelContent}>
          <View style={styles.tripHeader}>
            <StatusBadge status={activeTrip.status} />
            <Text style={styles.tripId}>#{activeTrip.id.slice(-6).toUpperCase()}</Text>
          </View>

          {activeTrip.driver && (
            <View style={styles.driverSection}>
              <Image
                source={{ uri: activeTrip.driver.avatar }}
                style={styles.driverAvatar}
                contentFit="cover"
              />
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{activeTrip.driver.name}</Text>
                <Text style={styles.vehicleInfo}>{activeTrip.driver.vehicleNumber}</Text>
              </View>
              <View style={styles.driverActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Phone size={20} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <MessageCircle size={20} color={Colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.locationSummary}>
            <View style={styles.locationRow}>
              <View style={[styles.dot, styles.pickupDot]} />
              <Text style={styles.locationText} numberOfLines={1}>
                {activeTrip.pickup.address}
              </Text>
            </View>
            <View style={styles.locationLine} />
            <View style={styles.locationRow}>
              <View style={[styles.dot, styles.dropDot]} />
              <Text style={styles.locationText} numberOfLines={1}>
                {activeTrip.drop.address}
              </Text>
            </View>
          </View>

          {isExpanded && (
            <Animated.View style={styles.expandedContent}>
              <Text style={styles.stagesTitle}>Shipment Progress</Text>
              <View style={styles.stagesContainer}>
                {tripStages.map((stage, index) => (
                  <View key={stage.key} style={styles.stageItem}>
                    <View style={styles.stageIndicator}>
                      <View
                        style={[
                          styles.stageDot,
                          stage.done && styles.stageDotDone,
                          stage.current && styles.stageDotCurrent,
                        ]}
                      />
                      {index < tripStages.length - 1 && (
                        <View
                          style={[
                            styles.stageLine,
                            stage.done && styles.stageLineDone,
                          ]}
                        />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.stageLabel,
                        stage.done && styles.stageLabelDone,
                        stage.current && styles.stageLabelCurrent,
                      ]}
                    >
                      {stage.label}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.otpSection}>
                <Text style={styles.otpLabel}>Delivery OTP</Text>
                <View style={styles.otpContainer}>
                  {activeTrip.deliveryOtp?.split('').map((digit, i) => (
                    <View key={i} style={styles.otpBox}>
                      <Text style={styles.otpDigit}>{digit}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.otpNote}>Share this OTP with driver at delivery</Text>
              </View>
            </Animated.View>
          )}

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Total Amount</Text>
            <Text style={styles.priceValue}>{formatCurrency(activeTrip.price)}</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mapContainer: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
  },
  mapOverlay: {
    flex: 1,
    position: 'relative',
  },
  routePath: {
    position: 'absolute',
    top: '30%',
    left: '20%',
    width: '60%',
    height: 3,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    transform: [{ rotate: '15deg' }],
  },
  driverMarker: {
    position: 'absolute',
    top: '35%',
    left: '45%',
  },
  driverMarkerInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  locationMarker: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickupMarker: {
    top: '25%',
    left: '15%',
  },
  dropMarker: {
    top: '40%',
    right: '15%',
  },
  markerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.accent,
    borderWidth: 3,
    borderColor: '#fff',
  },
  mapHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  etaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 8,
  },
  etaText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
    minHeight: 280,
  },
  panelHandle: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    marginBottom: 4,
  },
  panelContent: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tripId: {
    fontSize: 13,
    color: Colors.textTertiary,
    fontWeight: '500' as const,
  },
  driverSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 14,
    marginBottom: 16,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.border,
  },
  driverInfo: {
    flex: 1,
    marginLeft: 12,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  vehicleInfo: {
    fontSize: 13,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  driverActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationSummary: {
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  pickupDot: {
    backgroundColor: Colors.accent,
  },
  dropDot: {
    backgroundColor: Colors.secondary,
  },
  locationLine: {
    width: 2,
    height: 16,
    backgroundColor: Colors.border,
    marginLeft: 4,
    marginVertical: 4,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  expandedContent: {
    marginTop: 8,
  },
  stagesTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  stagesContainer: {
    marginBottom: 20,
  },
  stageItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stageIndicator: {
    alignItems: 'center',
    width: 20,
  },
  stageDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.border,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  stageDotDone: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  stageDotCurrent: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stageLine: {
    width: 2,
    height: 20,
    backgroundColor: Colors.border,
  },
  stageLineDone: {
    backgroundColor: Colors.accent,
  },
  stageLabel: {
    flex: 1,
    fontSize: 13,
    color: Colors.textTertiary,
    marginLeft: 12,
    marginTop: -2,
    marginBottom: 8,
  },
  stageLabelDone: {
    color: Colors.text,
  },
  stageLabelCurrent: {
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  otpSection: {
    backgroundColor: Colors.warningLight,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  otpLabel: {
    fontSize: 12,
    color: Colors.warning,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  otpContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  otpBox: {
    width: 36,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpDigit: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  otpNote: {
    fontSize: 11,
    color: Colors.warning,
    marginTop: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
