import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '@prisma/client';

declare module 'express' {
  interface Request {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user?: any;
  }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements IAuthGuard {
  public handleRequest(err: unknown, user: User): any {
    return user;
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const { user }: Request = context.switchToHttp().getRequest();

    return user ? true : false;
  }
}
