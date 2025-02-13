import { Body, Controller, Post, Get, Param, Delete, Put, UploadedFile, UseInterceptors} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TutorialService } from '../service/tutorial.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

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
     * Endpoint para subir una imagen.
     * @param file Archivo de imagen recibido.
     */
      @Post('uploadImage')
      @UseInterceptors(FileInterceptor('image', {
          storage: diskStorage({
              destination: './uploads', // Directorio donde se guardarán las imágenes
              filename: (req, file, callback) => {
                  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                  const ext = extname(file.originalname);
                  callback(null, `image-${uniqueSuffix}${ext}`);
              }
          })
      }))
      async uploadImage(@UploadedFile() file: Express.Multer.File) {
          return {
              message: 'Imagen subida exitosamente',
              filePath: `/uploads/${file.filename}`
          };
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
     * Endpoint para obtener datos de contacto por contactId.
     * @param contactId ID del contacto.
     * @returns Datos del contacto asociado.
     */
    @Get('getContactById/:contactId')
    async getContactById(@Param('contactId') contactId: string): Promise<any> {
        try {
            // Llamamos al servicio para obtener el contacto por ID
            const contact = await this.tutorialService.getContactById(contactId);

            // Si no se encuentra el contacto, retornamos un mensaje con 404 (No encontrado)
            if (!contact) {
                return { message: `No se encontró el contacto con ID: ${contactId}` };
            }

            // Si se encuentra, lo devolvemos
            return contact;
        } catch (error) {
            // En caso de error, retornamos un mensaje de error
            return { message: 'Error al obtener el contacto', error: error.message };
        }
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
    // Endpoint para buscar un contacto por nombre
    @Get('searchContact/:name')
    async searchContact(@Param('name') name: string): Promise<any> {
        try {
            const contact = await this.tutorialService.searchContactByName(name);

            if (!contact) {
                return { message: `No se encontró ningún contacto con el nombre: ${name}` };
            }

            return contact;
        } catch (error) {
            return { message: 'Error al buscar el contacto', error: error.message };
        }
    }
}

