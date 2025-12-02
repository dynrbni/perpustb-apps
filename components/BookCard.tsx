import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
  onPress: () => void;
  onWishlistPress?: () => void;
  isInWishlist?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onPress, onWishlistPress, isInWishlist }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={styles.container}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: book.cover }}
          style={styles.image}
          resizeMode="cover"
        />
        {onWishlistPress && (
          <TouchableOpacity 
            onPress={onWishlistPress}
            style={styles.wishlistButton}
          >
            <Ionicons
              name={isInWishlist ? 'heart' : 'heart-outline'}
              size={18}
              color={isInWishlist ? '#EF4444' : '#FFFFFF'}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {book.author}
        </Text>
        <View style={styles.footer}>
          <View style={[styles.badge, book.available ? styles.badgeAvailable : styles.badgeUnavailable]}>
            <View style={[styles.badgeDot, book.available ? styles.dotAvailable : styles.dotUnavailable]} />
            <Text style={[styles.badgeText, book.available ? styles.badgeTextAvailable : styles.badgeTextUnavailable]}>
              {book.available ? 'Tersedia' : 'Dipinjam'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginRight: 16,
    width: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 220,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  wishlistButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 12,
  },
  title: {
    fontWeight: '600',
    color: '#1E293B',
    fontSize: 14,
    marginBottom: 4,
  },
  author: {
    color: '#64748B',
    fontSize: 12,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeAvailable: {
    backgroundColor: '#ECFDF5',
  },
  badgeUnavailable: {
    backgroundColor: '#FEF2F2',
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  dotAvailable: {
    backgroundColor: '#10B981',
  },
  dotUnavailable: {
    backgroundColor: '#EF4444',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  badgeTextAvailable: {
    color: '#059669',
  },
  badgeTextUnavailable: {
    color: '#DC2626',
  },
});
