import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from 'src/_entities/user.entity';

export const Token = createParamDecorator((data, ctx: ExecutionContext): UserEntity => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});
