import { Module } from '@nestjs/common';
import { MessagingModule } from '../../common/messaging/mesaging.module';
import { DatabaseModule } from '../../database/database.module';
import { TransactionPub } from './publishers/transaction.publisher';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [DatabaseModule, MessagingModule],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionPub],
})
export class TransactionModule {}
{
}
