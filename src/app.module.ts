import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { amqpConfig } from './config/amqp/amqp.config';
import { AmqpModule } from './messaging/amqp.module';
import { FraudModule } from './modules/fraud/fraud.module';
import { TransactionModule } from './modules/transactions/transaction.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AmqpModule.registerAsync({
      url: process.env.AMQP_URL || 'amqp://localhost:5672',
      exchanges: amqpConfig.exchanges,
    }),

    UserModule,
    TransactionModule,
    FraudModule,
  ],
})
export class AppModule {}
