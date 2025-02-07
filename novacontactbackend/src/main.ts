import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as multer from 'multer';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar prefijo global para la API (opcional)
  app.setGlobalPrefix('api');

  // Habilitar CORS (para frontend en localhost:3001)
  app.enableCors({
    origin: 'http://localhost:3001',
    methods: 'GET,POST,PUT,DELETE,PATCH,HEAD',
    credentials: true
  });

  // Habilitar validaciones automáticas
  app.useGlobalPipes(new ValidationPipe());

  // Configurar Multer para manejar archivos en el sistema de archivos
  const upload = multer({ dest: 'uploads/' }); // Guardará archivos en la carpeta "uploads"
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  await app.listen(3000);
  console.log(`🚀 Servidor corriendo en: http://localhost:3000/api`);
}

bootstrap();
