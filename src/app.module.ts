import { Module } from '@nestjs/common';
import { FraudModule } from './modules/fraud/fraud.module';
import { TransactionModule } from './modules/transactions/transaction.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [UserModule, TransactionModule, FraudModule],
})
export class AppModule {}
