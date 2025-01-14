import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TutorialModule } from './tutorial/tutorial.module';
import { UserModule } from './user/user.module';
 // Importa el módulo de Firebase

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [TutorialModule, UserModule],
})
export class AppModule {}
