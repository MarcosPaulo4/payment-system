import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { DEFAULT_QUEUE_OPTIONS } from '../../config/rabbit.config';

export function DLXSubscribe(opts: any) {
  return RabbitSubscribe({
    ...opts,
    queueOptions: {
      ...DEFAULT_QUEUE_OPTIONS,
      ...opts.queueOptions,
    },
  });
}
