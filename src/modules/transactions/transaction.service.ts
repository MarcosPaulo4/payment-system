import { Injectable } from '@nestjs/common';
import { Transaction, TransactionStatus } from '../../../generated/prisma';
import { PrismaService } from '../../database/prisma.service';
import { CreateTransactionDTO } from './dto/create-transaction.dto';
import { TransactionPub } from './publishers/transaction.publisher';

@Injectable()
export class TransactionService {
  constructor(
    private prismaService: PrismaService,
    private readonly transactionPub: TransactionPub,
  ) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDTO,
  ): Promise<Partial<Transaction>> {
    const transaction = await this.prismaService.transaction.create({
      data: {
        ...createTransactionDto,
        status: TransactionStatus.CREATED,
      },
    });

    await this.transactionPub.publishCreate(
      transaction.id,
      transaction.userId,
      transaction.amount,
      transaction.userEmail,
    );

    return { id: transaction.id };
  }

  async approveTransaction(
    transactionId: string,
    userId: string,
    userEmail: string,
  ) {
    const tx = await this.prismaService.transaction.findUnique({
      where: { id: transactionId },
    });
    if (!tx) {
      throw new Error('Transaction not found');
    }
    if (tx?.status === TransactionStatus.SEND) {
      return tx;
    }
    await this.prismaService.transaction.update({
      where: { id: transactionId },
      data: { status: TransactionStatus.SEND },
    });
    return await this.transactionPub.createTransactionSession(
      transactionId,
      userId,
      userEmail,
    );
  }

  async reproveTransaction(transactionId: string) {
    const tx = await this.prismaService.transaction.findUnique({
      where: { id: transactionId },
    });
    if (!tx) {
      throw new Error('Transaction not found');
    }
    if (tx?.status === TransactionStatus.REPROVED) {
      return tx;
    }
    return await this.prismaService.transaction.update({
      where: { id: transactionId },
      data: { status: TransactionStatus.REPROVED },
    });
  }
}
