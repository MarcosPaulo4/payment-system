import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { AmqpModule } from '../../messaging/amqp.module';
import { FraudConsumer } from './consumers/fraud.consumer';
import { FraudService } from './fraud.service';
import { FraudPub } from './publishers/fraud.publisher';

@Module({
  imports: [DatabaseModule, AmqpModule],
  providers: [FraudConsumer, FraudService, FraudPub],
})
export class FraudModule {}
{
}
