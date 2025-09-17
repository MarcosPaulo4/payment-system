import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerBuilder } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  const swaggerBuilder = new SwaggerBuilder(app);
  swaggerBuilder.config('Payment-API');
  await swaggerBuilder.build('purple');

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
