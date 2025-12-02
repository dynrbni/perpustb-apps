import React from 'react';
import { View, Text, FlatList, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLibrary } from '../../context/LibraryContext';
import { BookCard } from '../../components/BookCard';

export default function WishlistScreen() {
  const router = useRouter();
  const { books, removeFromWishlist, isInWishlist } = useLibrary();
  const insets = useSafeAreaInsets();

  const wishlistBooks = books.filter(book => isInWishlist(book.id));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>Buku Favorit</Text>
        <Text style={styles.headerSubtitle}>{wishlistBooks.length} buku tersimpan</Text>
      </View>

      <FlatList
        data={wishlistBooks}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={wishlistBooks.length > 0 ? styles.row : undefined}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.bookWrapper}>
            <BookCard
              book={item}
              onPress={() => router.push(`/book/${item.id}`)}
              onWishlistPress={() => removeFromWishlist(item.id)}
              isInWishlist={true}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="heart-outline" size={64} color="#2563EB" />
            </View>
            <Text style={styles.emptyText}>Belum ada buku favorit</Text>
            <Text style={styles.emptySubtext}>
              Tekan ikon hati pada buku untuk{'\n'}menambahkan ke favorit
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  bookWrapper: {
    width: '48%',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyText: {
    color: '#1E293B',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#64748B',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
