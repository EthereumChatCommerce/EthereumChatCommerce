import { Test, TestingModule } from '@nestjs/testing';
import { SendMessageService } from '../send-message/send-message.service';
import { SendMessageWsHandler } from './send-message-ws.handler';

describe('SendMessageWsHandler', () => {
  let handler: SendMessageWsHandler;

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      providers: [
        SendMessageWsHandler,
        {
          provide: SendMessageService,
          useValue: {
            execute: jest.fn().mockResolvedValue({
              _id: 'msg1',
              room: 'room1',
              sender: { _id: 'u1', email: 'a@b.com', displayName: 'User' },
              content: 'hi',
              createdAt: new Date(),
              toObject: () => ({
                _id: 'msg1',
                room: 'room1',
                sender: { _id: 'u1', email: 'a@b.com', displayName: 'User' },
                content: 'hi',
                createdAt: new Date(),
              }),
            }),
          },
        },
      ],
    }).compile();

    handler = mod.get<SendMessageWsHandler>(SendMessageWsHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should return message payload for gateway to emit', async () => {
    const result = await handler.execute('room1', 'u1', 'hi');
    expect(result.id).toBe('msg1');
    expect(result.roomId).toBe('room1');
    expect(result.content).toBe('hi');
    expect(result.sender).toBeDefined();
  });
});
