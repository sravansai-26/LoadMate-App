import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  User,
  Truck,
  FileText,
  CreditCard,
  Bell,
  Globe,
  HelpCircle,
  Shield,
  LogOut,
  ChevronRight,
  Star,
  CheckCircle,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useApp } from '@/context/AppContext';
import { translations, LANGUAGES } from '@/constants/translations';
import Colors from '@/constants/colors';
import Card from '@/components/Card';
import { Driver, VEHICLE_TYPES } from '@/types';

interface MenuItem {
  icon: LucideIcon;
  label: string;
  route: string;
  badge?: string;
  value?: string;
}

interface MenuSection {
  section: string;
  items: MenuItem[];
}

export default function DriverProfileScreen() {
  const router = useRouter();
  const { user, language, logout } = useApp();
  const t = translations[language];

  const driver = user as Driver;

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const menuItems: MenuSection[] = [
    {
      section: 'Vehicle & Documents',
      items: [
        { icon: Truck, label: 'Vehicle Details', route: '' },
        { icon: FileText, label: 'Documents', route: '', badge: 'Verified' },
      ],
    },
    {
      section: 'Account',
      items: [
        { icon: User, label: 'Edit Profile', route: '' },
        { icon: CreditCard, label: 'Bank Account', route: '' },
      ],
    },
    {
      section: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', route: '' },
        { icon: Globe, label: 'Language', route: '', value: LANGUAGES[language] },
      ],
    },
    {
      section: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & Support', route: '' },
        { icon: Shield, label: 'Privacy Policy', route: '' },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#1A1A2E', '#16213E']}
          style={styles.headerGradient}
        >
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {driver?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'D'}
                </Text>
              </View>
              <View style={styles.verifiedBadge}>
                <CheckCircle size={16} color="#fff" fill={Colors.accent} />
              </View>
            </View>
            <Text style={styles.userName}>{driver?.name || 'Driver'}</Text>
            <Text style={styles.userPhone}>+91 {driver?.phone || '9876543210'}</Text>
            
            <View style={styles.ratingRow}>
              <Star size={18} color={Colors.warning} fill={Colors.warning} />
              <Text style={styles.ratingText}>{driver?.rating || '4.8'}</Text>
              <Text style={styles.tripsText}>• {driver?.totalTrips || 156} trips</Text>
            </View>
          </View>

          <Card variant="elevated" style={styles.vehicleCard}>
            <View style={styles.vehicleRow}>
              <Truck size={24} color={Colors.secondary} />
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleType}>
                  {driver?.vehicleType ? VEHICLE_TYPES[driver.vehicleType].name : 'Tata Ace'}
                </Text>
                <Text style={styles.vehicleNumber}>{driver?.vehicleNumber || 'KA 01 AB 1234'}</Text>
              </View>
              <View style={styles.vehicleStatus}>
                <CheckCircle size={16} color={Colors.accent} />
                <Text style={styles.vehicleStatusText}>Active</Text>
              </View>
            </View>
          </Card>
        </LinearGradient>

        <View style={styles.content}>
          {menuItems.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.section}</Text>
              <Card variant="outlined" padding="none">
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={itemIndex}
                    style={[
                      styles.menuItem,
                      itemIndex < section.items.length - 1 && styles.menuItemBorder,
                    ]}
                  >
                    <View style={styles.menuItemLeft}>
                      <View style={styles.menuIconContainer}>
                        <item.icon size={20} color={Colors.secondary} />
                      </View>
                      <Text style={styles.menuItemLabel}>{item.label}</Text>
                    </View>
                    <View style={styles.menuItemRight}>
                      {item.badge && (
                        <View style={styles.verifiedTag}>
                          <CheckCircle size={12} color={Colors.accent} />
                          <Text style={styles.verifiedTagText}>{item.badge}</Text>
                        </View>
                      )}
                      {item.value && (
                        <Text style={styles.menuItemValue}>{item.value}</Text>
                      )}
                      <ChevronRight size={20} color={Colors.textTertiary} />
                    </View>
                  </TouchableOpacity>
                ))}
              </Card>
            </View>
          ))}

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color={Colors.error} />
            <Text style={styles.logoutText}>{t.logout}</Text>
          </TouchableOpacity>

          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerGradient: {
    paddingBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#fff',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 4,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
  },
  tripsText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  vehicleCard: {
    marginHorizontal: 20,
    marginTop: 8,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleType: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  vehicleNumber: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  vehicleStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  vehicleStatusText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.accent,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.secondary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemLabel: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuItemValue: {
    fontSize: 14,
    color: Colors.textTertiary,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  verifiedTagText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.accent,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 16,
    backgroundColor: Colors.errorLight,
    borderRadius: 12,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.error,
  },
  version: {
    fontSize: 12,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginBottom: 20,
  },
});
