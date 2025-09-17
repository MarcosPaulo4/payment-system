import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { CreateTransactionDTO } from './dto/create-transaction.dto';
import { TransactionDTO } from './dto/transaction.dto';
import { TransactionService } from './transaction.service';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a transaction',
    description: 'This endpoint create a transaction with status CREATED',
  })
  @ApiCreatedResponse({
    description: 'Return the Id of the transaction',
    type: TransactionDTO,
  })
  async createTransaction(@Body() dto: CreateTransactionDTO) {
    return await this.transactionService.createTransaction(dto);
  }
}
