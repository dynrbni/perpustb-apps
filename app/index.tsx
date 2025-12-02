import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withSequence,
  withTiming,
  withRepeat,
  withDelay,
  Easing,
  interpolate
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleScale = useSharedValue(0.5);
  const subtitleOpacity = useSharedValue(0);
  const wave1 = useSharedValue(0);
  const wave2 = useSharedValue(0);
  const wave3 = useSharedValue(0);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotate.value}deg` }
      ],
      opacity: opacity.value,
    };
  });

  const titleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
      transform: [
        { scale: titleScale.value },
        { translateY: withTiming(titleOpacity.value === 1 ? 0 : 30) }
      ]
    };
  });

  const subtitleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: subtitleOpacity.value,
      transform: [{ translateY: withTiming(subtitleOpacity.value === 1 ? 0 : 20) }]
    };
  });

  const wave1Style = useAnimatedStyle(() => {
    return {
      transform: [{ scale: wave1.value }],
      opacity: interpolate(wave1.value, [0, 0.5, 1], [0, 0.3, 0]),
    };
  });

  const wave2Style = useAnimatedStyle(() => {
    return {
      transform: [{ scale: wave2.value }],
      opacity: interpolate(wave2.value, [0, 0.5, 1], [0, 0.3, 0]),
    };
  });

  const wave3Style = useAnimatedStyle(() => {
    return {
      transform: [{ scale: wave3.value }],
      opacity: interpolate(wave3.value, [0, 0.5, 1], [0, 0.3, 0]),
    };
  });

  useEffect(() => {
    // Logo animation with bounce
    scale.value = withSequence(
      withSpring(1.3, { damping: 5, stiffness: 100 }),
      withSpring(1, { damping: 8, stiffness: 100 })
    );
    opacity.value = withTiming(1, { duration: 600 });
    
    // Continuous subtle rotation
    rotate.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1,
      false
    );

    // Title animation with scale
    setTimeout(() => {
      titleOpacity.value = withTiming(1, { duration: 600 });
      titleScale.value = withSpring(1, { damping: 10 });
    }, 400);

    // Subtitle animation
    setTimeout(() => {
      subtitleOpacity.value = withTiming(1, { duration: 600 });
    }, 700);

    // Wave animations (ripple effect)
    setTimeout(() => {
      wave1.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }),
        -1,
        false
      );
    }, 1000);

    setTimeout(() => {
      wave2.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }),
        -1,
        false
      );
    }, 1400);

    setTimeout(() => {
      wave3.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }),
        -1,
        false
      );
    }, 1800);

    const timer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#EFF6FF', '#FFFFFF', '#EFF6FF']}
      style={styles.container}
    >
      {/* Animated waves */}
      <Animated.View style={[styles.wave, wave1Style]} />
      <Animated.View style={[styles.wave, wave2Style, { borderColor: '#60A5FA' }]} />
      <Animated.View style={[styles.wave, wave3Style, { borderColor: '#93C5FD' }]} />

      {/* Logo */}
      <Animated.View style={logoAnimatedStyle}>
        <View style={styles.logoContainer}>
          <Ionicons name="library" size={72} color="#2563EB" />
        </View>
      </Animated.View>
      
      {/* Title */}
      <Animated.View style={titleAnimatedStyle}>
        <Text style={styles.title}>PERPUSTB</Text>
      </Animated.View>
      
      {/* Subtitle */}
      <Animated.View style={subtitleAnimatedStyle}>
        <Text style={styles.subtitle}>Perpustakaan Digital Modern</Text>
      </Animated.View>

      {/* Loading indicator */}
      <View style={styles.loadingContainer}>
        {[0, 1, 2].map((i) => (
          <Animated.View 
            key={i}
            style={[
              styles.loadingDot,
              {
                opacity: withRepeat(
                  withDelay(
                    i * 200,
                    withSequence(
                      withTiming(1, { duration: 400 }),
                      withTiming(0.3, { duration: 400 })
                    )
                  ),
                  -1,
                  true
                ),
              },
            ]}
          />
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wave: {
    position: 'absolute',
    width: width * 2,
    height: width * 2,
    borderRadius: width,
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  logoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 32,
    marginBottom: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    color: '#1E293B',
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 24,
  },
  subtitle: {
    color: '#64748B',
    fontSize: 16,
    marginTop: 12,
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    marginTop: 60,
    gap: 10,
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },
});
