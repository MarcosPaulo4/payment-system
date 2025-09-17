import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from '../../../common/messaging/rabbitmq.service';

@Injectable()
export class FraudConsumer implements OnModuleInit {
  private readonly routingKeyApproved = 'transaction.approved';
  private readonly queueApproved = 'fraud.approved';
  private readonly queueReproved = 'fraud.reproved';
  private readonly routingKeyReproved = 'transaction.reproved';
  private readonly transactionDlxQueue = 'transactions.dlx.queue';
  private readonly fraudExchange = 'fraud';

  constructor(private readonly rabbitMq: RabbitMQService) {}

  onModuleInit() {
    this.rabbitMq.subscribe(this.queueApproved, this.handleApproved.bind(this));
    this.rabbitMq.subscribe(this.queueReproved, this.handleReproved.bind(this));
  }

  async handleApproved(msg: any) {}

  async handleReproved() {}
}
