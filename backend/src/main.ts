import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security Headers
  app.use(helmet());

  // Rate Limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again after 15 minutes',
    }),
  );

  // Validation
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Change Control API')
    .setDescription('API para gestão de controle de mudanças (RFC)')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // CORS
  app.enableCors();

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
