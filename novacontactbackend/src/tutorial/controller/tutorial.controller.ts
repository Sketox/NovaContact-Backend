import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Put,
  UploadedFile,
  UseInterceptors,
  Res,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TutorialService } from '../service/tutorial.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

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
   * Endpoint para obtener una imagen almacenada en la carpeta 'uploads'.
   * @param imageName Nombre del archivo de imagen.
   * @param res Respuesta HTTP.
   */
  @Get('getImage/:imageName')
  async getImage(
    @Param('imageName') imageName: string,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const imagePath = path.join(__dirname, '../../uploads', imageName);

      if (!fs.existsSync(imagePath)) {
        return res.status(404).json({ message: 'Imagen no encontrada' });
      }

      return res.sendFile(imagePath);
    } catch (error) {
      console.error('Error al obtener la imagen:', error);
      return res.status(500).json({ message: 'Error al recuperar la imagen' });
    }
  }
  /**
   * Endpoint para subir una imagen.
   * @param file Archivo de imagen recibido.
   */
  @Post('uploadImage')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads', // Directorio donde se guardarán las imágenes
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, 'image-${uniqueSuffix}${ext}');
        },
      }),
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('No se recibió ningún archivo');
    }

    const imageName = file.filename; // Guarda solo el nombre del archivo
    await this.tutorialService.saveImageData(imageName); // Guarda solo el nombre en Firebase

    return {
      message: 'Imagen subida exitosamente',
      fileName: imageName, // Devolver solo el nombre
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
      console.log(`🔍 Buscando contacto con ID: ${contactId}`);

      // Validar que el ID es correcto y no contiene caracteres inválidos
      if (!contactId || /[.#$[\]]/.test(contactId)) {
        throw new NotFoundException(
          `El ID de contacto '${contactId}' es inválido.`,
        );
      }

      // Obtener contacto desde el servicio
      const contact = await this.tutorialService.getContactById(contactId);

      if (!contact) {
        throw new NotFoundException(
          `No se encontró el contacto con ID: ${contactId}`,
        );
      }

      return contact;
    } catch (error) {
      console.error(
        `❌ Error al obtener contacto (${contactId}):`,
        error.message,
      );
      throw new InternalServerErrorException('Error al obtener el contacto');
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
        return {
          message: 'No se encontraron datos para el usuario con ID: ${userId}',
        };
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
  async editContact(
    @Param('contactId') contactId: string,
    @Body() contactData: any,
  ): Promise<any> {
    try {
      console.log(`📝 Editando contacto con ID: ${contactId}`, contactData);

      // Validar que el contactId sea válido
      if (!contactId || /[.#$[\]]/.test(contactId)) {
        throw new BadRequestException(
          `El ID de contacto '${contactId}' es inválido.`,
        );
      }

      // Llamar al servicio para actualizar el contacto
      await this.tutorialService.editContact(contactId, contactData);

      return { message: 'Contacto editado exitosamente' };
    } catch (error) {
      console.error(
        `❌ Error al editar contacto (${contactId}):`,
        error.message,
      );
      throw new InternalServerErrorException('Error al editar el contacto');
    }
  }

  // Endpoint para eliminar un contacto
  @Delete('deleteContact/:contactId')
  async deleteContact(@Param('contactId') contactId: string): Promise<any> {
    try {
      console.log(`🗑️ Eliminando contacto con ID: ${contactId}`);

      // Validar que el ID es válido
      if (!contactId || /[.#$[\]]/.test(contactId)) {
        throw new NotFoundException(
          `El ID de contacto '${contactId}' es inválido.`,
        );
      }

      // Llamar al servicio para eliminar el contacto
      await this.tutorialService.deleteContact(contactId);

      return { message: 'Contacto eliminado exitosamente' };
    } catch (error) {
      console.error(
        `❌ Error al eliminar contacto (${contactId}):`,
        error.message,
      );
      throw new InternalServerErrorException('Error al eliminar el contacto');
    }
  }

  // Endpoint para buscar un contacto por nombre
  @Get('searchContact/:name')
  async searchContact(@Param('name') name: string): Promise<any> {
    try {
      const contact = await this.tutorialService.searchContactByName(name);

      if (!contact) {
        return {
          message: 'No se encontró ningún contacto con el nombre: ${name}',
        };
      }

      return contact;
    } catch (error) {
      return { message: 'Error al buscar el contacto', error: error.message };
    }
  }
}
