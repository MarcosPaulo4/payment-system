import { Injectable } from '@nestjs/common';
import { Subscribe } from '../../../common/decorators/subscribe.decorator';
import { TransactionService } from '../transaction.service';

@Injectable()
export class TransactionConsumer {
  constructor(private readonly transactionService: TransactionService) {}
  @Subscribe({
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

  @Subscribe({
    exchange: 'fraud',
    routingKey: 'transaction.approved',
    queue: 'fraud.approved',
  })
  async handleApproved(msg: any) {
    const { transactionId, userId, userEmail } = msg;
    try {
      await this.transactionService.approveTransaction(
        transactionId,
        userId,
        userEmail,
      );
    } catch (error) {
      console.error(
        `Error handling approved transaction with id: ${transactionId}`,
        error,
      );
    }
  }
}
