import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  IndianRupee,
  TrendingUp,
  Navigation,
  Clock,
  CheckCircle,
} from 'lucide-react-native';
import { useApp } from '@/context/AppContext';

import AvailabilityToggle from '@/components/AvailabilityToggle';
import StatCard from '@/components/StatCard';
import TripRequestCard from '@/components/TripRequestCard';
import Card from '@/components/Card';
import Colors from '@/constants/colors';
import { MOCK_EARNINGS, MOCK_PENDING_REQUESTS } from '@/mocks/data';
import { formatCurrency } from '@/utils/helpers';

const { width } = Dimensions.get('window');

export default function DriverHomeScreen() {
  const { user, isDriverAvailable, toggleDriverAvailability } = useApp();
  
  const [showRequest, setShowRequest] = useState(false);
  const [requestTimer, setRequestTimer] = useState(30);
  
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

  useEffect(() => {
    if (isDriverAvailable && !showRequest) {
      const timer = setTimeout(() => {
        setShowRequest(true);
        setRequestTimer(30);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isDriverAvailable, showRequest]);

  useEffect(() => {
    if (showRequest && requestTimer > 0) {
      const interval = setInterval(() => {
        setRequestTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (requestTimer === 0) {
      setShowRequest(false);
    }
  }, [showRequest, requestTimer]);

  const handleAcceptTrip = () => {
    setShowRequest(false);
    console.log('Trip accepted');
  };

  const handleRejectTrip = () => {
    setShowRequest(false);
    console.log('Trip rejected');
  };

  const stats = [
    { title: "Today's Earnings", value: formatCurrency(MOCK_EARNINGS.today), icon: IndianRupee },
    { title: 'Trips Completed', value: '3', icon: CheckCircle },
    { title: 'Hours Online', value: '6.5h', icon: Clock },
    { title: 'Km Travelled', value: '87 km', icon: Navigation },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1A1A2E', '#16213E']}
        style={styles.headerGradient}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hello,</Text>
              <Text style={styles.userName}>{user?.name || 'Driver'}</Text>
            </View>
            <AvailabilityToggle
              isAvailable={isDriverAvailable}
              onToggle={toggleDriverAvailability}
            />
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
          {showRequest && MOCK_PENDING_REQUESTS[0] && (
            <TripRequestCard
              trip={MOCK_PENDING_REQUESTS[0]}
              onAccept={handleAcceptTrip}
              onReject={handleRejectTrip}
              timeLeft={requestTimer}
            />
          )}

          {!showRequest && (
            <>
              <StatCard
                title="Today's Earnings"
                value={formatCurrency(MOCK_EARNINGS.today)}
                subtitle="+₹350 from yesterday"
                icon={<TrendingUp size={18} color="#fff" />}
                gradient
                style={styles.earningsCard}
              />

              <View style={styles.statsGrid}>
                {stats.slice(1).map((stat, index) => (
                  <StatCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    icon={<stat.icon size={16} color={Colors.primary} />}
                    style={styles.statCard}
                  />
                ))}
              </View>

              {!isDriverAvailable && (
                <Card variant="outlined" style={styles.offlineCard}>
                  <View style={styles.offlineContent}>
                    <View style={styles.offlineDot} />
                    <View style={styles.offlineText}>
                      <Text style={styles.offlineTitle}>You are Offline</Text>
                      <Text style={styles.offlineDesc}>
                        Go online to start receiving trip requests
                      </Text>
                    </View>
                  </View>
                </Card>
              )}

              {isDriverAvailable && (
                <Card variant="elevated" style={styles.searchingCard}>
                  <View style={styles.searchingContent}>
                    <View style={styles.pulseContainer}>
                      <View style={styles.pulseOuter} />
                      <View style={styles.pulseInner} />
                    </View>
                    <View style={styles.searchingText}>
                      <Text style={styles.searchingTitle}>Looking for trips...</Text>
                      <Text style={styles.searchingDesc}>
                        We will notify you when a trip is available nearby
                      </Text>
                    </View>
                  </View>
                </Card>
              )}

              <View style={styles.tipsSection}>
                <Text style={styles.sectionTitle}>Tips to Earn More</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.tipsScroll}
                >
                  {[
                    { title: 'Peak Hours', desc: 'Be online during 8-10 AM and 6-9 PM' },
                    { title: 'High Demand Areas', desc: 'Industrial zones have more loads' },
                    { title: 'Complete Profile', desc: 'Verified drivers get more trips' },
                  ].map((tip, index) => (
                    <Card key={index} variant="outlined" style={styles.tipCard}>
                      <Text style={styles.tipTitle}>{tip.title}</Text>
                      <Text style={styles.tipDesc}>{tip.desc}</Text>
                    </Card>
                  ))}
                </ScrollView>
              </View>
            </>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerGradient: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#fff',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  earningsCard: {
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    width: (width - 52) / 2,
  },
  offlineCard: {
    marginBottom: 20,
    backgroundColor: Colors.surfaceSecondary,
  },
  offlineContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  offlineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.textTertiary,
  },
  offlineText: {
    flex: 1,
  },
  offlineTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  offlineDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  searchingCard: {
    marginBottom: 20,
    backgroundColor: Colors.accent + '10',
    borderWidth: 1,
    borderColor: Colors.accent + '30',
  },
  searchingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  pulseContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseOuter: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.accent + '30',
  },
  pulseInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.accent,
  },
  searchingText: {
    flex: 1,
  },
  searchingTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.accent,
  },
  searchingDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  tipsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  tipsScroll: {
    gap: 12,
  },
  tipCard: {
    width: 180,
    padding: 14,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
    marginBottom: 4,
  },
  tipDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
