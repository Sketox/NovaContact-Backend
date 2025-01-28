import { Injectable } from '@nestjs/common';
import { DataSnapshot, push, get, query, ref, set, orderByChild, equalTo, update } from 'firebase/database';
import { firebaseDataBase } from '../../firebase.config';
import * as bcrypt from 'bcryptjs'; // Asegúrate de instalar bcryptjs

@Injectable()
export class UserService {
    /**
     * Crear un nuevo usuario.
     * @param data Objeto con los datos del usuario.
     */
    async createUser(data: any): Promise<void> {
        const dataRef = ref(firebaseDataBase, 'User');

        // Encriptar la contraseña antes de guardar
        const hashedPassword = bcrypt.hashSync(data.password, 10);
        const newUser = { ...data, password: hashedPassword };

        const newElementRef = push(dataRef);
        await set(newElementRef, newUser);

        console.log('Usuario creado exitosamente');
    }

    /**
     * Obtener todos los usuarios.
     * @returns Lista de usuarios en la base de datos.
     */
    async getUser(): Promise<any> {
        const dataRef = ref(firebaseDataBase, 'User');
        const snapshot: DataSnapshot = await get(dataRef);
        console.log('Usuarios recibidos exitosamente');
        return snapshot.val();
    }

    /**
     * Buscar usuario por email y validar la contraseña.
     * @param email Email del usuario.
     * @param password Contraseña del usuario.
     * @returns Datos del usuario autenticado o error si no coincide.
     */
    async findUserByEmailAndPassword(email: string, password: string): Promise<any> {
        const dataRef = ref(firebaseDataBase, 'User');

        // Crear consulta para buscar por email
        const userQuery = query(dataRef, orderByChild('email'), equalTo(email));

        try {
            const snapshot: DataSnapshot = await get(userQuery);

            if (snapshot.exists()) {
                const users = snapshot.val();
                const userId = Object.keys(users)[0]; // Obtener la primera coincidencia
                const user = users[userId];

                // Validar la contraseña
                const isPasswordValid = bcrypt.compareSync(password, user.password);

                if (isPasswordValid) {
                    console.log('Usuario autenticado:', user, userId);
                    return {user, userId} ;
                } else {
                    throw new Error('Contraseña incorrecta');
                }
            } else {
                throw new Error('Usuario no encontrado');
            }
        } catch (error) {
            console.error('Error al buscar usuario:', error.message);
            throw error;
        }
    }
    
}

