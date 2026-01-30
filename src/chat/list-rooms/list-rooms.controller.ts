import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserId } from '../../auth/decorators/user-id.decorator';
import { ListRoomsService } from './list-rooms.service';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat/rooms')
export class ListRoomsController {
  constructor(private readonly listRoomsService: ListRoomsService) {}

  @Get()
  @ApiOperation({ summary: 'List current user chat rooms' })
  @ApiResponse({ status: 200, description: 'List of rooms' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async listRooms(@UserId() userId: string) {
    return this.listRoomsService.execute(userId);
  }
}
