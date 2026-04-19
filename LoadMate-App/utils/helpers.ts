/**
 * Utility functions for formatting, calculations, and common operations
 */

/**
 * Formats a number as Indian Rupees (e.g., ₹1,23,456)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats distance in km or meters
 */
export function formatDistance(km: number): string {
  if (isNaN(km) || km < 0) return '0 km';
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

/**
 * Formats duration in hours and minutes
 */
export function formatDuration(minutes: number): string {
  if (isNaN(minutes) || minutes < 0) return '0 min';
  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Formats date in Indian style (e.g., 18 Feb 2026)
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Formats time in 12-hour format (e.g., 07:37 PM)
 */
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Combines date and time
 */
export function formatDateTime(dateString: string): string {
  return `${formatDate(dateString)}, ${formatTime(dateString)}`;
}

/**
 * Formats Indian phone number (10 digits) → 12345 67890
 */
export function formatPhone(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone; // return as-is if not 10 digits
}

/**
 * Masks phone number for privacy (e.g., 91****6789)
 */
export function maskPhone(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length >= 10) {
    return `${cleaned.slice(0, 2)}****${cleaned.slice(-4)}`;
  }
  return phone;
}

/**
 * Generates a 6-digit OTP (for demo purposes)
 */
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Calculates estimated price based on distance and vehicle type
 */
export function calculateEstimatedPrice(distanceKm: number, vehicleType: string): number {
  const baseRates: Record<string, number> = {
    mini_truck: 15,
    pickup: 18,
    tata_ace: 20,
    eicher: 25,
    container: 35,
    trailer: 45,
  };

  const rate = baseRates[vehicleType] ?? 20;
  const baseCharge = 200;
  return Math.round(baseCharge + distanceKm * rate);
}

/**
 * Gets user initials (first two letters)
 */
export function getInitials(name: string): string {
  if (!name?.trim()) return '??';
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Truncates text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Generates a random short ID
 */
export function getRandomId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

/**
 * Calculates straight-line distance between two lat/lng points (in km)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if ([lat1, lon1, lat2, lon2].some(isNaN)) return 0;
  
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}