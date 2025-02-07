import { Module } from '@nestjs/common';
import { UploadService } from '../upload/service/upload.service';
import { UploadController } from '../upload/controller/upload.controller';

@Module({
  providers: [UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
