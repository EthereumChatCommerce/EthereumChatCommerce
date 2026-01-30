import { Test, TestingModule } from '@nestjs/testing';
import { TypingHandler } from './typing.handler';

describe('TypingHandler', () => {
  let handler: TypingHandler;

  beforeEach(async () => {
    const mod = await Test.createTestingModule({
      providers: [TypingHandler],
    }).compile();

    handler = mod.get<TypingHandler>(TypingHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  it('should return typing payload', () => {
    const result = handler.execute('roomId', 'userId');
    expect(result).toEqual({ userId: 'userId', roomId: 'roomId' });
  });
});
