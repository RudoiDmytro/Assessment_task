export interface Borrowing {
  memberId: string;
  ISBN: string;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
} 