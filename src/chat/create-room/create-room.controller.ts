import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserId } from '../../auth/decorators/user-id.decorator';
import { CreateRoomDto } from '../dto/create-room.dto';
import { CreateRoomService } from './create-room.service';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat/rooms')
export class CreateRoomController {
  constructor(private readonly createRoomService: CreateRoomService) {}

  @Post()
  @ApiOperation({ summary: 'Create or get 1:1 chat room' })
  @ApiResponse({ status: 201, description: 'Room created or existing' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async createRoom(@UserId() userId: string, @Body() dto: CreateRoomDto) {
    return this.createRoomService.execute(userId, dto.otherUserId);
  }
}
