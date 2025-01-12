import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TutorialModule } from './tutorial/tutorial.module';
 // Importa el módulo de Firebase

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [TutorialModule],
})
export class AppModule {}
