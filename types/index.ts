export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  description: string;
  category: string;
  isbn: string;
  publishYear: number;
  available: boolean;
}

export interface User {
  id: string;
  nipd: string;
  name: string;
  email: string;
}

export interface BorrowedBook extends Book {
  borrowDate: string;
  returnDate: string;
  status: 'dipinjam' | 'dikembalikan';
}

export interface WishlistItem {
  bookId: string;
  addedDate: string;
}
