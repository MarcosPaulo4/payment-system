import { Injectable } from '@nestjs/common';
import { RabbitMQService } from '../../../common/messaging/rabbitmq.service';

@Injectable()
export class TransactionPub {
  private readonly exchange = 'transactions';
  constructor(private readonly rabbitmq: RabbitMQService) {}

  async publishCreate(transactionId: string, userId: string, amount: number) {
    await this.rabbitmq.publish(this.exchange, 'transaction.created', {
      transactionId,
      userId,
      amount,
    });
  }
}
