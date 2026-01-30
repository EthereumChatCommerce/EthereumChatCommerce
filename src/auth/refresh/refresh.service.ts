import { UnauthorizedException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class RefreshService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async execute(accessToken: string): Promise<{ access_token: string }> {
    try {
      const payload = this.jwtService.verify<{ sub: string; email: string }>(accessToken);
      const user = await this.usersService.findById(payload.sub);
      if (!user) throw new UnauthorizedException();

      const newPayload = { sub: payload.sub, email: payload.email };
      const newToken = this.jwtService.sign(newPayload);
      return { access_token: newToken };
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
