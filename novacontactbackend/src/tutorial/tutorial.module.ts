import { Module } from '@nestjs/common';
import { TutorialService } from './service/tutorial.service';
import { TutorialController } from './controller/tutorial.controller';


@Module({
  providers: [TutorialService],
  controllers: [TutorialController],
})
export class TutorialModule {}
