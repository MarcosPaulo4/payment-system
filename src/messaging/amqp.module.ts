import { DynamicModule, Module } from '@nestjs/common';
import * as amqp from 'amqplib';
import { AmqpService } from './amqp.service';

export interface AmqpModuleOptions {
  url: string;
  exchanges: { name: string; type: string }[];
}

@Module({})
export class AmqpModule {
  static registerAsync(options: AmqpModuleOptions): DynamicModule {
    return {
      module: AmqpModule,
      providers: [
        {
          provide: 'AMQP_OPTIONS',
          useValue: options,
        },
        {
          provide: 'AMQP_CONNECTION',
          useFactory: async () => {
            return await amqp.connect(options.url);
          },
        },
        {
          provide: 'AMQP_CHANNEL',
          useFactory: async (connection: amqp.Connection) => {
            const channel = await connection.createChannel();
            if (options.exchanges) {
              for (const ex of options.exchanges) {
                await channel.assertExchange(ex.name, ex.type, {
                  durable: true,
                });
              }
            }
            return channel;
          },
          inject: ['AMQP_CONNECTION'],
        },
        AmqpService,
      ],
      exports: [AmqpService, 'AMQP_CONNECTION', 'AMQP_CHANNEL'],
    };
  }
}
