import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, StyleSheet, StatusBar, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLibrary } from '../../context/LibraryContext';

export default function BorrowConfirmScreen() {
  const router = useRouter();
  const { bookId } = useLocalSearchParams();
  const { books, borrowBook } = useLibrary();
  
  const book = books.find(b => b.id === bookId);
  
  const [returnDate, setReturnDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 14); // Default 14 hari
    return date;
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  if (!book) {
    return (
      <View style={styles.errorContainer}>
        <Text>Buku tidak ditemukan</Text>
      </View>
    );
  }

  const handleConfirmBorrow = () => {
    // Pass returnDate ke borrowBook
    borrowBook(book, returnDate);
    
    Alert.alert(
      'Berhasil! 🎉',
      `Buku berhasil dipinjam hingga ${formatDate(returnDate)}. Silakan ambil di perpustakaan dalam 2x24 jam.`,
      [
        {
          text: 'OK',
          onPress: () => router.push('/(tabs)/user/borrowed'),
        },
      ]
    );
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setReturnDate(selectedDate);
    }
  };

  const borrowDate = new Date();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getDuration = () => {
    const diffTime = returnDate.getTime() - borrowDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getMinDate = () => {
    const min = new Date();
    min.setDate(min.getDate() + 1); // Minimal besok
    return min;
  };

  const getMaxDate = () => {
    const max = new Date();
    max.setDate(max.getDate() + 30); // Maksimal 30 hari
    return max;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Book Card */}
        <View style={styles.bookCard}>
          <Image
            source={{ uri: book.cover }}
            style={styles.bookImage}
            resizeMode="cover"
          />
          <View style={styles.bookInfo}>
            <Text style={styles.bookTitle} numberOfLines={2}>{book.title}</Text>
            <Text style={styles.bookAuthor} numberOfLines={1}>{book.author}</Text>
            <View style={styles.categoryBadge}>
              <Ionicons name="pricetag" size={12} color="#2563EB" />
              <Text style={styles.categoryText}>{book.category}</Text>
            </View>
          </View>
        </View>

        {/* Date Selection Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pilih Tanggal Pengembalian</Text>
          
          <TouchableOpacity 
            style={styles.dateSelector}
            onPress={() => setShowDatePicker(true)}
          >
            <View style={styles.dateSelectorLeft}>
              <View style={styles.dateIcon}>
                <Ionicons name="calendar" size={24} color="#2563EB" />
              </View>
              <View>
                <Text style={styles.dateLabel}>Tanggal Kembali</Text>
                <Text style={styles.dateValue}>{formatDate(returnDate)}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
          </TouchableOpacity>

          {showDatePicker && (
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                value={returnDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
                minimumDate={getMinDate()}
                maximumDate={getMaxDate()}
                textColor="#1E293B"
              />
              {Platform.OS === 'ios' && (
                <TouchableOpacity 
                  style={styles.doneButton}
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={styles.doneButtonText}>Selesai</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          <View style={styles.durationCard}>
            <Ionicons name="time" size={20} color="#2563EB" />
            <Text style={styles.durationText}>
              Durasi peminjaman: <Text style={styles.durationDays}>{getDuration()} hari</Text>
            </Text>
          </View>
        </View>

        {/* Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ringkasan Peminjaman</Text>
          
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryIconContainer}>
                <Ionicons name="calendar-outline" size={20} color="#2563EB" />
              </View>
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryLabel}>Tanggal Pinjam</Text>
                <Text style={styles.summaryValue}>{formatDate(borrowDate)}</Text>
              </View>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryRow}>
              <View style={styles.summaryIconContainer}>
                <Ionicons name="calendar" size={20} color="#10B981" />
              </View>
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryLabel}>Tanggal Kembali</Text>
                <Text style={styles.summaryValue}>{formatDate(returnDate)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.warningCard}>
            <Ionicons name="warning" size={20} color="#F59E0B" />
            <Text style={styles.warningText}>
              Denda keterlambatan Rp 1.000/hari
            </Text>
          </View>
        </View>

        {/* Terms Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ketentuan Peminjaman</Text>
          <View style={styles.termsCard}>
            {[
              'Buku harus dijaga dengan baik dan dikembalikan dalam kondisi layak',
              'Kembalikan tepat waktu untuk menghindari denda',
              'Dilarang meminjamkan buku ke orang lain',
              'Segera laporkan jika terjadi kerusakan pada buku'
            ].map((term, index) => (
              <View key={index} style={styles.termRow}>
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text style={styles.termText}>{term}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.cancelButton}
        >
          <Text style={styles.cancelButtonText}>Batal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleConfirmBorrow}
          style={styles.confirmButton}
        >
          <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
          <Text style={styles.confirmButtonText}>Konfirmasi</Text>
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
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  bookImage: {
    width: 80,
    height: 120,
    borderRadius: 12,
  },
  bookInfo: {
    flex: 1,
    marginLeft: 16,
  },
  bookTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  bookAuthor: {
    color: '#64748B',
    fontSize: 14,
    marginBottom: 10,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
    marginLeft: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  dateSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dateIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dateLabel: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  datePickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  doneButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  durationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
  },
  durationText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 12,
  },
  durationDays: {
    fontWeight: '700',
    color: '#2563EB',
    fontSize: 16,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 16,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9F5',
    borderRadius: 12,
    padding: 16,
  },
  warningText: {
    fontSize: 14,
    color: '#92400E',
    marginLeft: 12,
    fontWeight: '500',
  },
  termsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  termRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  termText: {
    flex: 1,
    fontSize: 14,
    color: '#475569',
    marginLeft: 12,
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 15,
  },
  confirmButton: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 8,
  },
});