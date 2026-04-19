import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Shield, RefreshCw } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { authApi } from '../../utils/apiService';
import { Button } from '@/components/Button';
import { OtpInput } from '@/components/OtpInput';
import Colors from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { translations } from '@/constants/translations';

export default function OtpScreen() {
  const router = useRouter();
  const { phone = '' } = useLocalSearchParams<{ phone: string }>(); 
  const { language, login } = useApp();

  const t = (language && translations[language as keyof typeof translations]) || translations.en;

  const [otp, setOtp] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    if (resendTimer > 0) {
      timerRef.current = setTimeout(() => setResendTimer(resendTimer - 1), 1000) as unknown as NodeJS.Timeout;
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resendTimer]);

  // AUTOMATIC VERIFICATION: Triggers as soon as 6 digits are reached
  useEffect(() => {
    if (otp.length === 6 && !isVerifying) {
      verifyOtp();
    }
  }, [otp]);

  const verifyOtp = async () => {
  if (isVerifying) return;

  setIsVerifying(true);
  setError(false);
  setErrorMessage('');

  try {
    const response = await authApi.verifyOtp(phone, otp);

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    await login(response.data.user, response.data.access_token);

  } catch (err: any) {
    if (err.response?.status === 202) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      router.push({ 
        pathname: "/(auth)/complete-profile" as any, 
        params: { phone } 
      });
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(true);
      setErrorMessage(err.response?.data?.detail || 'Invalid OTP. Please try again.');
      setOtp('');
    }
  } finally {
    setIsVerifying(false);
  }
};

 const handleResend = async () => {
  if (resendTimer === 0) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setResendTimer(30);
    setOtp('');
    setError(false);
    setErrorMessage('');

    try {
      await authApi.requestOtp(phone);
    } catch (err) {
      console.error('Resend failed:', err);
    }
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.iconContainer}>
            <Shield size={40} color={Colors.primary} />
          </View>

          <Text style={styles.title}>{t.verifyOtp}</Text>
          <Text style={styles.subtitle}>{t.enterOtp}</Text>
          <Text style={styles.phone}>{phone}</Text>

          <View style={styles.otpContainer}>
            <OtpInput
              value={otp}
              onChange={setOtp}
              error={error}
              autoFocus
            />
          </View>

          {error && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}

          <Button
            title={isVerifying ? "" : "Verify & Continue"}
            onPress={verifyOtp}
            loading={isVerifying}
            disabled={otp.length !== 6 || isVerifying}
            size="large"
            style={styles.verifyButton}
          />

          <TouchableOpacity
            style={styles.resendContainer}
            onPress={handleResend}
            disabled={resendTimer > 0}
          >
            <RefreshCw
              size={16}
              color={resendTimer > 0 ? Colors.textTertiary : Colors.primary}
            />
            <Text
              style={[
                styles.resendText,
                resendTimer > 0 && styles.resendTextDisabled,
              ]}
            >
              {resendTimer > 0
                ? `Resend OTP in ${resendTimer}s`
                : t.resendOtp}
            </Text>
          </TouchableOpacity>

          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>
              Check your backend terminal for the 6-digit code.
            </Text>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  phone: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 32,
  },
  otpContainer: {
    marginBottom: 24,
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  verifyButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  resendTextDisabled: {
    color: Colors.textTertiary,
  },
  helpContainer: {
    marginTop: 'auto',
    padding: 16,
    backgroundColor: Colors.infoLight,
    borderRadius: 12,
    marginBottom: 24,
  },
  helpText: {
    fontSize: 13,
    color: Colors.info,
    textAlign: 'center',
  },
});