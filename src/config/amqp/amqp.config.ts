export const DLX_EXCHANGE = 'dead-letter-exchange';
export const DLX_QUEUE = 'dead-letter-queue';
export const DLX_ROUTING_KEY = 'failed';

export const amqpConfig = {
  exchanges: [
    { name: 'transactions', type: 'topic' },
    { name: 'fraud', type: 'topic' },
    { name: DLX_EXCHANGE, type: 'fanout' },
  ],
};
