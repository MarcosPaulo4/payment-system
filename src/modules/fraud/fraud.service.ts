import { Injectable } from '@nestjs/common';
import { RabbitMQService } from '../../common/messaging/rabbitmq.service';

@Injectable()
export class FraudService {
  constructor(private readonly rabbitMq: RabbitMQService) {}
}
