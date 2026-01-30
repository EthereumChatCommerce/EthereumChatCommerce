import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RefreshService } from './refresh.service';

@ApiTags('Auth')
@Controller('auth')
export class RefreshController {
  constructor(private readonly refreshService: RefreshService) {}

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh JWT using current token' })
  @ApiResponse({ status: 200, description: 'Returns new JWT' })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  async refresh(@Body('access_token') accessToken: string) {
    return this.refreshService.execute(accessToken);
  }
}
