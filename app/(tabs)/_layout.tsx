import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.95)' : '#FFFFFF',
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          height: 70 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 4,
          paddingHorizontal: 16,
          borderTopWidth: 0.5,
          borderTopColor: 'rgba(226, 232, 240, 0.6)',
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 12,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
          letterSpacing: 0.2,
        },
        tabBarItemStyle: {
          paddingVertical: 6,
          gap: 2,
          borderRadius: 20,
        },
        headerShown: false,
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                <Ionicons 
                  name={focused ? "home" : "home-outline"} 
                  size={22} 
                  color={focused ? '#2563EB' : color}
                />
              </View>
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Katalog',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                <Ionicons 
                  name={focused ? "grid" : "grid-outline"} 
                  size={22} 
                  color={focused ? '#2563EB' : color}
                />
              </View>
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: 'Favorit',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                <Ionicons 
                  name={focused ? "heart" : "heart-outline"} 
                  size={22} 
                  color={focused ? '#2563EB' : color}
                />
              </View>
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="borrowed"
        options={{
          title: 'Pinjaman',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                <Ionicons 
                  name={focused ? "bookmarks" : "bookmarks-outline"} 
                  size={22} 
                  color={focused ? '#2563EB' : color}
                />
              </View>
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
              <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
                <Ionicons 
                  name={focused ? "person" : "person-outline"} 
                  size={22} 
                  color={focused ? '#2563EB' : color}
                />
              </View>
              {focused && <View style={styles.activeIndicator} />}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconWrapperActive: {
    transform: [{ scale: 1.05 }],
  },
  iconContainer: {
    width: 52,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  iconContainerActive: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -10,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2563EB',
  },
});