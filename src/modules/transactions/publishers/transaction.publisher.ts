import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionPub {
  private readonly exchange = 'transactions';
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async publishCreate(transactionId: string, userId: string, amount: number) {
    await this.amqpConnection.publish(this.exchange, 'transaction.created', {
      transactionId,
      userId,
      amount,
    });
  }
}
