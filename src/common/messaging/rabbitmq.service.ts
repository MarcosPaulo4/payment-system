import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  private readonly url = process.env.RABBITMQ_URL;

  async onModuleInit() {
    let connected = false;
    while (!connected) {
      try {
        this.connection = await amqp.connect(this.url);
        this.channel = await this.connection.createChannel();
        console.log('[RabbitMQ] Conectado');
        connected = true;
      } catch (err) {
        console.log('[RabbitMQ] Aguardando serviço...', err.message);
        await new Promise((res) => setTimeout(res, 3000));
      }
    }
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }

  async assertExchange(exchange: string) {
    await this.channel.assertExchange(exchange, 'topic', { durable: true });
  }

  async assertQueueWithDLX(
    queue: string,
    exchange: string,
    routingKey: string,
    dlxExchange: string,
    dlxQueue: string,
  ) {
    await this.channel.assertExchange(dlxExchange, 'fanout', { durable: true });
    await this.channel.assertQueue(dlxQueue, { durable: true });
    await this.channel.bindQueue(dlxQueue, dlxExchange, '');

    await this.assertExchange(exchange);

    await this.channel.assertQueue(queue, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': dlxExchange,
      },
    });

    await this.channel.bindQueue(queue, exchange, routingKey);
  }

  async publish(exchange: string, routingKey: string, message: any) {
    await this.assertExchange(exchange);
    this.channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      {
        persistent: true,
      },
    );
  }

  async subscribe(
    queue: string,
    callback: (msg: any) => Promise<void>,
    maxRetries = 2,
  ) {
    this.channel.consume(queue, async (msg) => {
      if (!msg) return;
      const content = JSON.parse(msg.content.toString());

      const retries = (msg.properties.headers['x-retries'] || 0) as number;

      try {
        await callback(content);
        this.channel.ack(msg);
      } catch (error) {
        console.error(
          `Error on consuming (try ${retries + 1}):`,
          error.message,
        );

        if (retries < maxRetries) {
          this.channel.nack(msg, false, false);
          this.channel.publish(
            msg.fields.exchange,
            msg.fields.routingKey,
            msg.content,
            {
              headers: { 'x-retries': retries + 1 },
              persistent: true,
            },
          );
        } else {
          this.channel.nack(msg, false, false);
          console.error('Message sent to Dead Letter Queue');
        }
      }
    });
  }
}
