'use server'

import { Borrowing } from '@/types/borrowing'
import { API_URL } from '@/config/api'

export async function borrowBook(formData: FormData): Promise<Borrowing> {
  const borrowing = {
    memberId: formData.get('memberId'),
    ISBN: formData.get('ISBN'),
  }

  const res = await fetch(`${API_URL}/borrowings/borrow`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(borrowing),
  })

  if (!res.ok) {
    throw new Error('Failed to borrow book')
  }

  return res.json()
}

export async function returnBook(formData: FormData): Promise<void> {
  const borrowing = {
    memberId: formData.get('memberId'),
    ISBN: formData.get('ISBN'),
  }

  const res = await fetch(`${API_URL}/borrowings/return`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(borrowing),
  })

  if (!res.ok) {
    throw new Error('Failed to return book')
  }
}

export async function getMemberBorrowingHistory(memberId: string): Promise<Borrowing[]> {
  const res = await fetch(`${API_URL}/borrowings/member/${memberId}/history`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch borrowing history')
  }

  return res.json()
}

export async function getOverdueBooks(): Promise<Borrowing[]> {
  const res = await fetch(`${API_URL}/borrowings/overdue`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch overdue books')
  }

  return res.json()
} 