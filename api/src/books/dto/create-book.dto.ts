import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator'

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  author: string

  @IsString()
  @IsNotEmpty()
  ISBN: string

  @IsString()
  @IsNotEmpty()
  genre: string

  @IsInt()
  @Min(1)
  totalCopies: number

  @IsString()
  @IsOptional()
  description?: string
} 