import {
  RabbitMQModule as GoRabbitModule,
  RabbitMQModule,
} from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { rabbitConfig } from '../config/rabbit.config';

@Module({
  imports: [
    GoRabbitModule.forRoot({
      uri: process.env.RABBITMQ_URL,
      exchanges: rabbitConfig.exchanges,
      connectionInitOptions: { wait: true },
    }),
  ],
  exports: [RabbitMQModule],
})
export class MessagingModule {}
