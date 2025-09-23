import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTransactionDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number;
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  userEmail: string;
}
