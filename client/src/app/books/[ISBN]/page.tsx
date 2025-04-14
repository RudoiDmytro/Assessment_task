'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Book } from '@/types/book'
import { API_URL } from '@/config/api'
import { use } from 'react'

export default function BookPage({ params }: { params: Promise<{ ISBN: string }> }) {
  const resolvedParams = use(params)
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`${API_URL}/books/${resolvedParams.ISBN}`)
        if (!res.ok) throw new Error('Failed to fetch book')
        const data = await res.json()
        setBook(data)
      } catch (error) {
        console.error('Error fetching book:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [resolvedParams.ISBN])

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this book?')) return

    try {
      const res = await fetch(`${API_URL}/books/${resolvedParams.ISBN}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete book')
      router.push('/books')
    } catch (error) {
      console.error('Error deleting book:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (!book) {
    return <div className="text-center py-8">Book not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{book.title}</h1>
        <div className="space-x-4">
          <Link
            href={`/books/${resolvedParams.ISBN}/edit`}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-medium text-gray-700">Author</h2>
          <p className="mt-1">{book.author}</p>
        </div>

        <div>
          <h2 className="text-sm font-medium text-gray-700">ISBN</h2>
          <p className="mt-1">{book.ISBN}</p>
        </div>

        <div>
          <h2 className="text-sm font-medium text-gray-700">Genre</h2>
          <p className="mt-1">{book.genre}</p>
        </div>

        <div>
          <h2 className="text-sm font-medium text-gray-700">Copies</h2>
          <p className="mt-1">
            {book.availableCopies} of {book.totalCopies} available
          </p>
        </div>

        {book.description && (
          <div>
            <h2 className="text-sm font-medium text-gray-700">Description</h2>
            <p className="mt-1">{book.description}</p>
          </div>
        )}
      </div>
    </div>
  )
} 