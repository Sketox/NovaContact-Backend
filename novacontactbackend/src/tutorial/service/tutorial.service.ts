import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  DataSnapshot,
  push,
  get,
  ref,
  set,
  query,
  orderByChild,
  equalTo,
  update,
  remove,
} from 'firebase/database';
import { firebaseDataBase } from '../../firebase.config';
import { getDatabase } from 'firebase/database';
@Injectable()
export class TutorialService {
  /**
   * Crea un nuevo dato en la base de datos.
   * @param data Datos a guardar.
   */
  async createData(data: any): Promise<void> {
    const dataRef = ref(firebaseDataBase, 'Data');
    const newElementRef = push(dataRef);
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
    console.log('Datos recibidos exitosamente');
    return snapshot.val();
  }

  /**
   * Guarda solo el nombre de la imagen en Firebase.
   * @param imageName Nombre de la imagen.
   */
  async saveImageData(imageName: string): Promise<void> {
    const dataRef = ref(firebaseDataBase, 'Images');
    const newElementRef = push(dataRef);
    await set(newElementRef, {
      name: imageName,
      uploadedAt: new Date().toISOString(),
    });
    console.log('Imagen guardada en Firebase con nombre: ${imageName}');
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

      if (!snapshot.exists()) {
        console.log(
          'No se encontraron datos para el usuario con ID: ${userId}',
        );
        return [];
      }

      // Convertir snapshot en array
      const results: any[] = [];
      snapshot.forEach((childSnapshot) => {
        results.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });

      console.log('Datos encontrados para el usuario con ID: ${userId}');

      // Aplicar QuickSort para ordenar alfabéticamente por 'name'
      return this.quickSort(results);
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
      console.log(`📡 Consultando Firebase por ID: ${contactId}`);

      const database = getDatabase();
      const contactRef = ref(database, `Data/${contactId}`);
      const snapshot = await get(contactRef);

      return snapshot.val();
    } catch (error) {
      console.error(
        `🔥 Error en Firebase al obtener contacto (${contactId}):`,
        error.message,
      );
      throw error;
    }
  }

  /**
   * Edita un contacto en la base de datos.
   * @param contactId ID del contacto.
   * @param contactData Nuevos datos del contacto.
   */
  async editContact(contactId: string, contactData: any): Promise<void> {
    try {
      console.log(`🔄 Actualizando contacto en Firebase con ID: ${contactId}`);

      // Validar el ID del contacto
      if (!contactId || /[.#$[\]]/.test(contactId)) {
        throw new NotFoundException(
          `El ID de contacto '${contactId}' es inválido.`,
        );
      }

      // Obtener la referencia correcta en Firebase
      const database = getDatabase();
      const contactRef = ref(database, `Data/${contactId}`);

      // Actualizar el contacto en Firebase
      await update(contactRef, contactData);
      console.log(`✅ Contacto ${contactId} editado exitosamente`);
    } catch (error) {
      console.error(
        `🔥 Error al editar contacto en Firebase (${contactId}):`,
        error.message,
      );
      throw new InternalServerErrorException('No se pudo editar el contacto.');
    }
  }

  /**
   * Elimina un contacto de la base de datos.
   * @param contactId ID del contacto.
   */
  async deleteContact(contactId: string): Promise<void> {
    try {
      console.log(
        `🔍 Verificando existencia del contacto con ID: ${contactId}`,
      );

      // Validar ID del contacto
      if (!contactId || /[.#$[\]]/.test(contactId)) {
        throw new NotFoundException(
          `El ID de contacto '${contactId}' es inválido.`,
        );
      }

      const database = getDatabase();
      const contactRef = ref(database, `Data/${contactId}`);

      // Verificar si el contacto existe antes de eliminarlo
      const snapshot = await get(contactRef);
      if (!snapshot.exists()) {
        console.error(`⚠️ Contacto con ID ${contactId} no encontrado.`);
        throw new NotFoundException(
          `No se encontró el contacto con ID: ${contactId}`,
        );
      }

      // Eliminar el contacto
      await remove(contactRef);
      console.log(`✅ Contacto ${contactId} eliminado exitosamente`);
    } catch (error) {
      console.error(
        `🔥 Error al eliminar contacto en Firebase (${contactId}):`,
        error.message,
      );
      throw new InternalServerErrorException(
        'No se pudo eliminar el contacto.',
      );
    }
  }

  /**
   * Busca contactos por nombre usando búsqueda binaria recursiva.
   * @param prefix Prefijo del nombre del contacto.
   * @returns Lista de contactos encontrados.
   */
  async searchContactByName(prefix: string): Promise<any[]> {
    try {
      const dataRef = ref(firebaseDataBase, 'Data');
      const snapshot = await get(dataRef);

      if (!snapshot.exists()) {
        console.log('No hay contactos en la base de datos.');
        return [];
      }

      const contacts: any[] = [];
      snapshot.forEach((childSnapshot) => {
        contacts.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });

      // Ordenar los contactos con QuickSort
      const sortedContacts = this.quickSort(contacts);

      // Encontrar el índice del primer contacto que coincide con el prefijo
      const startIndex = this.binarySearchPrefix(sortedContacts, prefix);
      if (startIndex === -1) return [];

      // Filtrar los contactos que comienzan con el prefijo
      const normalizedPrefix = prefix.toLowerCase();
      const results: any[] = [];

      for (let i = startIndex; i < sortedContacts.length; i++) {
        if (sortedContacts[i].name.toLowerCase().startsWith(normalizedPrefix)) {
          results.push(sortedContacts[i]);
        } else {
          break;
        }
      }

      return results;
    } catch (error) {
      console.error('Error al buscar el contacto:', error);
      throw new Error('No se pudo realizar la búsqueda del contacto.');
    }
  }

  /**
   * Algoritmo de búsqueda binaria para encontrar el primer contacto con un prefijo.
   */
  private binarySearchPrefix(arr: any[], prefix: string): number {
    let left = 0,
      right = arr.length - 1;
    let resultIndex = -1;
    const normalizedPrefix = prefix.toLowerCase();

    while (left <= right) {
      let mid = Math.floor((left + right) / 2);
      let contactName = arr[mid].name.toLowerCase();

      if (contactName.startsWith(normalizedPrefix)) {
        resultIndex = mid;
        right = mid - 1;
      } else if (contactName.localeCompare(normalizedPrefix) < 0) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return resultIndex;
  }

  /**
   * Algoritmo QuickSort para ordenar los contactos por nombre.
   */
  private quickSort(arr: any[]): any[] {
    if (arr.length <= 1) return arr;

    const pivotIndex = Math.floor(arr.length / 2);
    const pivot = arr[pivotIndex];
    const left: any[] = [];
    const right: any[] = [];

    for (let i = 0; i < arr.length; i++) {
      if (i === pivotIndex) continue;
      if (arr[i].name.localeCompare(pivot.name) < 0) {
        left.push(arr[i]);
      } else {
        right.push(arr[i]);
      }
    }

    return [...this.quickSort(left), pivot, ...this.quickSort(right)];
  }
}
