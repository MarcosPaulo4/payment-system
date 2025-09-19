import { Injectable } from '@nestjs/common';
import { Subscribe } from '../../../common/decorators/subscribe.decorator';
import { FraudPub } from '../publishers/fraud.publisher';

@Injectable()
export class FraudConsumer {
  constructor(private readonly fraudPub: FraudPub) {}

  @Subscribe({
    exchange: 'transactions',
    routingKey: 'transaction.created',
    queue: 'fraud.check',
  })
  async handleTransactionCreated(msg: any) {
    const { transactionId, amount } = msg;
    const isFraud = amount > 40;
    if (isFraud) {
      return await this.fraudPub.reproveTransaction(transactionId);
    }
    return await this.fraudPub.approveTransaction(transactionId);
  }
}
