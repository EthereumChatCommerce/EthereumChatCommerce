import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ChatRepository } from '../repository/chat.repository';
import { GetMessagesService } from './get-messages.service';

describe('GetMessagesService', () => {
  let service: GetMessagesService;
  let chatRepository: ChatRepository;

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      providers: [
        GetMessagesService,
        {
          provide: ChatRepository,
          useValue: {
            isParticipant: jest.fn(),
            findRoomById: jest.fn(),
            findMessages: jest.fn(),
          },
        },
      ],
    }).compile();

    service = mod.get<GetMessagesService>(GetMessagesService);
    chatRepository = mod.get<ChatRepository>(ChatRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return messages when user is participant', async () => {
    jest.spyOn(chatRepository, 'isParticipant').mockResolvedValue(true);
    jest.spyOn(chatRepository, 'findRoomById').mockResolvedValue({} as never);
    jest.spyOn(chatRepository, 'findMessages').mockResolvedValue([]);
    const result = await service.execute('roomId', 'userId');
    expect(result).toEqual([]);
  });

  it('should throw ForbiddenException when not participant', async () => {
    jest.spyOn(chatRepository, 'isParticipant').mockResolvedValue(false);
    await expect(service.execute('roomId', 'userId')).rejects.toThrow(ForbiddenException);
  });

  it('should throw NotFoundException when room not found', async () => {
    jest.spyOn(chatRepository, 'isParticipant').mockResolvedValue(true);
    jest.spyOn(chatRepository, 'findRoomById').mockResolvedValue(null);
    await expect(service.execute('roomId', 'userId')).rejects.toThrow(NotFoundException);
  });
});
