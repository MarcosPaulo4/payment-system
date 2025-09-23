import { Module } from '@nestjs/common';
import { StripeModule } from '../stripe/stripe.module';
import { PaymentConsumer } from './consumer/payment.consumer';
import { PaymentService } from './payment.service';

@Module({
  imports: [StripeModule],
  providers: [PaymentService, PaymentConsumer],
  exports: [PaymentService],
})
export class PaymentModule {}
