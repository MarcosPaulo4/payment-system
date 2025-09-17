import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import 'reflect-metadata';

type Themes =
  | 'alternate'
  | 'default'
  | 'moon'
  | 'purple'
  | 'solarized'
  | 'bluePlanet'
  | 'deepSpace'
  | 'saturn'
  | 'kepler'
  | 'elysiajs'
  | 'fastify'
  | 'mars'
  | 'none';

export class SwaggerBuilder {
  #swaggerConfig = new DocumentBuilder();

  constructor(private readonly app: INestApplication) {}

  config(title: string): this {
    this.#swaggerConfig.setTitle(title);
    this.#swaggerConfig.addBearerAuth();

    if (process.env.NODE_ENV === 'development') {
      this.#swaggerConfig.addServer(
        `http://localhost:${process.env.PORT}`,
        'local',
      );
    }

    return this;
  }

  async build(theme: Themes = 'purple'): Promise<void> {
    const document = SwaggerModule.createDocument(
      this.app,
      this.#swaggerConfig.build(),
    );

    this.app.use(
      '/swagger',
      apiReference({
        theme,
        layout: 'modern',
        metaData: {
          author: 'Marcos',
          creator: 'Marcos Paulo',
          appleMobileWebAppStatusBarStyle: 'black-translucent',
          title: 'Payment-API',
        },
        cdn: 'https://cdn.jsdelivr.net/npm/@scalar/api-reference@latest',
        content: document,
      }),
    );
  }
}
