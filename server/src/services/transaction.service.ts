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
        type: 'deposit',
        fromAccount: {
          connect: {
            id: account.id,
          },
        },
        toAccount: {
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
        number: to.toString(),
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

    // create transactions
    await this.prisma.transactions.create({
      data: {
        amount,
        type: 'debit',
        fromAccount: {
          connect: {
            id: account.id,
          },
        },
        toAccount: {
          connect: {
            id: toAccount.id,
          },
        },
      },
    });

    await this.prisma.transactions.create({
      data: {
        amount,
        type: 'credit',
        fromAccount: {
          connect: {
            id: account.id,
          },
        },
        toAccount: {
          connect: {
            id: toAccount.id,
          },
        },
      },
    });

    return {
      success: true,
    };
  }

  async getTransactionHistory(
    user: User,
  ): Promise<{ transactions: TransactionDto[] }> {
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
        OR: [
          {
            fromAccount: {
              number: account.number,
            },
          },
          {
            toAccount: {
              number: account.number,
            },
          },
        ],
      },
      include: {
        fromAccount: {
          select: {
            number: true,
            owner: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        toAccount: {
          select: {
            number: true,
            owner: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { transactions };
  }
}
