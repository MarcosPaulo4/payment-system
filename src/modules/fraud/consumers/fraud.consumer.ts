import { Injectable } from '@nestjs/common';
import { DLXSubscribe } from '../../../common/decorators/dlx-subscribe';
import { FraudPub } from '../publishers/fraud.publisher';

@Injectable()
export class FraudConsumer {
  constructor(private readonly fraudPub: FraudPub) {}

  @DLXSubscribe({
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
