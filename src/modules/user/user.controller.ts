import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'Create an user',
    description: 'This endpoint creates an user in the database and in stripe.',
  })
  @ApiCreatedResponse({
    description: 'Details of the created user',
    type: UserDTO,
  })
  async create(@Body() dto: CreateUserDto) {
    const userId = await this.userService.create(dto);
    return userId;
  }
}
