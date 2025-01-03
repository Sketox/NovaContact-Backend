import { Module, Global } from '@nestjs/common';
import admin from '../firebase.config';

// Define el token FIREBASE_ADMIN como una constante
export const FIREBASE_ADMIN = 'FIREBASE_ADMIN';

@Global()
@Module({
  providers: [
    {
      provide: FIREBASE_ADMIN, // Usa el token aquí
      useValue: admin, // Proporciona la instancia de Firebase Admin
    },
  ],
  exports: [FIREBASE_ADMIN], // Exporta el token para que otros módulos lo usen
})
export class FirebaseModule {}