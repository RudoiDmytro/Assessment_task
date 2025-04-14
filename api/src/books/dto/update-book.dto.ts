import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateBookDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  genre?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  totalCopies?: number;

  @IsString()
  @IsOptional()
  description?: string;
} 