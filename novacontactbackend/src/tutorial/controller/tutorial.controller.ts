import { Body, Controller, Post, Get, Param, Delete, Put } from '@nestjs/common';
import { TutorialService } from '../service/tutorial.service';

@Controller('tutorial')
export class TutorialController {
    constructor(private readonly tutorialService: TutorialService) {}

    /**
     * Endpoint para crear un nuevo dato.
     * @param data Datos a guardar.
     */
    @Post('createData')
    async createData(@Body() data: any): Promise<void> {
        await this.tutorialService.createData(data);
    }

    /**
     * Endpoint para obtener todos los datos.
     * @returns Lista de datos.
     */
    @Get('getData')
    async getData(): Promise<any> {
        return this.tutorialService.getData();
    }

    /**
   * Endpoint para obtener datos de contacto por ID de usuario.
   * @param userId ID del usuario.
   * @returns Datos del contacto asociado.
   */
    @Get('getContact/:userId') // Ruta dinámica para obtener contactos por userId
    async getContactByUserId(@Param('userId') userId: string): Promise<any> {
      try {
        // Llamamos al servicio para obtener los contactos
        const contacts = await this.tutorialService.getContactByUserId(userId);
  
        // Si no se encuentran contactos, retornamos un mensaje con 404 (No encontrado)
        if (!contacts) {
          return { message: `No se encontraron datos para el usuario con ID: ${userId}` };
        }
  
        // Si se encuentran contactos, los devolvemos
        return contacts;
      } catch (error) {
        // En caso de error, retornamos un mensaje de error
        return { message: 'Error al obtener los datos', error: error.message };
      }
    }
    // Endpoint para editar un contacto
    @Put('editContact/:contactId')
    async editContact(@Param('contactId') contactId: string, @Body() contactData: any): Promise<any> {
        try {
            await this.tutorialService.editContact(contactId, contactData);
            return { message: 'Contacto editado exitosamente' };
        } catch (error) {
            return { message: 'Error al editar el contacto', error: error.message };
        }
    }

    // Endpoint para eliminar un contacto
    @Delete('deleteContact/:contactId')
    async deleteContact(@Param('contactId') contactId: string): Promise<any> {
        try {
            await this.tutorialService.deleteContact(contactId);
            return { message: 'Contacto eliminado exitosamente' };
        } catch (error) {
            return { message: 'Error al eliminar el contacto', error: error.message };
        }
    }
}

