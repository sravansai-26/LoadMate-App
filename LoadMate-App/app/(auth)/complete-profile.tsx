import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Truck, UserCircle, CheckCircle2 } from 'lucide-react-native';
import axios from 'axios';
import { Button } from '@/components/Button';
import Input from '@/components/Input';
import Colors from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { translations } from '@/constants/translations';

export default function CompleteProfileScreen() {
  const router = useRouter();
  const { phone = '' } = useLocalSearchParams<{ phone: string }>();
  const { language, login } = useApp();
  
  // Safe translation access with fallback
  const t = translations[language as keyof typeof translations] || translations.en;

  const [name, setName] = useState('');
  const [role, setRole] = useState<'driver' | 'customer' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { 
        toValue: 1, 
        duration: 600, 
        useNativeDriver: true 
      }),
      Animated.timing(slideAnim, { 
        toValue: 0, 
        duration: 600, 
        useNativeDriver: true 
      }),
    ]).start();
  }, []);

  const handleFinish = async () => {
    // Client-side validation
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!role) {
      setError('Please select your role');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Finalizing registration in MongoDB
      // Sending 'ALREADY_VERIFIED' tells the backend the OTP was already successful
      const response = await axios.post('http://192.168.24.8:8000/auth/verify-otp', {
        phone_number: phone,
        otp_code: "ALREADY_VERIFIED", 
        full_name: name.trim(),
        role: role
      });

      if (response.status === 200) {
        // VITAL: Save user and token to AsyncStorage via AppContext
        // This ensures the user stays logged in even after app restart.
        await login(response.data.user, response.data.access_token);
        
        // Navigation is handled automatically by RootLayout's auth listener
      }
    } catch (err: any) {
      const serverError = err.response?.data?.detail || 'Failed to save profile. Please try again.';
      setError(serverError);
      console.error('[PROFILE_ERROR]:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <Text style={styles.title}>Complete Your Profile</Text>
            <Text style={styles.subtitle}>Just a few more details to get you moving</Text>

            <View style={styles.section}>
              <Text style={styles.label}>Full Name</Text>
              <Input
                placeholder="John Doe"
                value={name}
                onChangeText={(text) => { setName(text); setError(''); }}
                leftIcon={<User size={20} color={Colors.textTertiary} />}
                error={error && !name.trim() ? error : ''}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>I want to use LoadMate as a:</Text>
              
              <View style={styles.roleGrid}>
                <TouchableOpacity 
                  activeOpacity={0.7}
                  style={[styles.roleCard, role === 'customer' && styles.roleCardActive]}
                  onPress={() => { setRole('customer'); setError(''); }}
                >
                  <View style={[styles.roleIcon, role === 'customer' && styles.roleIconActive]}>
                    <UserCircle size={32} color={role === 'customer' ? Colors.primary : Colors.textSecondary} />
                  </View>
                  <Text style={[styles.roleText, role === 'customer' && styles.roleTextActive]}>Customer</Text>
                  <Text style={styles.roleDesc}>I want to ship goods</Text>
                  {role === 'customer' && <CheckCircle2 size={20} color={Colors.primary} style={styles.checkIcon} />}
                </TouchableOpacity>

                <TouchableOpacity 
                  activeOpacity={0.7}
                  style={[styles.roleCard, role === 'driver' && styles.roleCardActive]}
                  onPress={() => { setRole('driver'); setError(''); }}
                >
                  <View style={[styles.roleIcon, role === 'driver' && styles.roleIconActive]}>
                    <Truck size={32} color={role === 'driver' ? Colors.primary : Colors.textSecondary} />
                  </View>
                  <Text style={[styles.roleText, role === 'driver' && styles.roleTextActive]}>Driver</Text>
                  <Text style={styles.roleDesc}>I want to transport loads</Text>
                  {role === 'driver' && <CheckCircle2 size={20} color={Colors.primary} style={styles.checkIcon} />}
                </TouchableOpacity>
              </View>
            </View>

            {/* Error display for role selection */}
            {error && name.trim() && !role && (
               <Text style={styles.mainError}>{error}</Text>
            )}

            <Button
              title={loading ? "" : "Finish & Explore"}
              onPress={handleFinish}
              disabled={loading}
              size="large"
              icon={loading ? <ActivityIndicator color="#fff" /> : null}
              style={styles.finishButton}
            />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background 
  },
  scrollContent: { 
    padding: 24, 
    flexGrow: 1 
  },
  title: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: Colors.text, 
    marginBottom: 8 
  },
  subtitle: { 
    fontSize: 16, 
    color: Colors.textSecondary, 
    marginBottom: 32 
  },
  section: { 
    marginBottom: 24 
  },
  label: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: Colors.textSecondary, 
    marginBottom: 12, 
    marginLeft: 4 
  },
  roleGrid: { 
    flexDirection: 'row', 
    gap: 16 
  },
  roleCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    position: 'relative',
  },
  roleCardActive: { 
    borderColor: Colors.primary, 
    backgroundColor: Colors.primary + '08' 
  },
  roleIcon: { 
    width: 64, 
    height: 64, 
    borderRadius: 32, 
    backgroundColor: Colors.background, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 12 
  },
  roleIconActive: { 
    backgroundColor: Colors.primary + '15' 
  },
  roleText: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: Colors.text, 
    marginBottom: 4 
  },
  roleTextActive: { 
    color: Colors.primary 
  },
  roleDesc: { 
    fontSize: 12, 
    color: Colors.textTertiary, 
    textAlign: 'center' 
  },
  checkIcon: { 
    position: 'absolute', 
    top: 12, 
    right: 12 
  },
  mainError: { 
    color: Colors.error, 
    textAlign: 'center', 
    marginBottom: 16, 
    fontWeight: '500' 
  },
  finishButton: { 
    marginTop: 16 
  },
});