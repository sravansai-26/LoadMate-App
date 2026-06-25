import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your new permanent cloud backend URL
const BASE_URL = "https://smart-loadmate-backend.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token automatically
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('loadmate_auth_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const authApi = {
  requestOtp: (phoneNumber: string) =>
    api.post('/auth/request-otp', {
      phone_number: phoneNumber,
    }),

  verifyOtp: (
    phoneNumber: string,
    otpCode: string,
    fullName?: string,
    role?: string
  ) =>
    api.post('/auth/verify-otp', {
      phone_number: phoneNumber,
      otp_code: otpCode,
      full_name: fullName,
      role: role,
    }),
};

export default api;