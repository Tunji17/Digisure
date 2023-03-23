import {
  Injectable,
  Inject,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from './database/prisma.service';
import { User } from '@prisma/client';
import { UserDto } from './app.dto';

@Injectable()
export class AuthHelper {
  @Inject(PrismaService)
  private prisma: PrismaService;

  private readonly jwt: JwtService;

  constructor(jwt: JwtService) {
    this.jwt = jwt;
  }

  // Decoding the JWT Token
  public async decode(token: string): Promise<unknown> {
    return this.jwt.decode(token, null);
  }

  // Get User by User ID we get from decode()
  public async validateUser(decoded: any): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: decoded.id },
    });
    delete user.password;
    return user;
  }

  // Generate JWT Token
  public generateToken(user: UserDto): string {
    return this.jwt.sign({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      account: {
        number: user.account.number,
        balance: user.account.balance,
      },
    });
  }

  // Validate User's password
  public isPasswordValid(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
  }

  // Encode User's password
  public encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }

  // Validate JWT Token, throw forbidden error if JWT Token is invalid
  private async validate(token: string): Promise<boolean | never> {
    const decoded: unknown = this.jwt.verify(token);

    if (!decoded) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const user = await this.validateUser(decoded);

    if (!user) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
