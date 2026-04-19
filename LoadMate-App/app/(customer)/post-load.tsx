import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Modal,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MapPin,
  Navigation,
  Package,
  Truck,
  Scale,
  ChevronDown,
  ChevronRight,
  X,
  Search,
} from 'lucide-react-native';
import { Button } from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import DriverCard from '@/components/DriverCard';
import Colors from '@/constants/colors';
import { VehicleType, VEHICLE_TYPES } from '@/types';
import { MOCK_LOCATIONS, MOCK_NEARBY_DRIVERS, GOODS_TYPES } from '@/mocks/data';
import { formatCurrency, calculateEstimatedPrice } from '@/utils/helpers';

export default function PostLoadScreen() {
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [pickup, setPickup] = useState(MOCK_LOCATIONS[0]);
  const [drop, setDrop] = useState(MOCK_LOCATIONS[2]);
  const [goodsType, setGoodsType] = useState('');
  const [weight, setWeight] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('tata_ace');
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [showGoodsModal, setShowGoodsModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0.33)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: step / 3,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [step, progressAnim]);

  const estimatedPrice = calculateEstimatedPrice(18.5, vehicleType);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      router.push('/payment');
    }
  };

  const renderStep1 = () => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Text style={styles.stepTitle}>Pickup & Drop Locations</Text>
      <Text style={styles.stepSubtitle}>Where should we pick up and deliver?</Text>

      <TouchableOpacity style={styles.locationCard} activeOpacity={0.8}>
        <View style={[styles.locationIcon, { backgroundColor: Colors.accent + '15' }]}>
          <Navigation size={20} color={Colors.accent} />
        </View>
        <View style={styles.locationContent}>
          <Text style={styles.locationLabel}>PICKUP</Text>
          <Text style={styles.locationAddress}>{pickup.address}</Text>
          {pickup.landmark && (
            <Text style={styles.locationLandmark}>Near {pickup.landmark}</Text>
          )}
        </View>
        <ChevronRight size={20} color={Colors.textTertiary} />
      </TouchableOpacity>

      <View style={styles.routeLine}>
        <View style={styles.routeDot} />
        <View style={styles.routeDot} />
        <View style={styles.routeDot} />
      </View>

      <TouchableOpacity style={styles.locationCard} activeOpacity={0.8}>
        <View style={[styles.locationIcon, { backgroundColor: Colors.secondary + '15' }]}>
          <MapPin size={20} color={Colors.secondary} />
        </View>
        <View style={styles.locationContent}>
          <Text style={styles.locationLabel}>DROP</Text>
          <Text style={styles.locationAddress}>{drop.address}</Text>
          {drop.landmark && (
            <Text style={styles.locationLandmark}>Near {drop.landmark}</Text>
          )}
        </View>
        <ChevronRight size={20} color={Colors.textTertiary} />
      </TouchableOpacity>

      <Card variant="outlined" style={styles.distanceCard}>
        <View style={styles.distanceRow}>
          <Text style={styles.distanceLabel}>Estimated Distance</Text>
          <Text style={styles.distanceValue}>18.5 km</Text>
        </View>
        <View style={styles.distanceRow}>
          <Text style={styles.distanceLabel}>Estimated Duration</Text>
          <Text style={styles.distanceValue}>45 mins</Text>
        </View>
      </Card>
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Text style={styles.stepTitle}>Load Details</Text>
      <Text style={styles.stepSubtitle}>Tell us about your goods</Text>

      <TouchableOpacity
        style={styles.selectButton}
        onPress={() => setShowGoodsModal(true)}
      >
        <Package size={20} color={Colors.textTertiary} />
        <Text style={[styles.selectButtonText, goodsType && styles.selectButtonTextSelected]}>
          {goodsType || 'Select Goods Type'}
        </Text>
        <ChevronDown size={20} color={Colors.textTertiary} />
      </TouchableOpacity>

      <Input
        label="Weight (in kg)"
        placeholder="Enter weight"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
        leftIcon={<Scale size={20} color={Colors.textTertiary} />}
      />

      <Text style={styles.vehicleTitle}>Select Vehicle Type</Text>
      <View style={styles.vehicleGrid}>
        {(Object.keys(VEHICLE_TYPES) as VehicleType[]).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.vehicleCard,
              vehicleType === type && styles.vehicleCardSelected,
            ]}
            onPress={() => setVehicleType(type)}
          >
            <Truck
              size={28}
              color={vehicleType === type ? Colors.primary : Colors.textTertiary}
            />
            <Text style={[
              styles.vehicleName,
              vehicleType === type && styles.vehicleNameSelected,
            ]}>
              {VEHICLE_TYPES[type].name}
            </Text>
            <Text style={styles.vehicleCapacity}>{VEHICLE_TYPES[type].capacity}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Card variant="elevated" style={styles.priceCard}>
        <Text style={styles.priceLabel}>Estimated Price</Text>
        <Text style={styles.priceValue}>{formatCurrency(estimatedPrice)}</Text>
        <Text style={styles.priceNote}>Final price may vary based on actual distance</Text>
      </Card>
    </Animated.View>
  );

  const renderStep3 = () => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Text style={styles.stepTitle}>Select Driver</Text>
      <Text style={styles.stepSubtitle}>Choose from available drivers nearby</Text>

      {MOCK_NEARBY_DRIVERS.filter(d => d.vehicleType === vehicleType || true).map((driver) => (
        <DriverCard
          key={driver.id}
          driver={driver}
          distance={2.5 + Math.random() * 5}
          selected={selectedDriver === driver.id}
          onPress={() => setSelectedDriver(driver.id)}
        />
      ))}
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => step > 1 ? setStep(step - 1) : router.back()}
        >
          <X size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post Load</Text>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>{step}/3</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={step === 3 ? 'Confirm & Pay' : 'Continue'}
          onPress={handleNext}
          size="large"
          disabled={step === 2 && (!goodsType || !weight)}
        />
      </View>

      <Modal
        visible={showGoodsModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowGoodsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Goods Type</Text>
              <TouchableOpacity onPress={() => setShowGoodsModal(false)}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={GOODS_TYPES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    goodsType === item && styles.modalItemSelected,
                  ]}
                  onPress={() => {
                    setGoodsType(item);
                    setShowGoodsModal(false);
                  }}
                >
                  <Text style={[
                    styles.modalItemText,
                    goodsType === item && styles.modalItemTextSelected,
                  ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
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
  },
  backButton: {
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
  stepIndicator: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  stepText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  progressContainer: {
    height: 4,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
    borderRadius: 2,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 14,
  },
  locationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationContent: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.textTertiary,
    letterSpacing: 1,
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  locationLandmark: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  routeLine: {
    alignItems: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  routeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
  },
  distanceCard: {
    marginTop: 20,
    gap: 12,
  },
  distanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distanceLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  distanceValue: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    gap: 12,
  },
  selectButtonText: {
    flex: 1,
    fontSize: 16,
    color: Colors.textTertiary,
  },
  selectButtonTextSelected: {
    color: Colors.text,
  },
  vehicleTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text,
    marginTop: 8,
    marginBottom: 12,
  },
  vehicleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  vehicleCard: {
    width: '31%',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  vehicleCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  vehicleName: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  vehicleNameSelected: {
    color: Colors.primary,
  },
  vehicleCapacity: {
    fontSize: 10,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  priceCard: {
    alignItems: 'center',
    backgroundColor: Colors.primary + '10',
    borderColor: Colors.primary + '30',
  },
  priceLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  priceNote: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 4,
  },
  footer: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalItemSelected: {
    backgroundColor: Colors.primary + '10',
  },
  modalItemText: {
    fontSize: 16,
    color: Colors.text,
  },
  modalItemTextSelected: {
    color: Colors.primary,
    fontWeight: '600' as const,
  },
});
