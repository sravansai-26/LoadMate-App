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
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Phone, Truck, ArrowRight } from 'lucide-react-native';
import { authApi } from '@/utils/apiService'; 
// adjust path if needed
import { Button } from '@/components/Button';
import Input from '@/components/Input';
import Colors from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { translations } from '@/constants/translations';

export default function LoginScreen() {
  const router = useRouter();
  const { language } = useApp();
  
  // Safe translation access with fallback to English
  const t = translations[language] || translations.en;
  
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Added proper ref for the phone input
  const phoneInputRef = useRef<TextInput>(null);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const validatePhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      setPhone(cleaned);
      setError('');
    }
  };

 const handleContinue = async () => {
  if (phone.length !== 10) {
    setError('Please enter a valid 10-digit phone number');
    return;
  }

  setLoading(true);
  setError('');

  try {
    console.log("Calling API...");

    const response = await authApi.requestOtp(`+91${phone}`);

    console.log("SUCCESS:", response.data);

    router.push({ 
      pathname: '/(auth)/otp', 
      params: { phone: `+91${phone}` } 
    });

  } catch (err: any) {
    console.log("FULL ERROR:", err);

    if (err.response) {
      setError(err.response.data.detail || 'Failed to send OTP');
    } else {
      setError('Backend unreachable. Check connection.');
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0F4C81', '#1E6DB5']} style={styles.headerGradient}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Truck size={32} color="#fff" />
            </View>
            <Text style={styles.brandName}>LoadMate</Text>
            <Text style={styles.tagline}>{t.tagline}</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          keyboardShouldPersistTaps="handled" 
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
            <Text style={styles.welcomeText}>{t.welcome}</Text>
            <Text style={styles.subtitle}>Enter your phone number to get started</Text>

            <View style={styles.inputContainer}>
              <View style={styles.countryCode}>
                <Text style={styles.flag}>🇮🇳</Text>
                <Text style={styles.code}>+91</Text>
              </View>
              <View style={styles.phoneInput}>
                <Input
                    placeholder="Enter phone number"
                    value={phone}
                    onChangeText={validatePhone}
                    keyboardType="phone-pad"
                    error={error}
                    maxLength={10}
                    leftIcon={<Phone size={20} color={Colors.textTertiary} />}
                  />
              </View>
            </View>

            <Button
              title={loading ? "" : t.continue}
              onPress={handleContinue}
              disabled={loading}
              size="large"
              icon={loading ? <ActivityIndicator color="#fff" /> : <ArrowRight size={20} color="#fff" />}
              iconPosition="right"
              style={styles.continueButton}
            />

            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By continuing, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity 
              style={styles.signupButton} 
              onPress={() => phoneInputRef.current?.focus()}
            >
              <Text style={styles.signupText}>
                New to LoadMate? <Text style={styles.signupLink}>Enter phone to start</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerGradient: {
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: '#fff',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  formContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 24,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 6,
  },
  flag: {
    fontSize: 20,
  },
  code: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  phoneInput: {
    flex: 1,
  },
  continueButton: {
    marginBottom: 20,
  },
  termsContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  termsText: {
    fontSize: 12,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: '500' as const,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 13,
    color: Colors.textTertiary,
  },
  signupButton: {
    alignItems: 'center',
    padding: 16,
  },
  signupText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  signupLink: {
    color: Colors.primary,
    fontWeight: '600' as const,
  },
});