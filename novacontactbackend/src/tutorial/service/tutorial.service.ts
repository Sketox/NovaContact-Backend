import { Injectable } from '@nestjs/common';
import { DataSnapshot, push, get, ref, set, query, orderByChild, equalTo, update, remove } from 'firebase/database';
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
   /**
     * Obtiene los datos de un contacto por su contactId.
     * @param contactId ID del contacto.
     * @returns Datos del contacto asociado.
     */
   async getContactById(contactId: string): Promise<any> {
    try {
        const contactRef = ref(firebaseDataBase, `Data/${contactId}`);
        const snapshot = await get(contactRef);

        // Verificar si existe el contacto
        if (!snapshot.exists()) {
            console.log(`No se encontró el contacto con ID: ${contactId}`);
            return null;
        }

        console.log(`Contacto encontrado con ID: ${contactId}`);
        return { id: contactId, ...snapshot.val() };
    } catch (error) {
        console.error('Error al obtener el contacto:', error);
        throw new Error('No se pudo recuperar el contacto.');
    }
}
   // Editar un contacto
  async editContact(contactId: string, contactData: any): Promise<void> {
    const contactRef = ref(firebaseDataBase, `Data/${contactId}`);
    await update(contactRef, contactData);
    console.log(`Contacto ${contactId} editado exitosamente`);
  }
// Eliminar un contacto
  async deleteContact(contactId: string): Promise<void> {
    const contactRef = ref(firebaseDataBase, `Data/${contactId}`);
    await remove(contactRef);
    console.log(`Contacto ${contactId} eliminado exitosamente`);
  }
    
}
