import { Injectable, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from '../../../common/messaging/rabbitmq.service';
import { FraudPub } from '../publishers/fraud.publisher';

@Injectable()
export class FraudConsumer implements OnModuleInit {
  private readonly transactionExchange = 'transactions';
  private readonly transactionQueue = 'transactions.queue';
  private readonly transactionDlxExchange = 'transactions.dlx';
  private readonly transactionDlxQueue = 'transactions.dlx.queue';
  private readonly routingKey = 'transaction.created';
  constructor(
    private readonly rabbitMq: RabbitMQService,
    private readonly fraudPub: FraudPub,
  ) {}

  async onModuleInit() {
    await this.rabbitMq.assertQueueWithDLX(
      this.transactionQueue,
      this.transactionExchange,
      this.routingKey,
      this.transactionDlxExchange,
      this.transactionDlxQueue,
    );

    await this.rabbitMq.subscribe(
      this.transactionQueue,
      this.handleTransactionCreated.bind(this),
    );
  }

  async handleTransactionCreated(msg: any) {
    const { transactionId, amount } = msg;
    const isFraud = amount > 1000;
    if (!isFraud) {
      return await this.fraudPub.reproveTransaction(transactionId);
    }
    return await this.fraudPub.approveTransaction(transactionId);
  }
}
