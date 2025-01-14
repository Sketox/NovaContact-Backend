import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() // Este decorador es crucial para mapear la ruta '/'
  getHello(): string {
    return this.appService.getHello();
  }
}
