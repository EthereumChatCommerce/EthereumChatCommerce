import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Message } from '../schemas/message.schema';
import { Room } from '../schemas/room.schema';
import { ChatRepository } from './chat.repository';

describe('ChatRepository', () => {
  let repository: ChatRepository;
  let roomModel: Model<Room>;
  let messageModel: Model<Message>;

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      providers: [
        ChatRepository,
        {
          provide: getModelToken(Room.name),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getModelToken(Message.name),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = mod.get<ChatRepository>(ChatRepository);
    roomModel = mod.get<Model<Room>>(getModelToken(Room.name));
    messageModel = mod.get<Model<Message>>(getModelToken(Message.name));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('isParticipant', () => {
    it('should return true when user is participant', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const roomId = '507f1f77bcf86cd799439012';
      jest.spyOn(roomModel, 'findById').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue({
          participants: [
            { equals: (id: { toString: () => string }) => id.toString() === userId },
          ],
        }),
      } as never);
      const result = await repository.isParticipant(roomId, userId);
      expect(result).toBe(true);
    });
  });
});
