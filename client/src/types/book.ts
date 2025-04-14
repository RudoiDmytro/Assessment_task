export interface Book {
  title: string
  author: string
  ISBN: string
  genre: string
  totalCopies: number
  availableCopies: number
  description?: string
  borrowings?: Array<{
    id: string
    borrowDate: string
    returnDate?: string
  }>
  createdAt: string
  updatedAt: string
} 