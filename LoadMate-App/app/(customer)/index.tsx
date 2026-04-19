import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import {
  Package,
  Truck,
  MapPin,
  Clock,
  ArrowRight,
  Bell,
  Star,
} from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { translations } from '@/constants/translations';

import TripCard from '@/components/TripCard';
import Colors from '@/constants/colors';
import { MOCK_TRIPS, MOCK_NEARBY_DRIVERS } from '@/mocks/data';

const { width } = Dimensions.get('window');

// Fallback translation (English) — prevents crash even if context fails
const fallbackT = translations.en || {
  postLoad: 'Post Load',
  findDrivers: 'Find Drivers',
  trackShipment: 'Track Shipment',
  tripHistory: 'Trip History',
  // ← Add other keys you use if needed
};

export default function CustomerHomeScreen() {
  const router = useRouter();
  const { user, language } = useApp();

  // Safely get translation object — fallback to 'en' or fallbackT
  const t = (language && translations[language]) || fallbackT;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const activeTrip = MOCK_TRIPS.find((t) => t.status === 'in_transit');
  const quickActions: Array<{ icon: any; label: string; route: '/(customer)/post-load' | '/(customer)/track' | '/(customer)/history'; color: string }> = [
    { icon: Package, label: t.postLoad, route: '/(customer)/post-load', color: Colors.primary },
    { icon: Truck, label: t.findDrivers, route: '/(customer)/post-load', color: Colors.secondary },
    { icon: MapPin, label: t.trackShipment, route: '/(customer)/track', color: Colors.accent },
    { icon: Clock, label: t.tripHistory, route: '/(customer)/history', color: Colors.info },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0A2540', '#0F4C81']} style={styles.headerGradient}>
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>Good Morning,</Text>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
            </View>
            <TouchableOpacity style={styles.notificationBtn}>
              <Bell size={22} color="#fff" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {activeTrip && (
            <View style={styles.activeSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Active Shipment</Text>
                <TouchableOpacity onPress={() => router.push('/(customer)/track')}>
                  <Text style={styles.seeAll}>Track Live</Text>
                </TouchableOpacity>
              </View>
              <TripCard trip={activeTrip} onPress={() => router.push('/(customer)/track')} />
            </View>
          )}

          <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickActionCard}
                  onPress={() => router.push(action.route)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.quickActionIcon, { backgroundColor: action.color + '15' }]}>
                    <action.icon size={24} color={action.color} />
                  </View>
                  <Text style={styles.quickActionLabel}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.driversSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Nearby Drivers</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>View Map</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.driversScroll}
            >
              {MOCK_NEARBY_DRIVERS.slice(0, 4).map((driver) => (
                <TouchableOpacity key={driver.id} style={styles.driverCard} activeOpacity={0.8}>
                  <Image
                    source={{ uri: driver.avatar }}
                    style={styles.driverAvatar}
                    contentFit="cover"
                  />
                  <Text style={styles.driverName} numberOfLines={1}>
                    {driver.name}
                  </Text>
                  <View style={styles.driverRating}>
                    <Star size={12} color={Colors.warning} fill={Colors.warning} />
                    <Text style={styles.driverRatingText}>{driver.rating}</Text>
                  </View>
                  <Text style={styles.driverVehicle}>{driver.vehicleNumber}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.promoSection}>
            <LinearGradient
              colors={['#F97316', '#FB923C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.promoCard}
            >
              <View style={styles.promoContent}>
                <Text style={styles.promoTitle}>First Trip Offer!</Text>
                <Text style={styles.promoDesc}>Get 20% off on your first shipment</Text>
                <TouchableOpacity style={styles.promoButton}>
                  <Text style={styles.promoButtonText}>Book Now</Text>
                  <ArrowRight size={16} color={Colors.secondary} />
                </TouchableOpacity>
              </View>
              <Package size={80} color="rgba(255,255,255,0.3)" />
            </LinearGradient>
          </View>

          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Trips</Text>
              <TouchableOpacity onPress={() => router.push('/(customer)/history')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            {MOCK_TRIPS.slice(0, 2).map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// styles remain exactly the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerGradient: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  headerLeft: {},
  greeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginTop: 2,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.secondary,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  activeSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  quickActionsSection: {
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 12,
  },
  quickActionCard: {
    width: (width - 52) / 2,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  driversSection: {
    marginBottom: 24,
  },
  driversScroll: {
    gap: 12,
  },
  driverCard: {
    width: 100,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  driverAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 8,
    backgroundColor: Colors.surfaceSecondary,
  },
  driverName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  driverRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  driverRatingText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  driverVehicle: {
    fontSize: 10,
    color: Colors.textTertiary,
    marginTop: 4,
  },
  promoSection: {
    marginBottom: 24,
  },
  promoCard: {
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  promoDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 16,
  },
  promoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
    gap: 6,
  },
  promoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.secondary,
  },
  recentSection: {
    marginBottom: 20,
  },
});