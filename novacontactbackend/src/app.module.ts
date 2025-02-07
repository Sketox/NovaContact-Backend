import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TutorialModule } from './tutorial/tutorial.module';
import { UserModule } from './user/user.module';
import { RoomService } from './room/service/room.service';
import {RoomModule} from './room/room.module';
import { UploadModule } from 'upload/upload.module';
 // Importa el módulo de Firebase

@Module({
  controllers: [AppController],
  providers: [AppService, RoomService],
  imports: [TutorialModule, UserModule, RoomModule, UploadModule],
})
export class AppModule {}
