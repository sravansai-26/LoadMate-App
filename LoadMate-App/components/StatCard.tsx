import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  gradient?: boolean;
  style?: ViewStyle;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  gradient = false,
  style,
}: StatCardProps) {
  if (gradient) {
    return (
      <LinearGradient
        colors={Colors.gradientPrimary as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, styles.gradientCard, style]}
      >
        <View style={styles.header}>
          {icon && <View style={styles.iconLight}>{icon}</View>}
          <Text style={styles.titleLight}>{title}</Text>
        </View>
        <Text style={styles.valueLight}>{value}</Text>
        {subtitle && <Text style={styles.subtitleLight}>{subtitle}</Text>}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.card, style]}>
      <View style={styles.header}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  gradientCard: {
    borderWidth: 0,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLight: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  titleLight: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500' as const,
  },
  value: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  valueLight: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#fff',
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 4,
  },
  subtitleLight: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
});
