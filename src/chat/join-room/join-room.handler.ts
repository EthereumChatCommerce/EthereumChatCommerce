import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ChatRepository } from '../repository/chat.repository';

@Injectable()
export class JoinRoomHandler {
  constructor(private readonly chatRepository: ChatRepository) {}

  async execute(roomId: string, userId: string): Promise<{ ok: true }> {
    const room = await this.chatRepository.findRoomById(roomId);
    if (!room) throw new NotFoundException('Room not found');

    const isParticipant = await this.chatRepository.isParticipant(roomId, userId);
    if (!isParticipant) throw new ForbiddenException('Not a participant');

    return { ok: true };
  }
}
