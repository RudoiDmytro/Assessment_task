import { Injectable } from '@nestjs/common';
import { BooksService } from '../books/books.service';
import { MembersService } from '../members/members.service';
import { Borrowing } from './interfaces/borrowing.interface';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class BorrowingsService {
  private borrowings: Borrowing[] = [];
  private readonly dataPath = join(process.cwd(), 'data', 'borrowings.json');

  constructor(
    private readonly booksService: BooksService,
    private readonly membersService: MembersService,
  ) {
    this.loadData();
  }

  private loadData() {
    try {
      const data = readFileSync(this.dataPath, 'utf8');
      this.borrowings = JSON.parse(data);
    } catch (error) {
      this.borrowings = [];
    }
  }

  private saveData() {
    const dir = join(process.cwd(), 'data');
    if (!require('fs').existsSync(dir)) {
      require('fs').mkdirSync(dir);
    }
    writeFileSync(this.dataPath, JSON.stringify(this.borrowings, null, 2));
  }

  async borrowBook(memberId: string, ISBN: string): Promise<void> {
    const book = await this.booksService.findByISBN(ISBN);
    const member = await this.membersService.findById(memberId);

    await this.booksService.updateAvailability(ISBN, false, memberId);
    await this.membersService.addBorrowedBook(memberId, ISBN, book.title);

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14 days from borrow date

    this.borrowings.push({
      memberId,
      ISBN,
      borrowDate: new Date(),
      dueDate,
      returnDate: undefined,
    });

    this.saveData();
  }

  async returnBook(memberId: string, ISBN: string): Promise<void> {
    await this.booksService.updateAvailability(ISBN, true, memberId);
    await this.membersService.removeBorrowedBook(memberId, ISBN);

    const borrowing = this.borrowings.find(
      b => b.memberId === memberId && b.ISBN === ISBN && !b.returnDate
    );

    if (borrowing) {
      borrowing.returnDate = new Date();
      this.saveData();
    }
  }

  async getMemberBorrowingHistory(memberId: string): Promise<Borrowing[]> {
    return this.borrowings.filter(b => b.memberId === memberId);
  }

  async getOverdueBooks(): Promise<Borrowing[]> {
    const now = new Date();
    return this.borrowings.filter(
      b => !b.returnDate && b.dueDate < now
    );
  }
} 