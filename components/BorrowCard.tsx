import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BorrowedBook } from '../types';

interface BorrowCardProps {
  book: BorrowedBook;
  onReturn: () => void;
}

export const BorrowCard: React.FC<BorrowCardProps> = ({ book, onReturn }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getDaysLeft = () => {
    const returnDate = new Date(book.returnDate);
    const today = new Date();
    const diffTime = returnDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysLeft();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={{ uri: book.cover }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>
            {book.title}
          </Text>
          <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
          
          <View style={styles.dateContainer}>
            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={14} color="#64748B" />
              <Text style={styles.dateText}>Dipinjam: {formatDate(book.borrowDate)}</Text>
            </View>
            <View style={styles.dateRow}>
              <Ionicons name="time-outline" size={14} color="#64748B" />
              <Text style={styles.dateText}>Kembali: {formatDate(book.returnDate)}</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <View style={[styles.daysLeftBadge, daysLeft <= 3 && styles.daysLeftBadgeWarning]}>
              <Text style={[styles.daysLeftText, daysLeft <= 3 && styles.daysLeftTextWarning]}>
                {daysLeft} hari lagi
              </Text>
            </View>
            <TouchableOpacity
              onPress={onReturn}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Kembalikan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    padding: 16,
  },
  image: {
    width: 80,
    height: 120,
    borderRadius: 12,
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontWeight: '600',
    color: '#1E293B',
    fontSize: 16,
    marginBottom: 4,
  },
  author: {
    color: '#64748B',
    fontSize: 13,
    marginBottom: 12,
  },
  dateContainer: {
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 6,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  daysLeftBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  daysLeftBadgeWarning: {
    backgroundColor: '#FEF2F2',
  },
  daysLeftText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  daysLeftTextWarning: {
    color: '#EF4444',
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
