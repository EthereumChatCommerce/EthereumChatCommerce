import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { RegisterService } from './register.service';

@ApiTags('Auth')
@Controller('auth')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered, returns JWT' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async register(@Body() dto: RegisterDto) {
    return this.registerService.execute(dto);
  }
}
