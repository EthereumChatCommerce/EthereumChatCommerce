import { Injectable } from '@nestjs/common';
import { ChatRepository } from '../repository/chat.repository';

@Injectable()
export class ListRoomsService {
  constructor(private readonly chatRepository: ChatRepository) {}

  async execute(userId: string) {
    return this.chatRepository.findRoomsForUser(userId);
  }
}
