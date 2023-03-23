import { Request } from 'express';
import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiTags,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AppService } from './services/app.service';
import { UserService } from './services/user.service';
import { TransactionService } from './services/transaction.service';
import {
  CreateUserDto,
  UserResponseDto,
  LoginDto,
  TransactionDto,
} from './app.dto';
import { JwtAuthGuard } from './app.guard';

@ApiBearerAuth()
@ApiTags('User')
@Controller('/')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly transactionService: TransactionService,
  ) {}

  @Get('/')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('user')
  @ApiOperation({ summary: 'Sign up user' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse()
  @UseInterceptors(ClassSerializerInterceptor)
  async signupUser(@Body() body: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.createUser(body);
  }

  @Post('user/login')
  @ApiOperation({ summary: 'Login user' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse()
  @UseInterceptors(ClassSerializerInterceptor)
  async loginUser(@Body() body: LoginDto): Promise<UserResponseDto> {
    return this.userService.loginUser(body);
  }

  @Get('user')
  @ApiOperation({ summary: 'Get user' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async getUser(@Req() { user }: Request): Promise<UserResponseDto> {
    return this.userService.getUser(<User>user);
  }

  @Post('account/deposit')
  @ApiOperation({ summary: 'Deposit money to account' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async depositMoney(
    @Req() { user }: Request,
    @Body() body: { amount: number },
  ): Promise<{ success: boolean }> {
    return this.transactionService.depositMoney(<User>user, body.amount);
  }

  @Post('transaction/transfer')
  @ApiOperation({ summary: 'Transfer money to another account' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async transferMoney(
    @Req() { user }: Request,
    @Body() body: { amount: number; accountNumber: string },
  ): Promise<{ success: boolean }> {
    return this.transactionService.transferMoney(
      <User>user,
      body.amount,
      body.accountNumber,
    );
  }

  @Get('transaction/history')
  @ApiOperation({ summary: 'Get transaction history' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async getTransactionHistory(
    @Req() { user }: Request,
  ): Promise<TransactionDto[]> {
    return this.transactionService.getTransactionHistory(<User>user);
  }
}
