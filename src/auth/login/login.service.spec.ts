import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../users/users.service';
import { LoginDto } from './dto/login.dto';
import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        {
          provide: UsersService,
          useValue: { findByEmail: jest.fn(), validatePassword: jest.fn() },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('token') },
        },
      ],
    }).compile();

    service = module.get<LoginService>(LoginService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return access_token when credentials valid', async () => {
    const dto: LoginDto = { email: 'a@b.com', password: 'pass' };
    const user = { _id: 'id', email: dto.email, password: 'hash' };
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user as never);
    jest.spyOn(usersService, 'validatePassword').mockResolvedValue(true);

    const result = await service.execute(dto);
    expect(result.access_token).toBe('token');
  });

  it('should throw UnauthorizedException when user not found', async () => {
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
    await expect(service.execute({ email: 'a@b.com', password: 'pass' })).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException when password invalid', async () => {
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue({} as never);
    jest.spyOn(usersService, 'validatePassword').mockResolvedValue(false);
    await expect(service.execute({ email: 'a@b.com', password: 'pass' })).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
