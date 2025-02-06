import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configura CORS si es necesario
  app.enableCors({
    origin: 'http://localhost:3001',
    methods: 'GET,POST,PUT,DELETE,PATCH,HEAD',
    credentials: true
  });

  await app.listen(3000);
}
bootstrap();
