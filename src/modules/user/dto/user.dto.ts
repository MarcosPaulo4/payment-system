import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserDTO {
  @ApiProperty()
  @IsString()
  userId: string;
}
