import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { User } from '../../../generated/prisma';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<Partial<User>> {
    try {
      const emailAlreadyExists = await this.findByEmail(dto.email);
      if (emailAlreadyExists) {
        throw new ConflictException('Invalid Email');
      }
      const createUser = await this.prisma.user.create({
        data: dto,
      });

      return { id: createUser.id };
    } catch (error) {
      throw new BadRequestException('Error creating account');
    }
  }

  async findByEmail(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return !!user;
  }
}
