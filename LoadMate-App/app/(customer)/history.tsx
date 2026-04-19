import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, Filter, Search } from 'lucide-react-native';
import TripCard from '@/components/TripCard';
import Colors from '@/constants/colors';
import { MOCK_TRIPS } from '@/mocks/data';
import { TripStatus } from '@/types';

const FILTERS: { key: TripStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'completed', label: 'Completed' },
  { key: 'in_transit', label: 'In Transit' },
  { key: 'cancelled', label: 'Cancelled' },
];

export default function HistoryScreen() {
  const [activeFilter, setActiveFilter] = useState<TripStatus | 'all'>('all');

  const filteredTrips = MOCK_TRIPS.filter(
    (trip) => activeFilter === 'all' || trip.status === activeFilter
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Trip History</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={22} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={FILTERS}
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                activeFilter === item.key && styles.filterChipActive,
              ]}
              onPress={() => setActiveFilter(item.key)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === item.key && styles.filterTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filteredTrips}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <TripCard trip={item} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Clock size={48} color={Colors.textTertiary} />
            <Text style={styles.emptyTitle}>No trips found</Text>
            <Text style={styles.emptyText}>
              Your trip history will appear here
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
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterContainer: {
    paddingBottom: 16,
  },
  filterList: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: '#fff',
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
