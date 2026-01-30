import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserId } from '../../auth/decorators/user-id.decorator';
import { GetMessagesService } from './get-messages.service';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat/rooms')
export class GetMessagesController {
  constructor(private readonly getMessagesService: GetMessagesService) {}

  @Get(':id/messages')
  @ApiOperation({ summary: 'Get messages in room (paginated)' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'before', required: false, description: 'Message ID for cursor pagination' })
  @ApiResponse({ status: 200, description: 'List of messages' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Not a participant' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  async getMessages(
    @Param('id') roomId: string,
    @UserId() userId: string,
    @Query('limit') limit?: string,
    @Query('before') before?: string,
  ) {
    const limitNum = limit ? Math.min(parseInt(limit, 10) || 50, 100) : 50;
    return this.getMessagesService.execute(roomId, userId, limitNum, before);
  }
}
