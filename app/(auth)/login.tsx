import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
  const [nipd, setNipd] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!nipd || !password) {
      Alert.alert('Error', 'Silakan isi NIPD dan password');
      return;
    }

    setIsLoading(true);
    const success = await login(nipd, password);
    setIsLoading(false);

    if (success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Login Gagal', 'NIPD atau password salah. Silakan coba lagi atau daftar akun baru.');
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
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Ionicons name="library" size={48} color="#2563EB" />
              </View>
              <Text style={styles.title}>Selamat Datang</Text>
              <Text style={styles.subtitle}>Masuk ke akun Anda untuk melanjutkan</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>NIPD</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="card-outline" size={20} color="#94A3B8" />
                  <TextInput
                    style={styles.input}
                    placeholder="Masukkan NIPD Anda"
                    placeholderTextColor="#94A3B8"
                    value={nipd}
                    onChangeText={setNipd}
                    keyboardType="number-pad"
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
                    placeholder="Masukkan password"
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

              <TouchableOpacity 
                onPress={handleLogin} 
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.loginButtonText}>Masuk</Text>
                )}
              </TouchableOpacity>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Belum punya akun? </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/register')} disabled={isLoading}>
                  <Text style={styles.footerLink}>Daftar Sekarang</Text>
                </TouchableOpacity>
              </View>
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
    marginBottom: 48,
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
  loginButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  loginButtonText: {
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
