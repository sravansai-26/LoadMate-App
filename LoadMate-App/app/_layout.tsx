import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { AppProvider, useApp } from "@/context/AppContext";

const queryClient = new QueryClient();

function RootNavigation() {
  const { isAuthenticated, isLoading, user } = useApp();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // 1. Wait until AppContext finishes reading from AsyncStorage
    if (isLoading) return;

    // 2. Determine the path and group safely
    const currentSegments = segments as string[];
    const inAuthGroup = currentSegments.join('/').includes('(auth)');
    const isSplash = currentSegments.length === 0;

    // 3. The Logic that Fixes the Redirection
    if (!isAuthenticated) {
      // ONLY force to login if we aren't in (auth) and NOT on the splash screen
      if (!inAuthGroup && !isSplash) {
        router.replace("/(auth)/login");
      }
    } else if (isAuthenticated) {
      // If logged in, move to the correct dashboard based on role
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
          <RootNavigation />
        </AppProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}