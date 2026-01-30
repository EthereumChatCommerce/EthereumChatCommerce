import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserId = createParamDecorator((_data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest<{ user?: { userId: string } }>();
  const user = request.user;
  if (!user?.userId) throw new Error('UserId decorator used without JWT guard');
  return user.userId;
});
