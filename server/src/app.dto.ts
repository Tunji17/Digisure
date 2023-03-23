import { Trim } from 'class-sanitizer';
import {
  IsEmail,
  IsString,
  IsOptional,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsEmail()
  @IsString()
  @Trim()
  @ApiProperty()
  email: string;

  @IsString()
  @Trim()
  @ApiProperty()
  password: string;
}

export class CreateUserDto extends LoginDto {
  @IsString()
  @Trim()
  @ApiProperty()
  firstName: string;

  @IsString()
  @Trim()
  @ApiProperty()
  lastName: string;
}

export class AccountDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  id?: number;

  @IsString()
  @Trim()
  @ApiProperty()
  number: string;

  @IsNumber()
  @ApiProperty()
  balance: number;
}

export class UserDto {
  @IsNumber()
  @ApiProperty()
  id: number;

  @IsString()
  @Trim()
  @ApiProperty()
  firstName: string;

  @IsString()
  @Trim()
  @ApiProperty()
  lastName: string;

  @IsEmail()
  @IsString()
  @Trim()
  @ApiProperty()
  email: string;

  @ValidateNested()
  @ApiProperty()
  account: AccountDto;
}

export class UserResponseDto {
  @IsString()
  @ApiProperty()
  token: string;

  @ValidateNested()
  @ApiProperty()
  user: UserDto;
}

export class TransactionDto {
  @IsNumber()
  @ApiProperty()
  id: number;

  @IsNumber()
  @ApiProperty()
  amount: number;

  @IsString()
  @Trim()
  @ApiProperty()
  type: string;

  @IsString()
  @Trim()
  @ApiProperty()
  createdAt: Date;
}
