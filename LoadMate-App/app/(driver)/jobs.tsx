import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Briefcase, Clock, CheckCircle, XCircle } from 'lucide-react-native';
import TripCard from '@/components/TripCard';
import Colors from '@/constants/colors';
import { MOCK_TRIPS, MOCK_PENDING_REQUESTS } from '@/mocks/data';

const TABS = [
  { key: 'available', label: 'Available', icon: Clock },
  { key: 'active', label: 'Active', icon: Briefcase },
  { key: 'completed', label: 'Completed', icon: CheckCircle },
];

export default function JobsScreen() {
  const [activeTab, setActiveTab] = useState('available');

  const getTripsForTab = () => {
    switch (activeTab) {
      case 'available':
        return MOCK_PENDING_REQUESTS;
      case 'active':
        return MOCK_TRIPS.filter(t => t.status === 'in_transit' || t.status === 'accepted');
      case 'completed':
        return MOCK_TRIPS.filter(t => t.status === 'completed');
      default:
        return [];
    }
  };

  const trips = getTripsForTab();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Jobs</Text>
      </View>

      <View style={styles.tabContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.tabActive,
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <tab.icon
              size={18}
              color={activeTab === tab.key ? Colors.secondary : Colors.textTertiary}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TripCard trip={item} showDriver={false} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Briefcase size={48} color={Colors.textTertiary} />
            <Text style={styles.emptyTitle}>No jobs found</Text>
            <Text style={styles.emptyText}>
              {activeTab === 'available'
                ? 'New job requests will appear here'
                : 'Your jobs will appear here'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  tabActive: {
    backgroundColor: Colors.secondary + '15',
    borderColor: Colors.secondary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textTertiary,
  },
  tabTextActive: {
    color: Colors.secondary,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
