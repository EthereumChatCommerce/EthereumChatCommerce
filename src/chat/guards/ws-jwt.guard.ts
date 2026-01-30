import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();
    const token =
      client.handshake.auth?.token ||
      client.handshake.headers?.authorization?.replace('Bearer ', '');
    if (!token) throw new WsException('Unauthorized');

    try {
      const secret = this.config.get<string>('JWT_SECRET') || 'default-secret';
      const payload = this.jwtService.verify<{ sub: string; email: string }>(token, { secret });
      (client.data as { userId: string }).userId = payload.sub;
      return true;
    } catch {
      throw new WsException('Invalid token');
    }
  }
}
