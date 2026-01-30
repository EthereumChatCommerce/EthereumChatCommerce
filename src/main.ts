import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const origins = config.get<string>('ALLOWED_ORIGINS');
  app.enableCors({
    origin: origins === '*' ? true : origins?.split(',').map((o) => o.trim()) ?? true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('ChatCommerce API')
    .setDescription(
      'REST API for ChatCommerce. For real-time WebSocket events see [docs/WEBSOCKET.md](docs/WEBSOCKET.md).',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  const port = config.get<number>('PORT') ?? config.get<number>('APP_PORT') ?? 3000;
  await app.listen(port);
}
bootstrap();
