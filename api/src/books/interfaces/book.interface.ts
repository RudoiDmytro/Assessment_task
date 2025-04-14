export interface Book {
  title: string;
  author: string;
  ISBN: string;
  genre: string;
  totalCopies: number;
  availableCopies: number;
  description?: string;
  borrowingHistory: {
    memberId: string;
    borrowDate: Date;
    dueDate: Date;
    returnDate?: Date;
  }[];
} 