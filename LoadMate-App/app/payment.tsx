import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  X,
  CreditCard,
  Smartphone,
  Wallet,
  Banknote,
  Shield,
  CheckCircle,
  ChevronRight,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Button } from '@/components/Button';
import Card from '@/components/Card';
import Colors from '@/constants/colors';
import { formatCurrency } from '@/utils/helpers';

type PaymentMethod = 'upi' | 'card' | 'wallet' | 'cash';

interface PaymentOption {
  id: PaymentMethod;
  name: string;
  icon: typeof CreditCard;
  description: string;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  { id: 'upi', name: 'UPI', icon: Smartphone, description: 'Pay using any UPI app' },
  { id: 'card', name: 'Card', icon: CreditCard, description: 'Credit or Debit card' },
  { id: 'wallet', name: 'Wallet', icon: Wallet, description: 'LoadMate Wallet' },
  { id: 'cash', name: 'Cash', icon: Banknote, description: 'Pay after delivery' },
];

export default function PaymentScreen() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const tripAmount = 2850;
  const advanceAmount = 850;
  const platformFee = 50;
  const totalAmount = advanceAmount + platformFee;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handlePayment = async () => {
    setIsProcessing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setIsSuccess(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      router.replace('/(customer)/track');
    }, 2000);
  };

  if (isSuccess) {
    return (
      <View style={styles.successContainer}>
        <Animated.View
          style={[
            styles.successContent,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={styles.successIcon}>
            <CheckCircle size={64} color={Colors.accent} />
          </View>
          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.successAmount}>{formatCurrency(totalAmount)}</Text>
          <Text style={styles.successText}>
            Your trip has been confirmed. You'll be redirected to tracking...
          </Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <X size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <Card variant="elevated" style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Payment Summary</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Trip Fare</Text>
              <Text style={styles.summaryValue}>{formatCurrency(tripAmount)}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Advance Payment (30%)</Text>
              <Text style={styles.summaryValue}>{formatCurrency(advanceAmount)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Platform Fee</Text>
              <Text style={styles.summaryValue}>{formatCurrency(platformFee)}</Text>
            </View>
            
            <View style={[styles.divider, styles.dividerBold]} />
            
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Pay Now</Text>
              <Text style={styles.totalValue}>{formatCurrency(totalAmount)}</Text>
            </View>
            
            <View style={styles.balanceNote}>
              <Text style={styles.balanceText}>
                Balance {formatCurrency(tripAmount - advanceAmount)} to be paid after delivery
              </Text>
            </View>
          </Card>

          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          {PAYMENT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.paymentOption,
                selectedMethod === option.id && styles.paymentOptionSelected,
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedMethod(option.id);
              }}
            >
              <View style={[
                styles.optionIcon,
                selectedMethod === option.id && styles.optionIconSelected,
              ]}>
                <option.icon
                  size={22}
                  color={selectedMethod === option.id ? Colors.primary : Colors.textTertiary}
                />
              </View>
              <View style={styles.optionContent}>
                <Text style={[
                  styles.optionName,
                  selectedMethod === option.id && styles.optionNameSelected,
                ]}>
                  {option.name}
                </Text>
                <Text style={styles.optionDesc}>{option.description}</Text>
              </View>
              <View style={[
                styles.radioOuter,
                selectedMethod === option.id && styles.radioOuterSelected,
              ]}>
                {selectedMethod === option.id && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}

          <View style={styles.secureNote}>
            <Shield size={16} color={Colors.accent} />
            <Text style={styles.secureText}>
              Your payment is secured with 256-bit SSL encryption
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerAmount}>
          <Text style={styles.footerLabel}>Total Payable</Text>
          <Text style={styles.footerValue}>{formatCurrency(totalAmount)}</Text>
        </View>
        <Button
          title={isProcessing ? 'Processing...' : `Pay ${formatCurrency(totalAmount)}`}
          onPress={handlePayment}
          loading={isProcessing}
          disabled={isProcessing}
          size="large"
          style={styles.payButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  summaryCard: {
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  dividerBold: {
    height: 2,
    backgroundColor: Colors.primary + '30',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  balanceNote: {
    backgroundColor: Colors.infoLight,
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  balanceText: {
    fontSize: 13,
    color: Colors.info,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.border,
    marginBottom: 10,
    gap: 14,
  },
  paymentOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '08',
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIconSelected: {
    backgroundColor: Colors.primary + '20',
  },
  optionContent: {
    flex: 1,
  },
  optionName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  optionNameSelected: {
    color: Colors.primary,
  },
  optionDesc: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  secureNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    padding: 12,
  },
  secureText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  footer: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerAmount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  footerLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  footerValue: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  payButton: {},
  successContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  successContent: {
    alignItems: 'center',
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  successAmount: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.accent,
    marginBottom: 12,
  },
  successText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
