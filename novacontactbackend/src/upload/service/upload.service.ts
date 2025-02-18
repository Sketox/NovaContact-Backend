import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class UploadService {
  saveFile(file: Express.Multer.File): string {
    if (!file) {
      throw new Error('No se recibió ningún archivo');
    }
    const uploadPath = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    const filePath = path.join(uploadPath, file.originalname);
    fs.writeFileSync(filePath, file.buffer); // Guarda el archivo en el sistema
    return filePath;
  }
}
