import { Module } from '@nestjs/common';
import { BorrowingsController } from './borrowings.controller';
import { BorrowingsService } from './borrowings.service';
import { BooksModule } from '../books/books.module';
import { MembersModule } from '../members/members.module';

@Module({
  imports: [BooksModule, MembersModule],
  controllers: [BorrowingsController],
  providers: [BorrowingsService],
})
export class BorrowingsModule {} 