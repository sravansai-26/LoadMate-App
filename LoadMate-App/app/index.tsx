import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Truck, Package, MapPin } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import Colors from '@/constants/colors';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useApp();
  
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const icon1Anim = useRef(new Animated.Value(0)).current;
  const icon2Anim = useRef(new Animated.Value(0)).current;
  const icon3Anim = useRef(new Animated.Value(0)).current;
  const loadingBarAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start visual animations immediately
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.timing(textOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(taglineOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.stagger(150, [
        Animated.spring(icon1Anim, { toValue: 1, friction: 6, useNativeDriver: true }),
        Animated.spring(icon2Anim, { toValue: 1, friction: 6, useNativeDriver: true }),
        Animated.spring(icon3Anim, { toValue: 1, friction: 6, useNativeDriver: true }),
      ]),
    ]).start();

    // Loop the loading bar animation infinitely
    Animated.loop(
      Animated.sequence([
        Animated.timing(loadingBarAnim, { toValue: 1, duration: 1500, useNativeDriver: false }),
        Animated.timing(loadingBarAnim, { toValue: 0, duration: 0, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    // DO NOT navigate if AppContext is still reading from AsyncStorage
    if (isLoading) return;

    const timer = setTimeout(() => {
      if (isAuthenticated && user) {
        // Direct to appropriate dashboard based on MongoDB role
        if (user.role === 'customer') {
          router.replace('/(customer)');
        } else if (user.role === 'driver') {
          router.replace('/(driver)');
        } else {
          // Fallback to login if role is corrupted
          router.replace('/(auth)/login');
        }
      } else {
        // User not logged in, send to phone entry screen
        router.replace('/(auth)/login');
      }
    }, 2500); // 2.5 second delay to ensure splash animations are seen

    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated, user, router]);

  return (
    <LinearGradient
      colors={['#0A2540', '#0F4C81', '#1E6DB5']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.backgroundPattern}>
        {[...Array(20)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.patternDot,
              {
                left: Math.random() * width,
                top: Math.random() * height,
                opacity: 0.1 + Math.random() * 0.1,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }], opacity: logoOpacity }]}>
          <View style={styles.logoInner}>
            <Truck size={48} color="#fff" strokeWidth={2} />
          </View>
        </Animated.View>

        <Animated.Text style={[styles.title, { opacity: textOpacity }]}>LoadMate</Animated.Text>
        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>India&apos;s Trusted Logistics Partner</Animated.Text>

        <View style={styles.iconsRow}>
          <Animated.View style={[styles.featureIcon, { opacity: icon1Anim, transform: [{ scale: icon1Anim }] }]}><Package size={24} color="#fff" /></Animated.View>
          <Animated.View style={[styles.featureIcon, { opacity: icon2Anim, transform: [{ scale: icon2Anim }] }]}><Truck size={24} color="#fff" /></Animated.View>
          <Animated.View style={[styles.featureIcon, { opacity: icon3Anim, transform: [{ scale: icon3Anim }] }]}><MapPin size={24} color="#fff" /></Animated.View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.loadingBar}>
          <Animated.View 
            style={[
              styles.loadingProgress,
              {
                width: loadingBarAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%']
                })
              }
            ]} 
          />
        </View>
        <Text style={styles.footerText}>Connecting businesses across India</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundPattern: { ...StyleSheet.absoluteFillObject },
  patternDot: { position: 'absolute', width: 4, height: 4, borderRadius: 2, backgroundColor: '#fff' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  logoContainer: { marginBottom: 24 },
  logoInner: { width: 100, height: 100, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  title: { fontSize: 42, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  tagline: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 8, fontWeight: '500' },
  iconsRow: { flexDirection: 'row', marginTop: 48, gap: 24 },
  featureIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  footer: { paddingBottom: 60, paddingHorizontal: 40, alignItems: 'center' },
  loadingBar: { width: 120, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.2)', overflow: 'hidden', marginBottom: 16 },
  loadingProgress: { height: '100%', backgroundColor: '#F97316', borderRadius: 2 },
  footerText: { fontSize: 13, color: 'rgba(255,255,255,0.6)' },
});