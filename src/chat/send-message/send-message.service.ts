import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ChatRepository } from '../repository/chat.repository';

@Injectable()
export class SendMessageService {
  constructor(private readonly chatRepository: ChatRepository) {}

  async execute(roomId: string, userId: string, content: string) {
    const isParticipant = await this.chatRepository.isParticipant(roomId, userId);
    if (!isParticipant) throw new ForbiddenException('Not a participant');

    const room = await this.chatRepository.findRoomById(roomId);
    if (!room) throw new NotFoundException('Room not found');

    const message = await this.chatRepository.createMessage(roomId, userId, content);
    return message;
  }
}
