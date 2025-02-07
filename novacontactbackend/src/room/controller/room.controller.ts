import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { RoomService } from '../service/room.service';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post(':roomId')
  async createRoom(@Param('roomId') roomId: string, @Body() data: any) {
    await this.roomService.createRoom(roomId, data);
    return { message: `Sala ${roomId} creada` };
  }

  @Get(':roomId')
  async getRoom(@Param('roomId') roomId: string) {
    const room = await this.roomService.getRoom(roomId);
    return room ?? { message: 'Sala no encontrada' };
  }

  @Delete(':roomId')
  async deleteRoom(@Param('roomId') roomId: string) {
    await this.roomService.deleteRoom(roomId);
    return { message: `Sala ${roomId} eliminada` };
  }
}
