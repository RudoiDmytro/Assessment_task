export interface Borrowing {
  id: string
  bookId: string
  bookTitle: string
  memberId: string
  memberName: string
  borrowDate: string
  dueDate: string
  returnDate?: string
  createdAt: string
  updatedAt: string
} 