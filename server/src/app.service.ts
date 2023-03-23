import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from './database/prisma.service';
import { CreateUserDto, UserResponseDto } from './app.dto';
import { AuthHelper } from './app.helper';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService, private authHelper: AuthHelper) {}
  getHello(): string {
    return 'Api is running!';
  }

  async createUser(data: CreateUserDto): Promise<UserResponseDto> {
    const userExists = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (userExists) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const accountNumber = Math.floor(Math.random() * 1000000000);

    const user = await this.prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        account: {
          create: {
            number: accountNumber.toString(),
            balance: 0,
          },
        },
      },
      include: {
        account: {
          select: {
            number: true,
            balance: true,
          },
        },
      },
    });

    return {
      token: this.authHelper.generateToken(user),
      user,
    };
  }

  async getUser(user: User): Promise<UserResponseDto> {
    const activeUser = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        account: {
          select: {
            number: true,
            balance: true,
          },
        },
      },
    });
    return {
      token: this.authHelper.generateToken(activeUser),
      user: activeUser,
    };
  }
}
