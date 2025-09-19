import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { AmqpModule } from '../../messaging/mesaging.module';
import { FraudConsumer } from './consumers/fraud.consumer';
import { FraudService } from './fraud.service';
import { FraudPub } from './publishers/fraud.publisher';

@Module({
  imports: [DatabaseModule, AmqpModule.register()],
  providers: [FraudConsumer, FraudService, FraudPub],
})
export class FraudModule {}
{
}
