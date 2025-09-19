export const DLX_EXCHANGE = 'dead-letter-exchange';
export const DLX_QUEUE = 'dead-letter-queue';
export const DLX_ROUTING_KEY = 'failed';

export const rabbitConfig = {
  exchanges: [
    { name: 'transactions', type: 'topic' },
    { name: 'fraud', type: 'topic' },
  ],
};

export const DEFAULT_QUEUE_OPTIONS = {
  durable: true,
  arguments: {
    'x-dead-letter-exchange': DLX_EXCHANGE,
    'x-dead-letter-routing-key': DLX_ROUTING_KEY,
    'x-message-ttl': 10000,
  },
};
