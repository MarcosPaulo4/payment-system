import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { amqpConfig } from './config/amqp/amqp.config';
import { AmqpModule } from './messaging/amqp.module';
import { FraudModule } from './modules/fraud/fraud.module';
import { PaymentModule } from './modules/payment/payment.module';
import { StripeModule } from './modules/stripe/stripe.module';
import { TransactionModule } from './modules/transactions/transaction.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AmqpModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        url:
          configService.get<string>('RABBITMQ_URL') || 'amqp://localhost:5672',
        exchanges: amqpConfig.exchanges,
      }),
    }),
    UserModule,
    TransactionModule,
    FraudModule,
    PaymentModule,
    StripeModule,
  ],
})
export class AppModule {}
