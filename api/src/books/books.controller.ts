import { Controller, Get, Post, Body, Query, Param, Delete, Put, ValidationPipe } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './interfaces/book.interface';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  async create(@Body(ValidationPipe) createBookDto: CreateBookDto): Promise<Book> {
    return this.booksService.create(createBookDto);
  }

  @Get()
  async findAll(): Promise<Book[]> {
    return this.booksService.findAll();
  }

  @Get('search')
  async search(@Query('term') term: string): Promise<Book[]> {
    return this.booksService.findByTitleOrAuthor(term);
  }

  @Get(':ISBN')
  async findOne(@Param('ISBN') ISBN: string): Promise<Book> {
    return this.booksService.findByISBN(ISBN);
  }

  @Put(':ISBN')
  async update(
    @Param('ISBN') ISBN: string,
    @Body(ValidationPipe) updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return this.booksService.update(ISBN, updateBookDto);
  }

  @Delete(':ISBN')
  async delete(@Param('ISBN') ISBN: string): Promise<void> {
    return this.booksService.delete(ISBN);
  }

  @Get(':ISBN/history')
  async getBorrowingHistory(@Param('ISBN') ISBN: string) {
    return this.booksService.getBorrowingHistory(ISBN);
  }
} 