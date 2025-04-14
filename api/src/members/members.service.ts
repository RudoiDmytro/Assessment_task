import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { Member } from './interfaces/member.interface';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class MembersService {
  private members: Member[] = [];
  private readonly dataPath = join(process.cwd(), 'data', 'members.json');

  constructor() {
    this.loadData();
  }

  private loadData() {
    try {
      const data = readFileSync(this.dataPath, 'utf8');
      this.members = JSON.parse(data);
    } catch (error) {
      console.log('No existing members data found, starting with empty array');
      this.members = [];
    }
  }

  private saveData() {
    try {
      const dir = join(process.cwd(), 'data');
      if (!require('fs').existsSync(dir)) {
        require('fs').mkdirSync(dir, { recursive: true });
      }
      writeFileSync(this.dataPath, JSON.stringify(this.members, null, 2));
    } catch (error) {
      console.error('Error saving members data:', error);
      throw new Error('Failed to save members data');
    }
  }

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    try {
      // Check if member with same email already exists
      const existingMember = this.members.find(m => m.email === createMemberDto.email);
      if (existingMember) {
        throw new ConflictException('Member with this email already exists');
      }

      const member: Member = {
        id: Date.now().toString(),
        name: createMemberDto.name,
        email: createMemberDto.email,
        phone: createMemberDto.phone,
        address: createMemberDto.address,
        borrowedBooks: [],
      };

      this.members.push(member);
      this.saveData();
      return member;
    } catch (error) {
      console.error('Error creating member:', error);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Failed to create member');
    }
  }

  async findAll(): Promise<Member[]> {
    return this.members;
  }

  async findById(id: string): Promise<Member> {
    const member = this.members.find(m => m.id === id);
    if (!member) {
      throw new NotFoundException('Member not found');
    }
    return member;
  }

  async update(id: string, updateMemberDto: UpdateMemberDto): Promise<Member> {
    try {
      const memberIndex = this.members.findIndex(m => m.id === id);
      if (memberIndex === -1) {
        throw new NotFoundException('Member not found');
      }

      // Check if email is being updated and if it already exists
      if (updateMemberDto.email) {
        const existingMember = this.members.find(
          m => m.email === updateMemberDto.email && m.id !== id
        );
        if (existingMember) {
          throw new ConflictException('Member with this email already exists');
        }
      }

      const updatedMember: Member = {
        ...this.members[memberIndex],
        ...updateMemberDto,
      };

      this.members[memberIndex] = updatedMember;
      this.saveData();
      return updatedMember;
    } catch (error) {
      console.error('Error updating member:', error);
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Failed to update member');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const memberIndex = this.members.findIndex(m => m.id === id);
      if (memberIndex === -1) {
        throw new NotFoundException('Member not found');
      }

      this.members.splice(memberIndex, 1);
      this.saveData();
    } catch (error) {
      console.error('Error deleting member:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to delete member');
    }
  }

  async addBorrowedBook(id: string, ISBN: string, title: string): Promise<void> {
    try {
      const member = await this.findById(id);
      const alreadyBorrowed = member.borrowedBooks.some(book => book.ISBN === ISBN);
      
      if (alreadyBorrowed) {
        throw new ConflictException('Member has already borrowed this book');
      }

      member.borrowedBooks.push({ 
        ISBN, 
        title,
        borrowDate: new Date()
      });
      this.saveData();
    } catch (error) {
      console.error('Error adding borrowed book:', error);
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Failed to add borrowed book');
    }
  }

  async removeBorrowedBook(id: string, ISBN: string): Promise<void> {
    try {
      const member = await this.findById(id);
      member.borrowedBooks = member.borrowedBooks.filter(book => book.ISBN !== ISBN);
      this.saveData();
    } catch (error) {
      console.error('Error removing borrowed book:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to remove borrowed book');
    }
  }
} 