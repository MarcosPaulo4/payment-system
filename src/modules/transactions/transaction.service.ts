import { Injectable } from '@nestjs/common';
import { Status, Transaction } from '../../../generated/prisma';
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
        status: Status.CREATED,
      },
    });

    await this.transactionPub.publishCreate(
      transaction.id,
      transaction.userId,
      transaction.amount,
    );

    return { id: transaction.id };
  }

  async reproveTransaction(transactionId: string) {
    const updateTransaction = await this.prismaService.transaction.update({
      where: { id: transactionId },
      data: { status: Status.PAID },
    });
  }
}
