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

    const modules = this.moduleRef['container'].getModules().values();
    for (const module of modules) {
      for (const wrapper of module.providers.values()) {
        const { instance } = wrapper;
        if (!instance) continue;

        const subs: { methodName: string; options: SubscribeOptions }[] =
          Reflect.getMetadata(SUBSCRIBE_METADATA, instance.constructor) || [];

        for (const sub of subs) {
          await this.registerConsumer(instance, sub.options, sub.methodName);
        }
      }
    }
  }

  private async registerConsumer(
    instance: any,
    options: SubscribeOptions,
    methodName: string | symbol,
  ) {
    await this.channel.assertQueue(options.queue, { durable: true });
    await this.channel.bindQueue(
      options.queue,
      options.exchange,
      options.routingKey,
    );

    await this.channel.consume(options.queue, async (msg) => {
      if (!msg) return;
      try {
        const payload = JSON.parse(msg.content.toString());
        await instance[methodName](payload);
        this.channel.ack(msg);
      } catch (err) {
        console.error('Erro no consumer:', err);
        this.channel.nack(msg, false, false);
      }
    });
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
