## Short video Walkthrough link - https://youtu.be/K6_UbtDhhk8
# Library Management System

A full-stack application for managing a library's books, members, and borrowings. Built with NestJS for the backend and Next.js for the frontend.

## Features

- **Book Management**
  - Add, view, edit, and delete books
  - Track book availability
  - View book details including title, author, ISBN, genre, and copies

- **Member Management**
  - Add, view, edit, and delete members
  - Track member information including name, email, phone, and address
  - View member's borrowed books

- **Borrowing Management**
  - Borrow and return books
  - Track borrowing history
  - View overdue books

## Tech Stack

### Backend (API)
- NestJS
- TypeScript
- File-based storage (JSON files)

### Frontend (Client)
- Next.js
- TypeScript
- Tailwind CSS
- React Server Components

## Project Structure

```
.
├── api/                    # NestJS backend
│   ├── src/
│   │   ├── books/         # Book module
│   │   ├── members/       # Member module
│   │   ├── borrowings/    # Borrowing module
│   │   ├── data/          # JSON data storage
│   │   └── main.ts        # Application entry point
│   └── package.json
│
└── client/                 # Next.js frontend
    ├── src/
    │   ├── app/           # Next.js app router
    │   ├── components/    # React components
    │   ├── types/         # TypeScript types
    │   └── config/        # Configuration files
    └── package.json
```

## Prerequisites

- Node.js (v18 or later)
- npm or yarn

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/RudoiDmytro/Assessment_task
cd library-management-system
```

### 2. Install Dependencies

#### Backend (API)
```bash
cd api
npm install
```

#### Frontend (Client)
```bash
cd client
npm install
```

### 3. Create Data Directory

```bash
cd api
mkdir -p data
```

### 4. Configure Environment Variables

#### Backend (API)
Create a `.env` file in the `api` directory:
```env
PORT=3000
```

#### Frontend (Client)
Create a `.env.local` file in the `client` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Running the Application

### 1. Start the Backend (API)

```bash
cd api
npm run start:dev
```

The API will be available at `http://localhost:3000`

### 2. Start the Frontend (Client)

```bash
cd client
npm run dev
```

The client will be available at `http://localhost:3001`

## API Endpoints

### Books
- `GET /books` - Get all books
- `GET /books/:ISBN` - Get a specific book
- `POST /books` - Create a new book
- `PUT /books/:ISBN` - Update a book
- `DELETE /books/:ISBN` - Delete a book

### Members
- `GET /members` - Get all members
- `GET /members/:id` - Get a specific member
- `POST /members` - Create a new member
- `PUT /members/:id` - Update a member
- `DELETE /members/:id` - Delete a member

### Borrowings
- `POST /borrowings/borrow` - Borrow a book
- `POST /borrowings/return` - Return a book
- `GET /borrowings/member/:memberId/history` - Get member's borrowing history
- `GET /borrowings/overdue` - Get overdue books

## Development

### Backend Development
```bash
cd api
npm run start:dev
```

### Frontend Development
```bash
cd client
npm run dev
```

### Running Tests
```bash
# Backend tests
cd api
npm run test

# Frontend tests
cd client
npm run test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 
