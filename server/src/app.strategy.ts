import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '@prisma/client';
import { AuthHelper } from './app.helper';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'jwtsecretkey',
      ignoreExpiration: true,
    });
  }

  private validate(payload: string): Promise<User | never> {
    return this.helper.validateUser(payload);
  }
}
