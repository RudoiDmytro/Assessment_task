'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { API_URL } from '@/config/api'
import MemberSelectionDialog from '@/components/MemberSelectionDialog'
import BookSelectionDialog from '@/components/BookSelectionDialog'
import { Member } from '@/types/member'
import { Book } from '@/types/book'

export default function BorrowingsPage() {
  const router = useRouter()
  const [memberId, setMemberId] = useState('')
  const [ISBN, setISBN] = useState('')
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false)
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false)
  const [error, setError] = useState('')

  // Return book states
  const [returnMemberId, setReturnMemberId] = useState('')
  const [returnISBN, setReturnISBN] = useState('')
  const [selectedReturnMember, setSelectedReturnMember] = useState<Member | null>(null)
  const [selectedReturnBook, setSelectedReturnBook] = useState<Book | null>(null)
  const [isReturnMemberDialogOpen, setIsReturnMemberDialogOpen] = useState(false)
  const [isReturnBookDialogOpen, setIsReturnBookDialogOpen] = useState(false)
  const [returnError, setReturnError] = useState('')

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch(`${API_URL}/borrowings/borrow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memberId, ISBN }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to borrow book')
      }

      router.refresh()
      setMemberId('')
      setISBN('')
      setSelectedMember(null)
      setSelectedBook(null)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  const handleReturn = async (e: React.FormEvent) => {
    e.preventDefault()
    setReturnError('')

    try {
      const res = await fetch(`${API_URL}/borrowings/return`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memberId: returnMemberId, ISBN: returnISBN }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Failed to return book')
      }

      router.refresh()
      setReturnMemberId('')
      setReturnISBN('')
      setSelectedReturnMember(null)
      setSelectedReturnBook(null)
    } catch (error) {
      setReturnError(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  const handleMemberSelect = (member: Member) => {
    setMemberId(member.id)
    setSelectedMember(member)
    setIsMemberDialogOpen(false)
  }

  const handleBookSelect = (book: Book) => {
    setISBN(book.ISBN)
    setSelectedBook(book)
    setIsBookDialogOpen(false)
  }

  const handleReturnMemberSelect = (member: Member) => {
    setReturnMemberId(member.id)
    setSelectedReturnMember(member)
    setIsReturnMemberDialogOpen(false)
  }

  const handleReturnBookSelect = (book: Book) => {
    setReturnISBN(book.ISBN)
    setSelectedReturnBook(book)
    setIsReturnBookDialogOpen(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Borrow Book Section */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h1 className="text-2xl font-bold mb-6">Borrow a Book</h1>

        <form onSubmit={handleBorrow} className="space-y-4">
          <div>
            <label htmlFor="memberId" className="block text-sm font-medium text-gray-700">
              Member
            </label>
            <div className="mt-1 flex">
              <input
                type="text"
                id="memberId"
                value={selectedMember ? `${selectedMember.name} (${selectedMember.email})` : memberId}
                readOnly
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setIsMemberDialogOpen(true)}
                className="ml-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
              >
                Select Member
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="ISBN" className="block text-sm font-medium text-gray-700">
              Book
            </label>
            <div className="mt-1 flex">
              <input
                type="text"
                id="ISBN"
                value={selectedBook ? `${selectedBook.title} (${selectedBook.ISBN})` : ISBN}
                readOnly
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setIsBookDialogOpen(true)}
                className="ml-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
              >
                Select Book
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!memberId || !ISBN}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Borrow Book
            </button>
          </div>
        </form>
      </div>

      {/* Return Book Section */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h1 className="text-2xl font-bold mb-6">Return a Book</h1>

        <form onSubmit={handleReturn} className="space-y-4">
          <div>
            <label htmlFor="returnMemberId" className="block text-sm font-medium text-gray-700">
              Member
            </label>
            <div className="mt-1 flex">
              <input
                type="text"
                id="returnMemberId"
                value={selectedReturnMember ? `${selectedReturnMember.name} (${selectedReturnMember.email})` : returnMemberId}
                readOnly
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setIsReturnMemberDialogOpen(true)}
                className="ml-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
              >
                Select Member
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="returnISBN" className="block text-sm font-medium text-gray-700">
              Book
            </label>
            <div className="mt-1 flex">
              <input
                type="text"
                id="returnISBN"
                value={selectedReturnBook ? `${selectedReturnBook.title} (${selectedReturnBook.ISBN})` : returnISBN}
                readOnly
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setIsReturnBookDialogOpen(true)}
                className="ml-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
              >
                Select Book
              </button>
            </div>
          </div>

          {returnError && (
            <div className="text-red-600 text-sm">{returnError}</div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!returnMemberId || !returnISBN}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Return Book
            </button>
          </div>
        </form>
      </div>

      {/* Selection Dialogs */}
      <MemberSelectionDialog
        isOpen={isMemberDialogOpen}
        onClose={() => setIsMemberDialogOpen(false)}
        onSelect={handleMemberSelect}
      />

      <BookSelectionDialog
        isOpen={isBookDialogOpen}
        onClose={() => setIsBookDialogOpen(false)}
        onSelect={handleBookSelect}
      />

      <MemberSelectionDialog
        isOpen={isReturnMemberDialogOpen}
        onClose={() => setIsReturnMemberDialogOpen(false)}
        onSelect={handleReturnMemberSelect}
      />

      <BookSelectionDialog
        isOpen={isReturnBookDialogOpen}
        onClose={() => setIsReturnBookDialogOpen(false)}
        onSelect={handleReturnBookSelect}
      />
    </div>
  )
} 