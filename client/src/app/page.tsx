import Link from 'next/link'

export default function Home() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Library Management System</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link 
          href="/books" 
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl font-semibold mb-2">Books</h2>
          <p className="text-gray-600">Manage books, add new ones, and track availability</p>
        </Link>

        <Link 
          href="/members" 
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl font-semibold mb-2">Members</h2>
          <p className="text-gray-600">Manage library members and their details</p>
        </Link>

        <Link 
          href="/borrowings" 
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
        >
          <h2 className="text-2xl font-semibold mb-2">Borrowings</h2>
          <p className="text-gray-600">Track book borrowings and returns</p>
        </Link>
      </div>
    </div>
  )
}
