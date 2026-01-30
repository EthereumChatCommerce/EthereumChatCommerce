import { Test, TestingModule } from '@nestjs/testing';
import { ChatRepository } from '../repository/chat.repository';
import { CreateRoomService } from './create-room.service';

describe('CreateRoomService', () => {
  let service: CreateRoomService;
  let chatRepository: ChatRepository;

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      providers: [
        CreateRoomService,
        {
          provide: ChatRepository,
          useValue: { createRoom: jest.fn().mockResolvedValue({ _id: 'room1' }) },
        },
      ],
    }).compile();

    service = mod.get<CreateRoomService>(CreateRoomService);
    chatRepository = mod.get<ChatRepository>(ChatRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create room with sorted participant ids', async () => {
    const result = await service.execute('userA', 'userB');
    expect(result).toEqual({ _id: 'room1' });
    expect(chatRepository.createRoom).toHaveBeenCalledWith(['userA', 'userB']);
  });
});
