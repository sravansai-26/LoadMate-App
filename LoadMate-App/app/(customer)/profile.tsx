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
import { Image } from 'expo-image';
import {
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Bell,
  Globe,
  HelpCircle,
  Shield,
  LogOut,
  ChevronRight,
  Star,
  Package,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/context/AppContext';
import { translations, LANGUAGES, Language } from '@/constants/translations';
import Colors from '@/constants/colors';
import Card from '@/components/Card';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, language, setLanguage, logout } = useApp();
  const t = translations[language];

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

  const menuItems = [
    {
      section: 'Account',
      items: [
        { icon: User, label: 'Edit Profile', route: '' },
        { icon: MapPin, label: 'Saved Addresses', route: '' },
        { icon: CreditCard, label: 'Payment Methods', route: '' },
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
          colors={Colors.gradientPrimary as [string, string]}
          style={styles.headerGradient}
        >
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </Text>
              </View>
              <TouchableOpacity style={styles.editAvatarButton}>
                <User size={14} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userPhone}>+91 {user?.phone || '9876543210'}</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Package size={20} color="rgba(255,255,255,0.8)" />
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Total Trips</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Star size={20} color="rgba(255,255,255,0.8)" />
              <Text style={styles.statValue}>4.9</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
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
                        <item.icon size={20} color={Colors.primary} />
                      </View>
                      <Text style={styles.menuItemLabel}>{item.label}</Text>
                    </View>
                    <View style={styles.menuItemRight}>
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
    paddingBottom: 24,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
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
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 24,
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
    backgroundColor: Colors.primary + '15',
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
