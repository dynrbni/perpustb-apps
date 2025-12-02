import React from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useLibrary } from '../../context/LibraryContext';
import { BookCard } from '../../components/BookCard';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { books, addToWishlist, removeFromWishlist, isInWishlist, borrowedBooks } = useLibrary();
  const insets = useSafeAreaInsets();

  const featuredBooks = books.slice(0, 5);
  const popularBooks = books.slice(5, 10);
  
  // Calculate stats
  const totalBooks = books.length;
  const dipinjam = borrowedBooks.length;
  
  // Calculate terlambat (overdue)
  const today = new Date();
  const terlambat = borrowedBooks.filter(book => {
    const returnDate = new Date(book.returnDate);
    return today > returnDate;
  }).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <View>
            <Text style={styles.greeting}>Halo, {user?.name} 👋</Text>
            <Text style={styles.subtitle}>Temukan buku favoritmu</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#1E293B" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => router.push('/(tabs)/catalog')}
        >
          <Ionicons name="search-outline" size={20} color="#94A3B8" />
          <Text style={styles.searchText}>Cari judul buku atau penulis...</Text>
        </TouchableOpacity>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="library" size={24} color="#2563EB" />
            </View>
            <Text style={styles.statNumber}>{totalBooks}</Text>
            <Text style={styles.statLabel}>Total Buku</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="bookmarks" size={24} color="#10B981" />
            </View>
            <Text style={styles.statNumber}>{dipinjam}</Text>
            <Text style={styles.statLabel}>Dipinjam</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="alert-circle" size={24} color="#EF4444" />
            </View>
            <Text style={styles.statNumber}>{terlambat}</Text>
            <Text style={styles.statLabel}>Terlambat</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Buku Pilihan</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/catalog')}>
              <Text style={styles.seeAllText}>Lihat Semua →</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={featuredBooks}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <BookCard
                book={item}
                onPress={() => router.push(`/book/${item.id}`)}
                onWishlistPress={() => {
                  if (isInWishlist(item.id)) {
                    removeFromWishlist(item.id);
                  } else {
                    addToWishlist(item.id);
                  }
                }}
                isInWishlist={isInWishlist(item.id)}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sedang Populer</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/catalog')}>
              <Text style={styles.seeAllText}>Lihat Semua →</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={popularBooks}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <BookCard
                book={item}
                onPress={() => router.push(`/book/${item.id}`)}
                onWishlistPress={() => {
                  if (isInWishlist(item.id)) {
                    removeFromWishlist(item.id);
                  } else {
                    addToWishlist(item.id);
                  }
                }}
                isInWishlist={isInWishlist(item.id)}
              />
            )}
            keyExtractor={(item) => item.id}
          />
        </View>

        <TouchableOpacity 
          style={styles.banner}
          onPress={() => router.push('/(tabs)/catalog')}
        >
          <View style={styles.bannerIcon}>
            <Ionicons name="star" size={28} color="#F59E0B" />
          </View>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Jelajahi Koleksi Lengkap</Text>
            <Text style={styles.bannerSubtitle}>Ribuan buku menanti untuk dibaca</Text>
          </View>
          <Ionicons name="arrow-forward" size={24} color="#2563EB" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 110,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  notificationButton: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 24,
  },
  searchText: {
    marginLeft: 12,
    color: '#94A3B8',
    fontSize: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  seeAllText: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 14,
  },
  listContainer: {
    paddingLeft: 20,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  bannerIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#64748B',
  },
});
