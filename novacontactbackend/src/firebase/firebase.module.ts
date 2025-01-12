import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';

export const FIREBASE_ADMIN = 'FIREBASE_ADMIN';

@Module({
  providers: [
    {
      provide: FIREBASE_ADMIN,
      useValue: admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      }),
    },
  ],
  exports: [FIREBASE_ADMIN], // Exporta el token para que pueda ser inyectado
})
export class FirebaseModule {}