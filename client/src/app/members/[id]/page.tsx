'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Member } from '@/types/member'
import { API_URL } from '@/config/api'
import { use } from 'react'

export default function MemberPage({
	params
}: {
	params: Promise<{ id: string }>
}) {
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

	const handleDelete = async () => {
		if (!confirm('Are you sure you want to delete this member?')) return

		try {
			const res = await fetch(`${API_URL}/members/${resolvedParams.id}`, {
				method: 'DELETE'
			})

			if (!res.ok) throw new Error('Failed to delete member')
			router.push('/members')
		} catch (error) {
			console.error('Error deleting member:', error)
		}
	}

	if (loading) {
		return <div className='text-center py-8'>Loading...</div>
	}

	if (!member) {
		return <div className='text-center py-8'>Member not found</div>
	}

	return (
		<div className='max-w-2xl mx-auto p-6'>
			<div className='bg-white shadow overflow-hidden sm:rounded-lg'>
				<div className='px-4 py-5 sm:px-6 flex justify-between items-center'>
					<h3 className='text-lg leading-6 font-medium text-gray-900'>
						Member Details
					</h3>
					<div className='flex space-x-3'>
						<button
							onClick={() => router.push(`/members/${resolvedParams.id}/edit`)}
							className='inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
						>
							Edit
						</button>
						<button
							onClick={handleDelete}
							className='inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
						>
							Delete
						</button>
					</div>
				</div>
				<div className='border-t border-gray-200'>
					<dl>
						<div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
							<dt className='text-sm font-medium text-gray-500'>Name</dt>
							<dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
								{member.name}
							</dd>
						</div>
						<div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
							<dt className='text-sm font-medium text-gray-500'>Email</dt>
							<dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
								{member.email}
							</dd>
						</div>
						<div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
							<dt className='text-sm font-medium text-gray-500'>Phone</dt>
							<dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
								{member.phone}
							</dd>
						</div>
						<div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
							<dt className='text-sm font-medium text-gray-500'>Address</dt>
							<dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
								{member.address}
							</dd>
						</div>
						<div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
							<dt className='text-sm font-medium text-gray-500'>
								Borrowed Books
							</dt>
							<dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
								{member.borrowedBooks.length === 0 ? (
									<p>No books currently borrowed</p>
								) : (
									<ul className='border border-gray-200 rounded-md divide-y divide-gray-200'>
										{member.borrowedBooks.map(book => (
											<li
												key={book.ISBN}
												className='pl-3 pr-4 py-3 flex items-center justify-between text-sm'
											>
												<div className='w-0 flex-1 flex items-center'>
													<span className='ml-2 flex-1 w-0 truncate'>
														{book.title}
													</span>
												</div>
												<div className='ml-4 flex-shrink-0'>
													<span className='text-gray-500'>
														ISBN: {book.ISBN}
													</span>
												</div>
											</li>
										))}
									</ul>
								)}
							</dd>
						</div>
					</dl>
				</div>
			</div>
		</div>
	)
}
