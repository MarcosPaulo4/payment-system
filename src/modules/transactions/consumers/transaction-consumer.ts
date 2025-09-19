import { Injectable } from '@nestjs/common';
import { TransactionService } from '../transaction.service';

@Injectable()
export class TransactionConsumer {
  constructor(private readonly transactionService: TransactionService) {}
  @DLXSubscribe({
    exchange: 'fraud',
    routingKey: 'transaction.approved',
    queue: 'fraud.approved',
  })
  async handleApproved(msg: any) {
    console.log('Aprovado');
  }

  @DLXSubscribe({
    exchange: 'fraud',
    routingKey: 'transaction.reproved',
    queue: 'fraud.reproved',
  })
  async handleReproved(msg: any) {
    const { transactionId } = msg;
    try {
      await this.transactionService.reproveTransaction(transactionId);
    } catch (error) {
      console.error(
        `Error handling reproved transaction with id: ${transactionId}`,
        error,
      );
    }
  }
}
