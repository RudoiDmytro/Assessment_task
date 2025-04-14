import { Module } from '@nestjs/common';
import { BooksModule } from './books/books.module';
import { MembersModule } from './members/members.module';
import { BorrowingsModule } from './borrowings/borrowings.module';

@Module({
  imports: [BooksModule, MembersModule, BorrowingsModule],
})
export class AppModule {} 