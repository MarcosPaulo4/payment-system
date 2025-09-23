import { Injectable } from '@nestjs/common';
import { Subscribe } from '../../../common/decorators/subscribe.decorator';
import { FraudService } from '../fraud.service';

@Injectable()
export class FraudConsumer {
  constructor(private readonly fraudService: FraudService) {}

  @Subscribe({
    exchange: 'transactions',
    routingKey: 'transaction.created',
    queue: 'fraud.check',
  })
  async handleTransactionCreated(msg: any) {
    const { transactionId, amount, userId, userEmail } = msg;
    return await this.fraudService.checkTransaction(
      transactionId,
      amount,
      userId,
      userEmail,
    );
  }
}
