'use client'

import { useState, useEffect } from 'react'
import { Book } from '@/types/book'
import { API_URL } from '@/config/api'

interface BookSelectionDialogProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (book: Book) => void
}

export default function BookSelectionDialog({ isOpen, onClose, onSelect }: BookSelectionDialogProps) {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`${API_URL}/books`)
        if (!res.ok) throw new Error('Failed to fetch books')
        const data = await res.json()
        setBooks(data)
      } catch (error) {
        console.error('Error fetching books:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchBooks()
    }
  }, [isOpen])

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.ISBN.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Select Book</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search books by title, author, or ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <div className="space-y-2">
            {filteredBooks.map((book) => (
              <div
                key={book.ISBN}
                className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelect(book)}
              >
                <div className="font-medium">{book.title}</div>
                <div className="text-sm text-gray-600">Author: {book.author}</div>
                <div className="text-sm text-gray-600">ISBN: {book.ISBN}</div>
                <div className="text-sm text-gray-600">
                  Available: {book.availableCopies} of {book.totalCopies}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 