import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  IndianRupee,
  CreditCard,
} from 'lucide-react-native';
import Card from '@/components/Card';
import { Button } from '@/components/Button';
import Colors from '@/constants/colors';
import { MOCK_EARNINGS } from '@/mocks/data';
import { formatCurrency, formatDate } from '@/utils/helpers';

const PERIODS = ['Today', 'Week', 'Month'];

export default function EarningsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('Week');

  const getEarningsForPeriod = () => {
    switch (selectedPeriod) {
      case 'Today':
        return MOCK_EARNINGS.today;
      case 'Week':
        return MOCK_EARNINGS.week;
      case 'Month':
        return MOCK_EARNINGS.month;
      default:
        return MOCK_EARNINGS.week;
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'trip_earning':
      case 'bonus':
        return <ArrowDownLeft size={18} color={Colors.accent} />;
      case 'payout':
      case 'deduction':
        return <ArrowUpRight size={18} color={Colors.secondary} />;
      default:
        return <IndianRupee size={18} color={Colors.textTertiary} />;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Earnings</Text>
          <TouchableOpacity style={styles.calendarButton}>
            <Calendar size={22} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={['#F97316', '#FB923C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <View style={styles.balanceHeader}>
            <View style={styles.balanceIcon}>
              <Wallet size={24} color="#fff" />
            </View>
            <Text style={styles.balanceLabel}>Available Balance</Text>
          </View>
          <Text style={styles.balanceAmount}>
            {formatCurrency(MOCK_EARNINGS.pendingPayout)}
          </Text>
          <Button
            title="Withdraw to Bank"
            variant="ghost"
            onPress={() => {}}
            style={styles.withdrawButton}
            textStyle={styles.withdrawButtonText}
            icon={<CreditCard size={18} color="#fff" />}
          />
        </LinearGradient>

        <View style={styles.periodSelector}>
          {PERIODS.map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === period && styles.periodTextActive,
                ]}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Card variant="elevated" style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>Earnings Summary</Text>
            <View style={styles.trendBadge}>
              <TrendingUp size={14} color={Colors.accent} />
              <Text style={styles.trendText}>+12%</Text>
            </View>
          </View>
          <Text style={styles.statsAmount}>{formatCurrency(getEarningsForPeriod())}</Text>
          <Text style={styles.statsSubtitle}>
            {selectedPeriod === 'Today' ? '3 trips' : selectedPeriod === 'Week' ? '18 trips' : '72 trips'} completed
          </Text>
        </Card>

        <View style={styles.statsGrid}>
          <Card variant="outlined" style={styles.miniStatCard}>
            <Text style={styles.miniStatLabel}>Total Earnings</Text>
            <Text style={styles.miniStatValue}>{formatCurrency(MOCK_EARNINGS.total)}</Text>
          </Card>
          <Card variant="outlined" style={styles.miniStatCard}>
            <Text style={styles.miniStatLabel}>Pending Payout</Text>
            <Text style={styles.miniStatValue}>{formatCurrency(MOCK_EARNINGS.pendingPayout)}</Text>
          </Card>
        </View>

        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {MOCK_EARNINGS.transactions.map((transaction) => (
            <Card key={transaction.id} variant="outlined" style={styles.transactionCard}>
              <View style={styles.transactionRow}>
                <View style={[
                  styles.transactionIcon,
                  transaction.type === 'payout' && styles.transactionIconPayout,
                ]}>
                  {getTransactionIcon(transaction.type)}
                </View>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionDesc}>{transaction.description}</Text>
                  <Text style={styles.transactionDate}>
                    {formatDate(transaction.createdAt)}
                  </Text>
                </View>
                <Text style={[
                  styles.transactionAmount,
                  transaction.type === 'payout' && styles.transactionAmountNegative,
                ]}>
                  {transaction.type === 'payout' ? '-' : '+'}{formatCurrency(transaction.amount)}
                </Text>
              </View>
            </Card>
          ))}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  calendarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  balanceCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  balanceIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500' as const,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 16,
  },
  withdrawButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  withdrawButtonText: {
    color: '#fff',
  },
  periodSelector: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: Colors.surfaceSecondary,
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textTertiary,
  },
  periodTextActive: {
    color: Colors.text,
    fontWeight: '600' as const,
  },
  statsCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.accent,
  },
  statsAmount: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  statsSubtitle: {
    fontSize: 13,
    color: Colors.textTertiary,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  miniStatCard: {
    flex: 1,
    padding: 14,
  },
  miniStatLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  miniStatValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  transactionsSection: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  transactionCard: {
    marginBottom: 10,
    padding: 14,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionIconPayout: {
    backgroundColor: Colors.secondary + '20',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDesc: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  transactionDate: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.accent,
  },
  transactionAmountNegative: {
    color: Colors.secondary,
  },
});
