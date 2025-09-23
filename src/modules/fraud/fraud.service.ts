import { Injectable } from '@nestjs/common';
import { FraudPub } from './publishers/fraud.publisher';

@Injectable()
export class FraudService {
  constructor(private readonly fraudPub: FraudPub) {}

  async checkTransaction(
    transactionId: string,
    amount: number,
    userId: string,
    userEmail: string,
  ): Promise<void> {
    const upperAmount = amount > 40;
    // Aqui entra regras para validar a autenticidade da transação,
    //  antes de enviar para o module que de fato irá gerar a transação
    if (upperAmount) {
      return await this.fraudPub.reproveTransaction(transactionId);
    }
    return await this.fraudPub.approveTransaction(
      transactionId,
      userId,
      amount,
      userEmail,
    );
  }
}
