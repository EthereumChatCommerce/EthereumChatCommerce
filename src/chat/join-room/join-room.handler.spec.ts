import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ChatRepository } from '../repository/chat.repository';
import { JoinRoomHandler } from './join-room.handler';

describe('JoinRoomHandler', () => {
  let handler: JoinRoomHandler;
  let chatRepository: ChatRepository;

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      providers: [
        JoinRoomHandler,
        {
          provide: ChatRepository,
          useValue: { findRoomById: jest.fn(), isParticipant: jest.fn() },
        },
      ],
    }).compile();

    handler = mod.get<JoinRoomHandler>(JoinRoomHandler);
    chatRepository = mod.get<ChatRepository>(ChatRepository);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should return ok when user is participant', async () => {
    jest.spyOn(chatRepository, 'findRoomById').mockResolvedValue({} as never);
    jest.spyOn(chatRepository, 'isParticipant').mockResolvedValue(true);
    const result = await handler.execute('roomId', 'userId');
    expect(result).toEqual({ ok: true });
  });

  it('should throw NotFoundException when room not found', async () => {
    jest.spyOn(chatRepository, 'findRoomById').mockResolvedValue(null);
    await expect(handler.execute('roomId', 'userId')).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException when not participant', async () => {
    jest.spyOn(chatRepository, 'findRoomById').mockResolvedValue({} as never);
    jest.spyOn(chatRepository, 'isParticipant').mockResolvedValue(false);
    await expect(handler.execute('roomId', 'userId')).rejects.toThrow(ForbiddenException);
  });
});
