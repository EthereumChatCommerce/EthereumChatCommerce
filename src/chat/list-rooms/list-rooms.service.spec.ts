import { Test, TestingModule } from '@nestjs/testing';
import { ChatRepository } from '../repository/chat.repository';
import { ListRoomsService } from './list-rooms.service';

describe('ListRoomsService', () => {
  let service: ListRoomsService;
  let chatRepository: ChatRepository;

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      providers: [
        ListRoomsService,
        {
          provide: ChatRepository,
          useValue: { findRoomsForUser: jest.fn().mockResolvedValue([]) },
        },
      ],
    }).compile();

    service = mod.get<ListRoomsService>(ListRoomsService);
    chatRepository = mod.get<ChatRepository>(ChatRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return rooms for user', async () => {
    const rooms = [{ _id: 'r1', participants: [] }];
    jest.spyOn(chatRepository, 'findRoomsForUser').mockResolvedValue(rooms as never);
    const result = await service.execute('userId');
    expect(result).toEqual(rooms);
    expect(chatRepository.findRoomsForUser).toHaveBeenCalledWith('userId');
  });
});
