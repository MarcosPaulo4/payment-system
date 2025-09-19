import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { AmqpModule } from '../../messaging/mesaging.module';
import { TransactionConsumer } from './consumers/transaction-consumer';
import { TransactionPub } from './publishers/transaction.publisher';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [DatabaseModule, AmqpModule.register()],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionPub, TransactionConsumer],
})
export class TransactionModule {}
{
}
