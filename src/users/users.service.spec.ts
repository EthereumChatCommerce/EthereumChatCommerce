import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<User>;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
    password: 'hashed',
    displayName: 'Test',
    save: jest.fn(),
  };

  const mockUserModel = {
    findById: jest.fn(),
    findOne: jest.fn(),
    prototype: { save: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findById: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn().mockImplementation((dto) => ({
              ...dto,
              save: jest.fn().mockResolvedValue(mockUser),
            })),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should hash password and create user', async () => {
      const createSpy = jest.spyOn(model, 'create').mockImplementation(
        () =>
          ({
            ...mockUser,
            save: jest.fn().mockResolvedValue(mockUser),
          }) as never,
      );
      const result = await service.create('test@example.com', 'password', 'Test');

      const bcrypt = require('bcrypt');
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
      expect(createSpy).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      } as never);

      const result = await service.findById('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockUser);
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      } as never);

      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(mockUser);
    });
  });
});
