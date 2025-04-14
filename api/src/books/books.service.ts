import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Book } from './interfaces/book.interface';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class BooksService {
  private books: Book[] = [];
  private readonly dataPath = join(process.cwd(), 'data', 'books.json');

  constructor() {
    this.loadData();
  }

  private loadData() {
    try {
      const data = readFileSync(this.dataPath, 'utf8');
      this.books = JSON.parse(data);
    } catch (error) {
      this.books = [];
    }
  }

  private saveData() {
    const dir = join(process.cwd(), 'data');
    if (!require('fs').existsSync(dir)) {
      require('fs').mkdirSync(dir);
    }
    writeFileSync(this.dataPath, JSON.stringify(this.books, null, 2));
  }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const existingBook = this.books.find(book => book.ISBN === createBookDto.ISBN);
    if (existingBook) {
      throw new ConflictException('Book with this ISBN already exists');
    }

    const book: Book = {
      ...createBookDto,
      availableCopies: createBookDto.totalCopies,
      borrowingHistory: []
    };

    this.books.push(book);
    this.saveData();
    return book;
  }

  async findAll(): Promise<Book[]> {
    return this.books;
  }

  async findByTitleOrAuthor(searchTerm: string): Promise<Book[]> {
    const term = searchTerm.toLowerCase();
    return this.books.filter(book => 
      book.title.toLowerCase().includes(term) || 
      book.author.toLowerCase().includes(term)
    );
  }

  async findByISBN(ISBN: string): Promise<Book> {
    const book = this.books.find(book => book.ISBN === ISBN);
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async update(ISBN: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findByISBN(ISBN);
    
    if (updateBookDto.totalCopies !== undefined) {
      const borrowedCopies = book.totalCopies - book.availableCopies;
      if (updateBookDto.totalCopies < borrowedCopies) {
        throw new ConflictException('Cannot reduce total copies below currently borrowed copies');
      }
      book.availableCopies += updateBookDto.totalCopies - book.totalCopies;
      book.totalCopies = updateBookDto.totalCopies;
    }

    Object.assign(book, updateBookDto);
    this.saveData();
    return book;
  }

  async delete(ISBN: string): Promise<void> {
    const book = await this.findByISBN(ISBN);
    
    if (book.availableCopies !== book.totalCopies) {
      throw new ForbiddenException('Cannot delete a book that is currently borrowed');
    }

    this.books = this.books.filter(b => b.ISBN !== ISBN);
    this.saveData();
  }

  async updateAvailability(ISBN: string, increment: boolean, memberId: string): Promise<void> {
    const book = await this.findByISBN(ISBN);
    if (increment) {
      if (book.availableCopies < book.totalCopies) {
        book.availableCopies++;
        const historyEntry = book.borrowingHistory.find(
          h => h.memberId === memberId && !h.returnDate
        );
        if (historyEntry) {
          historyEntry.returnDate = new Date();
        }
      }
    } else {
      if (book.availableCopies > 0) {
        book.availableCopies--;
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14); // 14 days from borrow date
        book.borrowingHistory.push({
          memberId,
          borrowDate: new Date(),
          dueDate,
        });
      } else {
        throw new ConflictException('No copies available');
      }
    }
    this.saveData();
  }

  async getBorrowingHistory(ISBN: string): Promise<Book['borrowingHistory']> {
    const book = await this.findByISBN(ISBN);
    return book.borrowingHistory;
  }
} 