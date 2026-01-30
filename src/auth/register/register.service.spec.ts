import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { RegisterService } from './register.service';

describe('RegisterService', () => {
  let service: RegisterService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterService,
        {
          provide: UsersService,
          useValue: { findByEmail: jest.fn(), create: jest.fn() },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('token') },
        },
      ],
    }).compile();

    service = module.get<RegisterService>(RegisterService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register and return access_token', async () => {
    const dto: RegisterDto = { email: 'a@b.com', password: 'password123' };
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
    jest.spyOn(usersService, 'create').mockResolvedValue({ _id: 'id', email: dto.email } as never);

    const result = await service.execute(dto);
    expect(result.access_token).toBe('token');
    expect(usersService.create).toHaveBeenCalledWith(dto.email, dto.password, undefined);
  });

  it('should throw ConflictException if email exists', async () => {
    const dto: RegisterDto = { email: 'a@b.com', password: 'password123' };
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue({} as never);

    await expect(service.execute(dto)).rejects.toThrow(ConflictException);
    expect(usersService.create).not.toHaveBeenCalled();
  });
});
