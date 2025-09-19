// subscribe.decorator.ts
import 'reflect-metadata';

export const SUBSCRIBE_METADATA = 'SUBSCRIBE_METADATA';

export interface SubscribeOptions {
  exchange: string;
  routingKey: string;
  queue: string;
  queueOptions?: any;
}

export function Subscribe(options: SubscribeOptions): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    const existing =
      Reflect.getMetadata(SUBSCRIBE_METADATA, target.constructor) || [];
    existing.push({ methodName: propertyKey, options });
    Reflect.defineMetadata(SUBSCRIBE_METADATA, existing, target.constructor);
    return descriptor;
  };
}
