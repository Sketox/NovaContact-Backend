import { Module } from '@nestjs/common';
import { UploadService } from '../upload/service/upload.service';
import { UploadController } from '../upload/controller/upload.controller';
import { TutorialService } from 'tutorial/service/tutorial.service';

@Module({
  providers: [UploadService, TutorialService],
  controllers: [UploadController],
})
export class UploadModule {}
