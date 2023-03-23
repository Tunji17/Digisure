import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '@prisma/client';
import { TransactionDto } from '../app.dto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async depositMoney(
    user: User,
    amount: number,
  ): Promise<{ success: boolean }> {
    const account = await this.prisma.account.findUnique({
      where: {
        ownerId: user.id,
      },
    });

    if (!account) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }

    const newBalance = account.balance + amount;

    await this.prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        balance: newBalance,
      },
    });

    // create transaction
    await this.prisma.transactions.create({
      data: {
        amount,
        type: 'credit',
        account: {
          connect: {
            id: account.id,
          },
        },
      },
    });

    return {
      success: true,
    };
  }

  async transferMoney(
    user: User,
    amount: number,
    to: string,
  ): Promise<{ success: boolean }> {
    const account = await this.prisma.account.findUnique({
      where: {
        ownerId: user.id,
      },
    });

    if (!account) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }

    const toAccount = await this.prisma.account.findUnique({
      where: {
        number: to,
      },
    });

    if (!toAccount) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }

    const newBalance = account.balance - amount;

    if (newBalance < 0) {
      throw new HttpException('Insufficient funds', HttpStatus.BAD_REQUEST);
    }

    await this.prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        balance: newBalance,
      },
    });

    await this.prisma.account.update({
      where: {
        id: toAccount.id,
      },
      data: {
        balance: toAccount.balance + amount,
      },
    });

    // create transaction
    await this.prisma.transactions.create({
      data: {
        amount,
        type: 'debit',
        account: {
          connect: {
            id: account.id,
          },
        },
      },
    });

    return {
      success: true,
    };
  }

  async getTransactionHistory(user: User): Promise<TransactionDto[]> {
    const account = await this.prisma.account.findUnique({
      where: {
        ownerId: user.id,
      },
    });

    if (!account) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }

    const transactions = await this.prisma.transactions.findMany({
      where: {
        accountId: account.id,
      },
    });

    return transactions;
  }
}
