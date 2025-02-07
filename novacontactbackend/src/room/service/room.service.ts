import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RoomService {
  private redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: 'localhost', // Cambia esto si usas un servidor remoto
      port: 6379,
    });
  }

  /**
   * Crea una sala en Redis
   * @param roomId ID de la sala
   * @param data Datos de la sala
   */
  async createRoom(roomId: string, data: any): Promise<void> {
    await this.redisClient.set(`room:${roomId}`, JSON.stringify(data));
  }

  /**
   * Obtiene una sala por su ID
   * @param roomId ID de la sala
   * @returns Datos de la sala o null si no existe
   */
  async getRoom(roomId: string): Promise<any> {
    const data = await this.redisClient.get(`room:${roomId}`);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Elimina una sala de Redis
   * @param roomId ID de la sala
   */
  async deleteRoom(roomId: string): Promise<void> {
    await this.redisClient.del(`room:${roomId}`);
  }
}
