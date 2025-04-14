'use server'

import { Member } from '@/types/member'
import { API_URL } from '@/config/api'
import { revalidatePath } from 'next/cache'

export async function createMember(formData: FormData): Promise<Member> {
  const member = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    address: formData.get('address'),
  }

  const res = await fetch(`${API_URL}/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(member),
  })

  if (!res.ok) {
    throw new Error('Failed to create member')
  }

  revalidatePath('/members')

  return res.json()
}

export async function updateMember(id: string, formData: FormData): Promise<Member> {
  const member = {
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    phoneNumber: formData.get('phoneNumber'),
  }

  const res = await fetch(`${API_URL}/members/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(member),
  })

  if (!res.ok) {
    throw new Error('Failed to update member')
  }

  return res.json()
}

export async function deleteMember(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/members/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    throw new Error('Failed to delete member')
  }
} 