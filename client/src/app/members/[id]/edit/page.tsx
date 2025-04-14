'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Member } from '@/types/member'
import { API_URL } from '@/config/api'
import { use } from 'react'

export default function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await fetch(`${API_URL}/members/${resolvedParams.id}`)
        if (!res.ok) throw new Error('Failed to fetch member')
        const data = await res.json()
        setMember(data)
      } catch (error) {
        console.error('Error fetching member:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMember()
  }, [resolvedParams.id])

  const handleSubmit = async (formData: FormData) => {
    try {
      const res = await fetch(`${API_URL}/members/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          address: formData.get('address'),
        }),
      })

      if (!res.ok) throw new Error('Failed to update member')
      router.push(`/members/${resolvedParams.id}`)
    } catch (error) {
      console.error('Error updating member:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (!member) {
    return <div className="text-center py-8">Member not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Member</h1>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={member.name}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue={member.email}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            defaultValue={member.phone}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            defaultValue={member.address}
            required
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="flex justify-end space-x-4">
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