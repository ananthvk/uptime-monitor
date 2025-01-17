import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'fatal', 'debug', 'verbose']
  });
  app.enableCors();
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
