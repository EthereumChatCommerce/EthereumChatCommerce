import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ChatRepository } from '../repository/chat.repository';
import { SendMessageService } from './send-message.service';

describe('SendMessageService', () => {
  let service: SendMessageService;
  let chatRepository: ChatRepository;

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      providers: [
        SendMessageService,
        {
          provide: ChatRepository,
          useValue: {
            isParticipant: jest.fn(),
            findRoomById: jest.fn(),
            createMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    service = mod.get<SendMessageService>(SendMessageService);
    chatRepository = mod.get<ChatRepository>(ChatRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create message when user is participant', async () => {
    const msg = { _id: 'm1', content: 'hi', room: 'r1', sender: 'u1' };
    jest.spyOn(chatRepository, 'isParticipant').mockResolvedValue(true);
    jest.spyOn(chatRepository, 'findRoomById').mockResolvedValue({} as never);
    jest.spyOn(chatRepository, 'createMessage').mockResolvedValue(msg as never);
    const result = await service.execute('roomId', 'userId', 'hi');
    expect(result).toEqual(msg);
    expect(chatRepository.createMessage).toHaveBeenCalledWith('roomId', 'userId', 'hi');
  });

  it('should throw ForbiddenException when not participant', async () => {
    jest.spyOn(chatRepository, 'isParticipant').mockResolvedValue(false);
    await expect(service.execute('roomId', 'userId', 'hi')).rejects.toThrow(ForbiddenException);
  });

  it('should throw NotFoundException when room not found', async () => {
    jest.spyOn(chatRepository, 'isParticipant').mockResolvedValue(true);
    jest.spyOn(chatRepository, 'findRoomById').mockResolvedValue(null);
    await expect(service.execute('roomId', 'userId', 'hi')).rejects.toThrow(NotFoundException);
  });
});
