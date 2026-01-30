import { Injectable } from '@nestjs/common';
import { ChatRepository } from '../repository/chat.repository';

@Injectable()
export class CreateRoomService {
  constructor(private readonly chatRepository: ChatRepository) {}

  async execute(userId: string, otherUserId: string) {
    return this.chatRepository.createRoom([userId, otherUserId]);
  }
}
