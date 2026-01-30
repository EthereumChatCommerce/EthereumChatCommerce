import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../users/users.service';
import { RefreshService } from './refresh.service';

describe('RefreshService', () => {
  let service: RefreshService;
  let jwtService: JwtService;
  let usersService: UsersService;

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      providers: [
        RefreshService,
        { provide: UsersService, useValue: { findById: jest.fn() } },
        {
          provide: JwtService,
          useValue: { verify: jest.fn(), sign: jest.fn().mockReturnValue('new-token') },
        },
      ],
    }).compile();

    service = mod.get<RefreshService>(RefreshService);
    jwtService = mod.get<JwtService>(JwtService);
    usersService = mod.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return new access_token when token valid', async () => {
    jest.spyOn(jwtService, 'verify').mockReturnValue({ sub: 'id', email: 'a@b.com' });
    jest.spyOn(usersService, 'findById').mockResolvedValue({} as never);

    const result = await service.execute('old-token');
    expect(result.access_token).toBe('new-token');
  });

  it('should throw UnauthorizedException when verify fails', async () => {
    jest.spyOn(jwtService, 'verify').mockImplementation(() => {
      throw new Error('invalid');
    });
    await expect(service.execute('bad')).rejects.toThrow(UnauthorizedException);
  });
});
