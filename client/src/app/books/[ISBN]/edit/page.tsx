'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Book } from '@/types/book'
import { API_URL } from '@/config/api'
import { use } from 'react'

export default function EditBookPage({ params }: { params: Promise<{ ISBN: string }> }) {
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

  const handleSubmit = async (formData: FormData) => {
    try {
      const res = await fetch(`${API_URL}/books/${resolvedParams.ISBN}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.get('title'),
          author: formData.get('author'),
          genre: formData.get('genre'),
          totalCopies: parseInt(formData.get('totalCopies') as string),
          description: formData.get('description'),
        }),
      })

      if (!res.ok) throw new Error('Failed to update book')
      router.push(`/books/${resolvedParams.ISBN}`)
    } catch (error) {
      console.error('Error updating book:', error)
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
        <h1 className="text-2xl font-bold">Edit Book</h1>
        <Link
          href={`/books/${resolvedParams.ISBN}`}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </Link>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            defaultValue={book.title}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            defaultValue={book.author}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="ISBN" className="block text-sm font-medium text-gray-700">
            ISBN
          </label>
          <input
            type="text"
            id="ISBN"
            value={book.ISBN}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
            Genre
          </label>
          <input
            type="text"
            id="genre"
            name="genre"
            defaultValue={book.genre}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="totalCopies" className="block text-sm font-medium text-gray-700">
            Total Copies
          </label>
          <input
            type="number"
            id="totalCopies"
            name="totalCopies"
            defaultValue={book.totalCopies}
            required
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            defaultValue={book.description}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
} 