import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FraudPub {
  private readonly fraudExchange = 'fraud';
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async approveTransaction(transactionId: string) {
    await this.amqpConnection.publish(
      this.fraudExchange,
      'transaction.approved',
      {
        transactionId,
      },
    );
  }

  async reproveTransaction(transactionId: string) {
    await this.amqpConnection.publish(
      this.fraudExchange,
      'transaction.reproved',
      {
        transactionId,
      },
    );
  }
}
