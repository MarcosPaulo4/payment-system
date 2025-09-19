// amqp.service.ts
import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import * as amqp from 'amqplib';
import {
  SUBSCRIBE_METADATA,
  SubscribeOptions,
} from '../common/decorators/subscribe.decorator';

@Injectable()
export class AmqpService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  private readonly DEFAULT_DLX = {
    exchange: 'dead-letter-exchange',
    queue: 'dead-letter-queue',
    routingKey: 'failed',
    ttl: 10000,
  };

  constructor(
    @Inject('AMQP_EXCHANGES') private exchanges: any[],
    private moduleRef: ModuleRef,
  ) {}

  async onModuleInit() {
    this.connection = await amqp.connect(process.env.RABBITMQ_URL);
    this.channel = await this.connection.createChannel();

    for (const ex of this.exchanges) {
      await this.channel.assertExchange(ex.name, ex.type, { durable: true });
    }

    const providers = this.moduleRef['_container'].getProviders();
    for (const wrapper of providers.values()) {
      const { instance } = wrapper;
      if (!instance) continue;

      const subs: { methodName: string; options: SubscribeOptions }[] =
        Reflect.getMetadata(SUBSCRIBE_METADATA, instance.constructor) || [];
      for (const sub of subs) {
        await this.assertQueueWithDLX(sub.options);
        await this.channel.consume(sub.options.queue, async (msg) => {
          if (!msg) return;
          try {
            const payload = JSON.parse(msg.content.toString());
            await instance[sub.methodName](payload);
            this.channel.ack(msg);
          } catch (err) {
            console.error('Erro no consumer:', err);
            this.channel.nack(msg, false, false);
          }
        });
      }
    }
  }

  private async assertQueueWithDLX(options: SubscribeOptions) {
    const queueOpts = {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': this.DEFAULT_DLX.exchange,
        'x-dead-letter-routing-key': this.DEFAULT_DLX.routingKey,
        'x-message-ttl': this.DEFAULT_DLX.ttl,
        ...(options.queueOptions?.arguments || {}),
      },
    };
    await this.channel.assertQueue(options.queue, queueOpts);
    await this.channel.bindQueue(
      options.queue,
      options.exchange,
      options.routingKey,
    );
  }

  async publish(exchange: string, routingKey: string, message: any) {
    this.channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      { persistent: true },
    );
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
  }
}
