import { Injectable } from '@nestjs/common';
import { Subscribe } from '../../../common/decorators/subscribe.decorator';
import { PaymentService } from '../payment.service';

@Injectable()
export class PaymentConsumer {
  constructor(private readonly paymentService: PaymentService) {}

  @Subscribe({
    exchange: 'transactions',
    routingKey: 'transaction.session',
    queue: 'transaction.session',
  })
  async handleTransactionSession(msg: any) {
    const { transactionId, userId, userEmail } = msg;
    await this.paymentService.createPaymentSession(
      transactionId,
      userId,
      userEmail,
    );
  }
}
