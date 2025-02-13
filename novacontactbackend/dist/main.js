"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const express = require("express");
const multer = require("multer");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: 'http://localhost:3001',
        methods: 'GET,POST,PUT,DELETE,PATCH,HEAD',
        credentials: true
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    const upload = multer({ dest: 'uploads/' });
    app.use('/uploads', express.static((0, path_1.join)(__dirname, '..', 'uploads')));
    await app.listen(3000);
    console.log(`🚀 Servidor corriendo en: http://localhost:3000/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map