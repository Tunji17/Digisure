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
import { AppService } from './app.service';
import { CreateUserDto, UserResponseDto } from './app.dto';
import { JwtAuthGuard } from './app.guard';

@ApiBearerAuth()
@ApiTags('User')
@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('user')
  @ApiOperation({ summary: 'Sign up user' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse()
  @UseInterceptors(ClassSerializerInterceptor)
  async signupUser(@Body() body: CreateUserDto): Promise<UserResponseDto> {
    return this.appService.createUser(body);
  }

  @Get('user')
  @ApiOperation({ summary: 'Get user' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async getUser(@Req() { user }: Request): Promise<UserResponseDto> {
    return this.appService.getUser(<User>user);
  }
}
