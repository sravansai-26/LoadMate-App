import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import { Language } from "@/constants/translations";
import { User, Driver, Trip } from "@/types";

interface AppState {
  user: User | Driver | null;
  token: string | null; // VITAL for persistent backend authentication
  isAuthenticated: boolean;
  isLoading: boolean;
  language: Language;
  activeTrip: Trip | null;
  isDriverAvailable: boolean;
}

interface AppContextType extends AppState {
  login: (user: User | Driver, token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User | Driver>) => Promise<void>;
  setLanguage: (language: Language) => Promise<void>;
  toggleDriverAvailability: () => Promise<void>;
  setActiveTrip: (trip: Trip | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  USER: "loadmate_user",
  TOKEN: "loadmate_auth_token", // Key for the JWT
  LANGUAGE: "loadmate_language",
  DRIVER_AVAILABLE: "loadmate_driver_available",
};

const SUPPORTED_LANGUAGES: Language[] = ["en", "hi", "te"];

const getSafeLanguage = (stored?: string | null): Language => {
  if (stored && SUPPORTED_LANGUAGES.includes(stored as Language)) {
    return stored as Language;
  }
  return "en";
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    language: "en",
    activeTrip: null,
    isDriverAvailable: false,
  });

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const [userJson, token, storedLanguage, driverAvailable] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.USER),
          AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
          AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
          AsyncStorage.getItem(STORAGE_KEYS.DRIVER_AVAILABLE),
        ]);

        let language: Language = getSafeLanguage(storedLanguage);

        if (!storedLanguage) {
          try {
            const locales = Localization.getLocales();
            const detected = locales[0]?.languageCode;
            if (detected && SUPPORTED_LANGUAGES.includes(detected as Language)) {
              language = detected as Language;
            } else if (detected?.startsWith("en")) {
              language = "en";
            }
          } catch (e) {
            console.warn("Locale detection failed:", e);
          }
        }

        let parsedUser = null;
        if (userJson) {
          try {
            parsedUser = JSON.parse(userJson);
          } catch (e) {
            console.error("Failed to parse stored user:", e);
          }
        }

        setState((prev) => ({
          ...prev,
          user: parsedUser,
          token: token || null,
          isAuthenticated: !!token && !!parsedUser,
          language,
          isDriverAvailable: driverAvailable === "true",
          isLoading: false,
        }));

        if (!storedLanguage) {
          await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
        }
      } catch (e) {
        console.error("Failed to load app state:", e);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    loadStoredData();
  }, []);

  const login = useCallback(async (user: User | Driver, token: string) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
        AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token),
      ]);
      setState((prev) => ({ 
        ...prev, 
        user, 
        token, 
        isAuthenticated: true 
      }));
    } catch (e) {
      console.error("Login storage failed:", e);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.DRIVER_AVAILABLE,
      ]);
      setState((prev) => ({
        ...prev,
        user: null,
        token: null,
        isAuthenticated: false,
        activeTrip: null,
        isDriverAvailable: false,
      }));
    } catch (e) {
      console.error("Logout failed:", e);
    }
  }, []);

  const updateUser = useCallback(
    async (updates: Partial<User | Driver>) => {
      if (!state.user) return;
      const updatedUser = { ...state.user, ...updates };
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      setState((prev) => ({ ...prev, user: updatedUser }));
    },
    [state.user]
  );

  const setLanguage = useCallback(async (language: Language) => {
    const validLanguage = SUPPORTED_LANGUAGES.includes(language) ? language : "en";
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, validLanguage);
    setState((prev) => ({ ...prev, language: validLanguage }));
  }, []);

  const toggleDriverAvailability = useCallback(async () => {
    const newValue = !state.isDriverAvailable;
    await AsyncStorage.setItem(STORAGE_KEYS.DRIVER_AVAILABLE, String(newValue));
    setState((prev) => ({ ...prev, isDriverAvailable: newValue }));
  }, [state.isDriverAvailable]);

  const setActiveTrip = (trip: Trip | null) => {
    setState((prev) => ({ ...prev, activeTrip: trip }));
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        logout,
        updateUser,
        setLanguage,
        toggleDriverAvailability,
        setActiveTrip,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return context;
}