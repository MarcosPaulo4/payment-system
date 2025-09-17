import { Module } from '@nestjs/common';
import { MessagingModule } from '../../common/messaging/mesaging.module';
import { DatabaseModule } from '../../database/database.module';
import { FraudConsumer } from './consumers/fraud.consumer';
import { FraudService } from './fraud.service';
import { FraudPub } from './publishers/fraud.publisher';

@Module({
  imports: [DatabaseModule, MessagingModule],
  providers: [FraudConsumer, FraudService, FraudPub],
})
export class FraudModule {}
{
}
