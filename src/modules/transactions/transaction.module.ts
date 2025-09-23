import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { AmqpModule } from '../../messaging/amqp.module';
import { TransactionConsumer } from './consumers/transaction.consumer';
import { TransactionPub } from './publishers/transaction.publisher';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [DatabaseModule, AmqpModule],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionPub, TransactionConsumer],
})
export class TransactionModule {}
{
}
