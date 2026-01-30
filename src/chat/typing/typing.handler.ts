import { Injectable } from '@nestjs/common';

export interface TypingPayload {
  userId: string;
  roomId: string;
}

@Injectable()
export class TypingHandler {
  execute(roomId: string, userId: string): TypingPayload {
    return { userId, roomId };
  }
}
