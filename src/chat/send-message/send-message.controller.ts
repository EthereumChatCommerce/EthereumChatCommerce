import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserId } from '../../auth/decorators/user-id.decorator';
import { ChatGateway } from '../chat.gateway';
import { SendMessageDto } from '../dto/send-message.dto';
import { SendMessageService } from './send-message.service';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat/rooms')
export class SendMessageController {
  constructor(
    private readonly sendMessageService: SendMessageService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Post(':id/messages')
  @ApiOperation({ summary: 'Send message to room' })
  @ApiResponse({ status: 201, description: 'Message created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Not a participant' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async sendMessage(
    @Param('id') roomId: string,
    @UserId() userId: string,
    @Body() dto: SendMessageDto,
  ) {
    const message = await this.sendMessageService.execute(roomId, userId, dto.content);
    const doc = (message.toObject ? message.toObject() : message) as unknown as Record<string, unknown>;
    const sender = doc.sender as { _id: unknown; email?: string; displayName?: string } | undefined;
    const payload = {
      id: doc._id?.toString?.() ?? String(doc._id),
      roomId,
      sender: sender
        ? { _id: String(sender._id), email: sender.email, displayName: sender.displayName }
        : { _id: userId },
      content: doc.content as string,
      createdAt: (doc.createdAt as Date) ?? new Date(),
    };
    this.chatGateway.emitMessage(roomId, payload);
    return message;
  }
}
