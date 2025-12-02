import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Book, BorrowedBook, WishlistItem } from '../types';
import { booksData } from '../data/books';

interface LibraryContextType {
  books: Book[];
  wishlist: WishlistItem[];
  borrowedBooks: BorrowedBook[];
  addToWishlist: (bookId: string) => void;
  removeFromWishlist: (bookId: string) => void;
  isInWishlist: (bookId: string) => boolean;
  borrowBook: (book: Book, returnDate: Date) => void;
  returnBook: (bookId: string) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider = ({ children }: { children: ReactNode }) => {
  const [books] = useState<Book[]>(booksData);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);

  const addToWishlist = (bookId: string) => {
    if (!isInWishlist(bookId)) {
      setWishlist([...wishlist, { bookId, addedDate: new Date().toISOString() }]);
    }
  };

  const removeFromWishlist = (bookId: string) => {
    setWishlist(wishlist.filter(item => item.bookId !== bookId));
  };

  const isInWishlist = (bookId: string) => {
    return wishlist.some(item => item.bookId === bookId);
  };

  const borrowBook = (book: Book, returnDate: Date) => {
    const borrowDate = new Date();
    
    const borrowedBook: BorrowedBook = {
      ...book,
      borrowDate: borrowDate.toISOString(),
      returnDate: returnDate.toISOString(),
      status: 'dipinjam',
    };

    setBorrowedBooks([...borrowedBooks, borrowedBook]);
  };

  const returnBook = (bookId: string) => {
    setBorrowedBooks(borrowedBooks.filter(book => book.id !== bookId));
  };

  return (
    <LibraryContext.Provider
      value={{
        books,
        wishlist,
        borrowedBooks,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        borrowBook,
        returnBook,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};