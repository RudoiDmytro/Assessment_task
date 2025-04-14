export interface Member {
  id: string
  name: string
  email: string
  phone: string
  address: string
  borrowedBooks: {
    ISBN: string
    title: string
    borrowDate?: Date
  }[]
  createdAt: string
  updatedAt: string
} 