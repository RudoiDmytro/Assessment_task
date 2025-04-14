'use server'

import { Book } from '@/types/book'
import { API_URL } from '@/config/api'
import { revalidatePath } from 'next/cache'

export async function createBook(formData: FormData): Promise<Book> {
  const book = {
    title: formData.get('title'),
    author: formData.get('author'),
    ISBN: formData.get('ISBN'),
    genre: formData.get('genre'),
    totalCopies: Number(formData.get('totalCopies')),
    description: formData.get('description'),
  }

  const res = await fetch(`${API_URL}/books`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(book),
  })

  if (!res.ok) {
    throw new Error('Failed to create book')
  }

  return res.json()
}

export async function updateBook(ISBN: string, formData: FormData) {
  const book = {
    title: formData.get('title'),
    author: formData.get('author'),
    genre: formData.get('genre'),
    totalCopies: parseInt(formData.get('totalCopies') as string),
    description: formData.get('description'),
  }

  const res = await fetch(`${API_URL}/books/${ISBN}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(book),
  })

  if (!res.ok) {
    throw new Error('Failed to update book')
  }

  revalidatePath(`/books/${ISBN}`)
  revalidatePath('/books')
}

export async function deleteBook(ISBN: string): Promise<void> {
  const res = await fetch(`${API_URL}/books/${ISBN}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    throw new Error('Failed to delete book')
  }
} 