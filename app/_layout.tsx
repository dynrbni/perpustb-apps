import 'react-native-reanimated';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { LibraryProvider } from '../context/LibraryContext';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Redirect to tabs if authenticated
      router.replace('/(tabs)');
    }
  }, [user, loading, segments]);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 100);
    }
  }, [loading]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(auth)/register" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="book/[id]" options={{ presentation: 'card', headerShown: true, title: 'Detail Buku' }} />
      <Stack.Screen name="borrow/confirm" options={{ presentation: 'card', headerShown: true, title: 'Konfirmasi Peminjaman' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <LibraryProvider>
        <RootLayoutNav />
      </LibraryProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});
