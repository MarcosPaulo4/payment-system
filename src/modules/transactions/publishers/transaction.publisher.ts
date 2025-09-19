import { Injectable } from '@nestjs/common';
import { AmqpService } from '../../../messaging/amqp.service';

@Injectable()
export class TransactionPub {
  private readonly exchange = 'transactions';
  constructor(private readonly amqpService: AmqpService) {}

  async publishCreate(transactionId: string, userId: string, amount: number) {
    await this.amqpService.publish(this.exchange, 'transaction.created', {
      transactionId,
      userId,
      amount,
    });
  }
}
