import { Injectable } from '@nestjs/common';
import { AmqpService } from '../../../messaging/amqp.service';

@Injectable()
export class TransactionPub {
  private readonly exchange = 'transactions';
  constructor(private readonly amqpService: AmqpService) {}

  async publishCreate(
    transactionId: string,
    userId: string,
    amount: number,
    userEmail?: string,
  ) {
    await this.amqpService.publish(this.exchange, 'transaction.created', {
      transactionId,
      userId,
      amount,
      userEmail,
    });
  }

  async createTransactionSession(
    transactionId: string,
    userId: string,
    userEmail?: string,
  ) {
    await this.amqpService.publish(this.exchange, 'transaction.session', {
      transactionId,
      userId,
      userEmail,
    });
  }
}
