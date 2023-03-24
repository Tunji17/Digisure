import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto, UserResponseDto, LoginDto } from '../app.dto';
import { AuthHelper } from '../app.helper';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private authHelper: AuthHelper) {}

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

    const password = await this.authHelper.encodePassword(data.password);

    const user = await this.prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password,
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

    delete user.password;

    return {
      token: this.authHelper.generateToken(user),
      user,
    };
  }

  async loginUser(data: LoginDto): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: data.email,
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

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await this.authHelper.isPasswordValid(
      data.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }

    delete user.password;

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

    delete activeUser.password;

    return {
      token: this.authHelper.generateToken(activeUser),
      user: activeUser,
    };
  }
}
