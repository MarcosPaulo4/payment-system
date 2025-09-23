import { Injectable } from '@nestjs/common';
import { AmqpService } from '../../../messaging/amqp.service';

@Injectable()
export class FraudPub {
  private readonly fraudExchange = 'fraud';
  constructor(private readonly amqpService: AmqpService) {}

  async approveTransaction(
    transactionId: string,
    userId: string,
    amount: number,
    userEmail: string,
  ) {
    await this.amqpService.publish(this.fraudExchange, 'transaction.approved', {
      transactionId,
      userId,
      amount,
      userEmail,
    });
  }

  async reproveTransaction(transactionId: string) {
    await this.amqpService.publish(this.fraudExchange, 'transaction.reproved', {
      transactionId,
    });
  }
}
