import { DynamicModule, Global, Module } from '@nestjs/common';
import * as amqp from 'amqplib';
import { AmqpService } from './amqp.service';

export interface AmqpModuleOptions {
  url: string;
  exchanges: { name: string; type: string }[];
}
@Global()
@Module({})
export class AmqpModule {
  static registerAsync(options: {
    imports?: any[];
    inject?: any[];
    useFactory: (
      ...args: any[]
    ) => AmqpModuleOptions | Promise<AmqpModuleOptions>;
  }): DynamicModule {
    return {
      module: AmqpModule,
      imports: options.imports || [],
      providers: [
        {
          provide: 'AMQP_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        {
          provide: 'AMQP_CONNECTION',
          useFactory: async (opts: AmqpModuleOptions) => amqp.connect(opts.url),
          inject: ['AMQP_OPTIONS'],
        },
        {
          provide: 'AMQP_CHANNEL',
          useFactory: async (
            connection: amqp.Connection,
            opts: AmqpModuleOptions,
          ) => {
            const channel = await connection.createChannel();
            if (opts.exchanges) {
              for (const ex of opts.exchanges) {
                await channel.assertExchange(ex.name, ex.type, {
                  durable: true,
                });
              }
            }
            return channel;
          },
          inject: ['AMQP_CONNECTION', 'AMQP_OPTIONS'],
        },
        AmqpService,
      ],
      exports: [AmqpService, 'AMQP_CONNECTION', 'AMQP_CHANNEL'],
    };
  }
}
