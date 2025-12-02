import React from 'react';
import { View, Text, FlatList, Alert, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLibrary } from '../../context/LibraryContext';
import { BorrowCard } from '../../components/BorrowCard';

export default function BorrowedScreen() {
  const { borrowedBooks, returnBook } = useLibrary();
  const insets = useSafeAreaInsets();

  const handleReturn = (bookId: string, bookTitle: string) => {
    Alert.alert(
      'Konfirmasi Pengembalian',
      `Apakah Anda yakin ingin mengembalikan "${bookTitle}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Kembalikan',
          onPress: () => {
            returnBook(bookId);
            Alert.alert('Berhasil', 'Buku berhasil dikembalikan');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>Buku Dipinjam</Text>
        <Text style={styles.headerSubtitle}>{borrowedBooks.length} buku aktif</Text>
      </View>

      <FlatList
        data={borrowedBooks}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <BorrowCard
            book={item}
            onReturn={() => handleReturn(item.id, item.title)}
          />
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="bookmarks-outline" size={64} color="#2563EB" />
            </View>
            <Text style={styles.emptyText}>Belum ada buku dipinjam</Text>
            <Text style={styles.emptySubtext}>
              Pinjam buku dari katalog untuk{'\n'}mulai membaca
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
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 20,
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
    paddingTop: 16,
    paddingBottom: 20,
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
