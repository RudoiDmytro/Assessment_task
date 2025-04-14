'use client'

import { useState, useEffect } from 'react'
import { Member } from '@/types/member'
import { API_URL } from '@/config/api'

interface MemberSelectionDialogProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (member: Member) => void
}

export default function MemberSelectionDialog({ isOpen, onClose, onSelect }: MemberSelectionDialogProps) {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch(`${API_URL}/members`)
        if (!res.ok) throw new Error('Failed to fetch members')
        const data = await res.json()
        setMembers(data)
      } catch (error) {
        console.error('Error fetching members:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchMembers()
    }
  }, [isOpen])

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Select Member</h2>
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
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <div className="space-y-2">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelect(member)}
              >
                <div className="font-medium">{member.name}</div>
                <div className="text-sm text-gray-600">{member.email}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 