import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { join } from 'path';

async function bootstrap() {
  // Load env file before anything else
  const envPath = join(process.cwd(), '.env');
  console.log('Loading .env file from:', envPath);
  const result = dotenv.config({ path: envPath });
  
  if (result.error) {
    console.error('Error loading .env file:', result.error);
    throw result.error;
  }

  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidUnknownValues: true,
      transform: true,
      validateCustomDecorators: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT') || 3000; // Added default
  const originUrl = configService.get<string>('APP_ORIGIN') || 'http://localhost:3000'; // Added default

  app.enableCors({
    credentials: true,
    origin: originUrl,
  });

  console.log(`Server starting on port ${port}`);
  await app.listen(port);
}

bootstrap().catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
});