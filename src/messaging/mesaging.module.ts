import { DynamicModule, Module } from '@nestjs/common';
import { amqpConfig } from '../config/amqp/amqp.config';
import { AmqpService } from './amqp.service';

@Module({})
export class AmqpModule {
  static register(): DynamicModule {
    return {
      module: AmqpModule,
      providers: [
        {
          provide: 'AMQP_EXCHANGES',
          useValue: amqpConfig.exchanges,
        },
        AmqpService,
      ],
      exports: [AmqpService],
    };
  }
}
