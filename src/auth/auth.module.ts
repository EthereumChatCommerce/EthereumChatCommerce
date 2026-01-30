import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LoginController } from './login/login.controller';
import { LoginService } from './login/login.service';
import { RefreshController } from './refresh/refresh.controller';
import { RefreshService } from './refresh/refresh.service';
import { RegisterController } from './register/register.controller';
import { RegisterService } from './register/register.service';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) =>
        ({
          secret: config.get<string>('JWT_SECRET') || 'default-secret',
          signOptions: {
            expiresIn: config.get<string>('JWT_EXPIRES_IN') || '7d',
          },
        }) as JwtModuleOptions,
      inject: [ConfigService],
    }),
  ],
  controllers: [RegisterController, LoginController, RefreshController],
  providers: [RegisterService, LoginService, RefreshService, JwtStrategy, JwtAuthGuard],
  exports: [JwtModule, JwtAuthGuard],
})
export class AuthModule {}
