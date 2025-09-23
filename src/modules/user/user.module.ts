import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { StripeModule } from '../stripe/stripe.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule, StripeModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
{
}
