export type UserRole = 'customer' | 'driver';

export type TripStatus = 
  | 'pending' 
  | 'accepted' 
  | 'pickup_started' 
  | 'goods_collected' 
  | 'in_transit' 
  | 'arrived' 
  | 'delivered' 
  | 'completed' 
  | 'cancelled';

export type PaymentStatus = 'pending' | 'advance_paid' | 'completed' | 'failed' | 'refunded';

export type VehicleType = 'mini_truck' | 'pickup' | 'tata_ace' | 'eicher' | 'container' | 'trailer';

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  landmark?: string;
  city?: string;
  pincode?: string;
}

export interface User {
  id: string;
  phone: string;
  name: string;
  email?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  isVerified: boolean;
}

export interface Driver extends User {
  vehicleType: VehicleType;
  vehicleNumber: string;
  licenseNumber: string;
  isAvailable: boolean;
  currentLocation?: Location;
  rating: number;
  totalTrips: number;
  documents: {
    license: boolean;
    rc: boolean;
    insurance: boolean;
    aadhar: boolean;
  };
}

export interface Load {
  id: string;
  customerId: string;
  pickup: Location;
  drop: Location;
  goodsType: string;
  weight: number;
  description?: string;
  vehiclePreference: VehicleType;
  estimatedPrice: number;
  scheduledTime?: string;
  createdAt: string;
}

export interface Trip {
  id: string;
  loadId: string;
  customerId: string;
  driverId: string;
  driver?: Driver;
  pickup: Location;
  drop: Location;
  goodsType: string;
  weight: number;
  status: TripStatus;
  price: number;
  advanceAmount: number;
  distance: number;
  estimatedDuration: number;
  pickupOtp?: string;
  deliveryOtp?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  currentDriverLocation?: Location;
}

export interface Payment {
  id: string;
  tripId: string;
  amount: number;
  status: PaymentStatus;
  method: 'upi' | 'card' | 'wallet' | 'cash';
  transactionId?: string;
  paidAt?: string;
  createdAt: string;
}

export interface Earnings {
  today: number;
  week: number;
  month: number;
  total: number;
  pendingPayout: number;
  transactions: EarningTransaction[];
}

export interface EarningTransaction {
  id: string;
  tripId: string;
  amount: number;
  type: 'trip_earning' | 'bonus' | 'payout' | 'deduction';
  status: 'credited' | 'pending' | 'withdrawn';
  description: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'trip' | 'payment' | 'promo' | 'system';
  isRead: boolean;
  data?: Record<string, unknown>;
  createdAt: string;
}

export const VEHICLE_TYPES: Record<VehicleType, { name: string; capacity: string; icon: string }> = {
  mini_truck: { name: 'Mini Truck', capacity: '500 kg', icon: 'truck' },
  pickup: { name: 'Pickup', capacity: '750 kg', icon: 'truck' },
  tata_ace: { name: 'Tata Ace', capacity: '1 Ton', icon: 'truck' },
  eicher: { name: 'Eicher', capacity: '2-4 Tons', icon: 'truck' },
  container: { name: 'Container', capacity: '7-10 Tons', icon: 'container' },
  trailer: { name: 'Trailer', capacity: '15+ Tons', icon: 'truck' },
};

export const TRIP_STATUS_CONFIG: Record<TripStatus, { label: string; color: string }> = {
  pending: { label: 'Pending', color: '#F59E0B' },
  accepted: { label: 'Accepted', color: '#3B82F6' },
  pickup_started: { label: 'Driver En Route', color: '#8B5CF6' },
  goods_collected: { label: 'Goods Collected', color: '#10B981' },
  in_transit: { label: 'In Transit', color: '#0F4C81' },
  arrived: { label: 'Arrived', color: '#10B981' },
  delivered: { label: 'Delivered', color: '#10B981' },
  completed: { label: 'Completed', color: '#10B981' },
  cancelled: { label: 'Cancelled', color: '#EF4444' },
};
