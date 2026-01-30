import { Injectable } from '@nestjs/common';
import { SendMessageService } from '../send-message/send-message.service';

export interface MessagePayload {
  id: string;
  roomId: string;
  sender: { _id: string; email?: string; displayName?: string };
  content: string;
  createdAt: Date;
}

@Injectable()
export class SendMessageWsHandler {
  constructor(private readonly sendMessageService: SendMessageService) {}

  async execute(roomId: string, userId: string, content: string): Promise<MessagePayload> {
    const message = await this.sendMessageService.execute(roomId, userId, content);
    const doc = (message.toObject ? message.toObject() : message) as unknown as Record<string, unknown>;
    const sender = doc.sender as { _id: unknown; email?: string; displayName?: string } | undefined;
    return {
      id: doc._id?.toString?.() ?? String(doc._id),
      roomId,
      sender: sender
        ? {
            _id: String(sender._id),
            email: sender.email,
            displayName: sender.displayName,
          }
        : { _id: userId },
      content: doc.content as string,
      createdAt: (doc.createdAt as Date) ?? new Date(),
    };
  }
}
