import { Controller, Post, Body, Get, Param, ValidationPipe } from '@nestjs/common';
import { BorrowingsService } from './borrowings.service';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { Borrowing } from './interfaces/borrowing.interface';

@Controller('borrowings')
export class BorrowingsController {
  constructor(private readonly borrowingsService: BorrowingsService) {}

  @Post('borrow')
  async borrowBook(@Body(ValidationPipe) borrowBookDto: BorrowBookDto): Promise<void> {
    return this.borrowingsService.borrowBook(
      borrowBookDto.memberId,
      borrowBookDto.ISBN,
    );
  }

  @Post('return')
  async returnBook(@Body(ValidationPipe) borrowBookDto: BorrowBookDto): Promise<void> {
    return this.borrowingsService.returnBook(
      borrowBookDto.memberId,
      borrowBookDto.ISBN,
    );
  }

  @Get('member/:memberId/history')
  async getMemberBorrowingHistory(@Param('memberId') memberId: string): Promise<Borrowing[]> {
    return this.borrowingsService.getMemberBorrowingHistory(memberId);
  }

  @Get('overdue')
  async getOverdueBooks(): Promise<Borrowing[]> {
    return this.borrowingsService.getOverdueBooks();
  }
} 