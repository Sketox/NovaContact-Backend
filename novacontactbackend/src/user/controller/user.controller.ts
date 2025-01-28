import { Controller, Post, Get, Body, Delete,Put, Param } from '@nestjs/common';
import { UserService } from 'user/service/user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    /**
     * Endpoint para crear un nuevo usuario.
     * @param data Datos del usuario.
     */
    @Post('createUser')
    async createData(@Body() data: any): Promise<void> {
        await this.userService.createUser(data);
    }

    /**
     * Endpoint para obtener todos los usuarios.
     * @returns Lista de usuarios.
     */
    @Get('getUser')
    async getData(): Promise<any> {
        return this.userService.getUser();
    }

    /**
     * Endpoint para autenticar un usuario por email y contraseña.
     * @param credentials Objeto con email y password.
     * @returns Usuario autenticado o error si no coincide.
     */
    @Post('authenticate')
    async authenticateUser(@Body() credentials: { email: string; password: string }): Promise<any> {
        const { email, password } = credentials;
        const result = await this.userService.findUserByEmailAndPassword(email, password);
        return result; // Retorna { userId, user }
    }
}

