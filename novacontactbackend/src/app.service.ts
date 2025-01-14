import { Injectable, Inject } from '@nestjs/common';
// import { FIREBASE_ADMIN } from './firebase/firebase.module'; // Importa el token
// import * as admin from 'firebase-admin';

@Injectable()
export class AppService {
  getHello(): string {
    throw new Error('Method not implemented.');
  }
 

  // async getHello(): Promise<string> {
    // Ejemplo de uso de Firebase
    // const firestore = this.firebaseAdmin.firestore();
    // const doc = await firestore.collection('test').doc('example').get();
    // return doc.exists ? 'Hello World!' : 'Document not found';
  // }
}