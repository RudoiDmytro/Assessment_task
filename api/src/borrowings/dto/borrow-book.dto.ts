import { IsString, IsNotEmpty } from 'class-validator'

export class BorrowBookDto {
  @IsString()
  @IsNotEmpty()
  memberId: string

  @IsString()
  @IsNotEmpty()
  ISBN: string
} 