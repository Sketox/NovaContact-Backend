import { Injectable } from '@nestjs/common';
import { DataSnapshot, push, get, ref, set, query, orderByChild, equalTo } from 'firebase/database';
import { firebaseDataBase } from '../../firebase.config';

@Injectable()
export class TutorialService {
    /**
     * Crea un nuevo dato en la base de datos.
     * @param data Datos a guardar.
     */
    async createData(data: any): Promise<void> {
        const dataRef = ref(firebaseDataBase, 'Data');
        const newElementRef = push(dataRef, { dataRef: data });
        await set(newElementRef, data);
        console.log('Se creó exitosamente');
    }

    /**
     * Obtiene todos los datos de la base de datos.
     * @returns Lista de datos.
     */
    async getData(): Promise<any> {
        const dataRef = ref(firebaseDataBase, 'Data');
        const snapshot: DataSnapshot = await get(dataRef);
        console.log("Datos recibidos exitosamente");
        return snapshot.val();
        
    }

    /**
   * Obtiene los datos de un contacto por el ID de usuario.
   * @param userId ID del usuario.
   * @returns Datos del contacto asociado al usuario.
   */
  async getContactByUserId(userId: string): Promise<any> {
    try {
      const dataRef = ref(firebaseDataBase, 'Data');
      const userQuery = query(dataRef, orderByChild('userId'), equalTo(userId));

      // Ejecutar la consulta
      const snapshot = await get(userQuery);

      // Verificar si existen resultados
      if (!snapshot.exists()) {
        console.log(`No se encontraron datos para el usuario con ID: ${userId}`);
        return null;
      }

      // Procesar resultados
      const results: any[] = [];
      snapshot.forEach((childSnapshot) => {
        results.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });

      console.log(`Datos encontrados para el usuario con ID: ${userId}`);
      console.log(results)
      return results;
      
    } catch (error) {
      console.error('Error al obtener los contactos:', error);
      throw new Error('No se pudieron recuperar los contactos.');
    }
  }
    
}
