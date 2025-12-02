import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, StyleSheet, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLibrary } from '../../context/LibraryContext';

export default function BookDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { books, addToWishlist, removeFromWishlist, isInWishlist } = useLibrary();

  const book = books.find(b => b.id === id);

  if (!book) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#CBD5E1" />
        <Text style={styles.errorText}>Buku tidak ditemukan</Text>
      </View>
    );
  }

  const handleBorrow = () => {
    if (!book.available) {
      Alert.alert('Tidak Tersedia', 'Buku ini sedang dipinjam oleh pengguna lain');
      return;
    }
    router.push({
      pathname: '/borrow/confirm',
      params: { bookId: book.id },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        bounces={true}
      >
        {/* Hero Section with Book Cover */}
        <View style={styles.heroSection}>
          <Image
            source={{ uri: book.cover }}
            style={styles.coverImage}
            resizeMode="cover"
          />
          
          {/* Gradient Overlay at Bottom */}
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
            style={styles.gradientOverlay}
            locations={[0, 0.6, 1]}
          />
        </View>

        {/* Content Card */}
        <View style={styles.contentCard}>
          {/* Title & Author */}
          <View style={styles.titleSection}>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <View style={styles.authorRow}>
              <Ionicons name="person-circle-outline" size={18} color="#64748B" />
              <Text style={styles.bookAuthor}>{book.author}</Text>
            </View>
          </View>

          {/* Availability Badge */}
          <View style={[
            styles.availabilityBadge,
            book.available ? styles.availableBadge : styles.unavailableBadge
          ]}>
            <Ionicons 
              name={book.available ? 'checkmark-circle' : 'close-circle'} 
              size={18} 
              color={book.available ? '#10B981' : '#EF4444'} 
            />
            <Text style={[
              styles.badgeText,
              book.available ? styles.availableText : styles.unavailableText
            ]}>
              {book.available ? 'Tersedia' : 'Sedang Dipinjam'}
            </Text>
          </View>

          {/* Info Cards Grid */}
          <View style={styles.infoGrid}>
            <View style={[styles.infoCard, { backgroundColor: '#EFF6FF' }]}>
              <View style={[styles.iconCircle, { backgroundColor: '#3B82F6' }]}>
                <Ionicons name="apps" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.infoLabel}>Kategori</Text>
              <Text style={styles.infoValue} numberOfLines={1}>{book.category}</Text>
            </View>

            <View style={[styles.infoCard, { backgroundColor: '#F0FDF4' }]}>
              <View style={[styles.iconCircle, { backgroundColor: '#10B981' }]}>
                <Ionicons name="calendar" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.infoLabel}>Tahun</Text>
              <Text style={styles.infoValue}>{book.publishYear}</Text>
            </View>

            <View style={[styles.infoCard, { backgroundColor: '#FEF3C7' }]}>
              <View style={[styles.iconCircle, { backgroundColor: '#F59E0B' }]}>
                <Ionicons name="barcode" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.infoLabel}>ISBN</Text>
              <Text style={styles.infoValue} numberOfLines={1}>{book.isbn}</Text>
            </View>
          </View>

          {/* Synopsis Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconBox}>
                <Ionicons name="document-text-outline" size={20} color="#3B82F6" />
              </View>
              <Text style={styles.sectionTitle}>Sinopsis</Text>
            </View>
            <Text style={styles.synopsis}>{book.description}</Text>
          </View>

          {/* Info Tips */}
          <View style={styles.tipsCard}>
            <View style={styles.tipRow}>
              <View style={styles.tipIcon}>
                <Ionicons name="time-outline" size={18} color="#3B82F6" />
              </View>
              <Text style={styles.tipText}>Peminjaman maksimal 30 hari</Text>
            </View>
            <View style={styles.tipRow}>
              <View style={styles.tipIcon}>
                <Ionicons name="shield-checkmark-outline" size={18} color="#10B981" />
              </View>
              <Text style={styles.tipText}>Jaga buku dengan baik selama peminjaman</Text>
            </View>
            <View style={styles.tipRow}>
              <View style={styles.tipIcon}>
                <Ionicons name="cash-outline" size={18} color="#F59E0B" />
              </View>
              <Text style={styles.tipText}>Denda Rp 1.000/hari jika terlambat</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          onPress={handleBorrow}
          disabled={!book.available}
          style={styles.borrowButton}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={book.available ? ['#3B82F6', '#2563EB'] : ['#94A3B8', '#64748B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.borrowButtonGradient}
          >
            <Ionicons name="bookmark" size={22} color="#FFFFFF" />
            <Text style={styles.borrowButtonText}>
              {book.available ? 'Pinjam Buku' : 'Tidak Tersedia'}
            </Text>
            {book.available && <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
    fontWeight: '600',
  },

  // Hero Section
  heroSection: {
    height: 500,
    position: 'relative',
    width: '100%',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },

  // Content Card
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    paddingTop: 28,
    paddingHorizontal: 20,
  },

  // Title Section
  titleSection: {
    marginBottom: 20,
  },
  bookTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
    lineHeight: 36,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bookAuthor: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },

  // Availability Badge
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 28,
    gap: 6,
  },
  availableBadge: {
    backgroundColor: '#ECFDF5',
  },
  unavailableBadge: {
    backgroundColor: '#FEF2F2',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  availableText: {
    color: '#059669',
  },
  unavailableText: {
    color: '#DC2626',
  },

  // Info Grid
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  infoCard: {
    flex: 1,
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },

  // Synopsis Section
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  sectionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  synopsis: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
  },

  // Tips Card
  tipsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#64748B',
    flex: 1,
    lineHeight: 20,
  },

  // Floating Button
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    backgroundColor: 'transparent',
  },
  borrowButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  borrowButtonGradient: {
    flexDirection: 'row',
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  borrowButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});