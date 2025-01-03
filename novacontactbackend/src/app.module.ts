import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module'; // Importa el módulo de Firebase

@Module({
  imports: [FirebaseModule], // Asegúrate de que FirebaseModule esté aquí
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
