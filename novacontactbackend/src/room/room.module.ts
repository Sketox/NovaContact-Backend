import { Module } from '@nestjs/common';
import { RoomService } from './service/room.service';
import { RoomController } from './controller/room.controller';

@Module({
  providers: [RoomService],
  controllers:[RoomController],
  exports: [RoomService], // Para que otros módulos lo usen
})
export class RoomModule {}
