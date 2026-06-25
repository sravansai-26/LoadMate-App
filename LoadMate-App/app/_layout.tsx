import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { AppProvider, useApp } from "@/context/AppContext";
// Import View, StyleSheet, and Platform to manage the web responsiveness
import { View, StyleSheet, Platform } from "react-native";

const queryClient = new QueryClient();

function RootNavigation() {
  const { isAuthenticated, isLoading, user } = useApp();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const currentSegments = segments as string[];
    const inAuthGroup = currentSegments.join('/').includes('(auth)');
    const isSplash = currentSegments.length === 0;

    if (!isAuthenticated) {
      if (!inAuthGroup && !isSplash) {
        router.replace("/(auth)/login");
      }
    } else if (isAuthenticated) {
      if (inAuthGroup || isSplash) {
        if (user?.role === 'driver') {
          router.replace("/(driver)");
        } else {
          router.replace("/(customer)");
        }
      }
    }
  }, [isAuthenticated, isLoading, segments, user?.role]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppProvider>
          <StatusBar style="dark" />
          {/* Apply the global web centering background container */}
          <View style={styles.globalContainer}>
            {/* Apply the conditional phone-frame container */}
            <View style={styles.appContainer}>
              <RootNavigation />
            </View>
          </View>
        </AppProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

// Responsive layout styles targeting ONLY desktop browsers
const styles = StyleSheet.create({
  globalContainer: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#f1f5f9' : 'transparent', // Light background on desktop web browsers
    alignItems: 'center',
    justifyContent: 'center',
  },
  appContainer: {
    flex: 1,
    width: '100%',
    ...Platform.select({
      web: {
        maxWidth: 430, // Normal smartphone layout width
        maxHeight: 900, // Normal smartphone layout height
        borderRadius: 32,
        borderWidth: 10,
        borderColor: '#1e293b', // Sleek dark border acting as the phone bezel
        overflow: 'hidden',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 5,
      },
      default: {}, // Empty default settings ensures native iOS/Android screens stretch to 100% full screen
    }),
  },
});