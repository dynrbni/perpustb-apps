import React, { useState } from 'react';
import Animated, { useAnimatedKeyboard, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen() {
  const [nipd, setNipd] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  // Keyboard-aware subtle animations for header and footer
  const keyboard = useAnimatedKeyboard();
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const isOpen = keyboard.height.value > 0;
    return {
      transform: [
        { translateY: withTiming(isOpen ? -16 : 0, { duration: 220 }) },
        { scale: withTiming(isOpen ? 0.96 : 1, { duration: 220 }) },
      ],
      opacity: withTiming(isOpen ? 0.9 : 1, { duration: 220 }),
      marginBottom: withTiming(isOpen ? 24 : 40, { duration: 220 }),
    };
  });
  const footerAnimatedStyle = useAnimatedStyle(() => {
    const isOpen = keyboard.height.value > 0;
    return {
      opacity: withTiming(isOpen ? 0 : 1, { duration: 180 }),
      transform: [{ translateY: withTiming(isOpen ? 10 : 0, { duration: 180 }) }],
    };
  });

  const handleRegister = async () => {
    if (!nipd || !name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Silakan isi semua field');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Format email tidak valid');
      return;
    }

    // Validate NIPD length
    if (nipd.length < 5) {
      Alert.alert('Error', 'NIPD minimal 5 karakter');
      return;
    }

    // Validate name length
    if (name.length < 3) {
      Alert.alert('Error', 'Nama minimal 3 karakter');
      return;
    }

    // Validate password length
    if (password.length < 6) {
      Alert.alert('Error', 'Password minimal 6 karakter');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password tidak cocok');
      return;
    }

    setIsLoading(true);
    const success = await register(nipd, name, email, password);
    setIsLoading(false);

    if (success) {
      Alert.alert(
        'Berhasil! 🎉',
        'Akun Anda berhasil dibuat. Selamat datang di PERPUSTB!',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } else {
      Alert.alert('Registrasi Gagal', 'NIPD sudah terdaftar. Silakan gunakan NIPD lain atau login.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollView} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Animated.View style={[styles.header, headerAnimatedStyle]}>
              <View style={styles.logoContainer}>
                <Ionicons name="library" size={48} color="#2563EB" />
              </View>
              <Text style={styles.title}>Daftar Akun</Text>
              <Text style={styles.subtitle}>Buat akun baru untuk memulai</Text>
            </Animated.View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>NIPD</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="card-outline" size={20} color="#94A3B8" />
                  <TextInput
                    style={styles.input}
                    placeholder="Nomor Induk Peserta Didik"
                    placeholderTextColor="#94A3B8"
                    value={nipd}
                    onChangeText={setNipd}
                    keyboardType="number-pad"
                    editable={!isLoading}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nama Lengkap</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color="#94A3B8" />
                  <TextInput
                    style={styles.input}
                    placeholder="Nama lengkap Anda"
                    placeholderTextColor="#94A3B8"
                    value={name}
                    onChangeText={setName}
                    editable={!isLoading}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color="#94A3B8" />
                  <TextInput
                    style={styles.input}
                    placeholder="nama@email.com"
                    placeholderTextColor="#94A3B8"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!isLoading}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" />
                  <TextInput
                    style={styles.input}
                    placeholder="Minimal 6 karakter"
                    placeholderTextColor="#94A3B8"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    editable={!isLoading}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons 
                      name={showPassword ? "eye-outline" : "eye-off-outline"} 
                      size={20} 
                      color="#94A3B8" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Konfirmasi Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" />
                  <TextInput
                    style={styles.input}
                    placeholder="Ulangi password"
                    placeholderTextColor="#94A3B8"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                    editable={!isLoading}
                  />
                </View>
              </View>

              <TouchableOpacity 
                onPress={handleRegister} 
                style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.registerButtonText}>Daftar</Text>
                )}
              </TouchableOpacity>

              <Animated.View style={[styles.footer, footerAnimatedStyle]}>
                <Text style={styles.footerText}>Sudah punya akun? </Text>
                <TouchableOpacity onPress={() => router.back()} disabled={isLoading}>
                  <Text style={styles.footerLink}>Masuk</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
  },
  form: {},
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    color: '#1E293B',
    fontSize: 15,
  },
  registerButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  registerButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#64748B',
    fontSize: 14,
  },
  footerLink: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 14,
  },
});
