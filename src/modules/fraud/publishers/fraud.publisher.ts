import { Injectable } from '@nestjs/common';
import { RabbitMQService } from '../../../common/messaging/rabbitmq.service';

@Injectable()
export class FraudPub {
  private readonly exchange = 'fraud';
  constructor(private readonly rabbitMq: RabbitMQService) {}

  async approveTransaction(transactionId: string) {
    await this.rabbitMq.publish(this.exchange, 'transaction.approved', {
      transactionId,
    });
  }

  async reproveTransaction(transactionId: string) {
    await this.rabbitMq.publish(this.exchange, 'transaction.reproved', {
      transactionId,
    });
  }
}
