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
    async saveImageData(imageUrl: string): Promise<void> {
        const dataRef = ref(firebaseDataBase, 'Images');
        const newElementRef = push(dataRef);
        await set(newElementRef, { url: imageUrl, uploadedAt: new Date().toISOString() });

        console.log('Imagen guardada en Firebase');
    }

    /**
   * Obtiene los datos de un contacto por el ID de usuario.
   * @param userId ID del usuario.
   * @returns Datos del contacto asociado al usuario.
   */
    async getContactByUserId(userId: string): Promise<any[]> {
      try {
          const dataRef = ref(firebaseDataBase, 'Data');
          const userQuery = query(dataRef, orderByChild('userId'), equalTo(userId));
  
          // Ejecutar la consulta
          const snapshot = await get(userQuery);
  
          // Verificar si existen resultados
          if (!snapshot.exists()) {
              console.log(`No se encontraron datos para el usuario con ID: ${userId}`);
              return [];
          }
  
          // Convertir snapshot en array
          const results: any[] = [];
          snapshot.forEach((childSnapshot) => {
              results.push({ id: childSnapshot.key, ...childSnapshot.val() });
          });
  
          console.log(`Datos encontrados para el usuario con ID: ${userId}`);
  
          // Aplicar QuickSort para ordenar alfabéticamente por 'name'
          return quickSort(results);
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
  /**
 * Busca un contacto por nombre usando búsqueda binaria recursiva.
 * @param name Nombre del contacto a buscar.
 * @returns Contacto encontrado o null si no existe.
 */
async searchContactByName(name: string): Promise<any | null> {
    try {
        // 1. Obtener todos los contactos de Firebase
        const dataRef = ref(firebaseDataBase, 'Data');
        const snapshot = await get(dataRef);

        // 2. Si la base de datos está vacía, no hay contactos para buscar
        if (!snapshot.exists()) {
            console.log("No hay contactos en la base de datos.");
            return null;
        }

        // 3. Convertimos los datos obtenidos en un array de objetos
        const contacts: any[] = [];
        snapshot.forEach((childSnapshot) => {
            contacts.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });

        // 4. Ordenamos los contactos alfabéticamente por el atributo 'name'
        const sortedContacts = quickSort(contacts);

        // 5. Aplicamos búsqueda binaria recursiva para encontrar el contacto
        return binarySearchRecursive(sortedContacts, name, 0, sortedContacts.length - 1);
    } catch (error) {
        console.error('Error al buscar el contacto:', error);
        throw new Error('No se pudo realizar la búsqueda del contacto.');
    }
}

}
/**
 * Algoritmo de búsqueda binaria recursiva.
 * @param arr Lista ordenada de contactos.
 * @param target Nombre a buscar.
 * @param left Índice izquierdo.
 * @param right Índice derecho.
 * @returns Contacto encontrado o null.
 */
function binarySearchRecursive(arr: any[], target: string, left: number, right: number): any | null {
    // 1. Caso base: Si los límites se cruzan, el elemento no está en la lista
    if (left > right) return null;

    // 2. Calculamos el índice medio
    const mid = Math.floor((left + right) / 2);

    // 3. Comparamos el nombre del elemento medio con el objetivo
    const comparison = arr[mid].name.localeCompare(target);

    if (comparison === 0) {
        // 4. Si son iguales, hemos encontrado el contacto y lo retornamos
        return arr[mid];
    } else if (comparison > 0) {
        // 5. Si el nombre medio es mayor al objetivo, buscamos en la mitad izquierda
        return binarySearchRecursive(arr, target, left, mid - 1);
    } else {
        // 6. Si el nombre medio es menor al objetivo, buscamos en la mitad derecha
        return binarySearchRecursive(arr, target, mid + 1, right);
    }
}


function quickSort(arr: any[]): any[] {
  if (arr.length <= 1) return arr;

  const pivot = arr[arr.length - 1]; // Último elemento como pivote
  const left = [];
  const right = [];

  for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i].name.localeCompare(pivot.name) < 0) {
          left.push(arr[i]); // Menor al pivote
      } else {
          right.push(arr[i]); // Mayor o igual al pivote
      }
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
}

