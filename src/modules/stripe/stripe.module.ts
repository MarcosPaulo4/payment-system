import { Module } from '@nestjs/common';
import { AmqpModule } from '../../messaging/amqp.module';
import { StripeService } from './stripe.service';

@Module({
  imports: [AmqpModule],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule {}
