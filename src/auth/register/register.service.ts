import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class RegisterService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async execute(dto: RegisterDto): Promise<{ access_token: string }> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already registered');

    const user = await this.usersService.create(dto.email, dto.password, dto.displayName);
    const payload = { sub: user._id.toString(), email: user.email };
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }
}
