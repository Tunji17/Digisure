import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { faker } from '@faker-js/faker';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from './database/prisma.module';
import { PrismaService } from './database/prisma.service';
import { AppController } from './app.controller';
import { AppService } from './services/app.service';
import { UserService } from './services/user.service';
import { TransactionService } from './services/transaction.service';
import { AuthHelper } from './app.helper';
import { JwtStrategy } from './app.strategy';

describe('AppController', () => {
  let appController: AppController;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt', property: 'user' }),
        JwtModule.register({
          secret: 'jwtsecretkey',
          signOptions: { expiresIn: '7d' },
        }),
        PrismaModule,
      ],
      controllers: [AppController],
      providers: [
        AppService,
        UserService,
        TransactionService,
        AuthHelper,
        JwtStrategy,
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    prismaService = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  describe('root', () => {
    let alice;
    let bob;

    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Api is running!');
    });

    it('should sign up alice', async () => {
      const data = {
        firstName: 'alice',
        lastName: 'Doe',
        email: faker.internet.email(),
        password: 'password',
      };
      const response = await appController.signupUser(data);
      alice = response;
      expect(response).toHaveProperty('token');
    });

    it('should login alice', async () => {
      const data = {
        email: alice.user.email,
        password: 'password',
      };
      const response = await appController.loginUser(data);
      alice = response;
      expect(response).toHaveProperty('token');
    });

    it('should get alice', async () => {
      const response = await appController.getUser(alice);
      expect(response).toHaveProperty('user');
    });

    it('should sign up bob', async () => {
      const data = {
        firstName: 'bob',
        lastName: 'Doe',
        email: faker.internet.email(),
        password: 'password',
      };
      const response = await appController.signupUser(data);
      bob = response;
      expect(response).toHaveProperty('token');
    });

    it('should fund alice account', async () => {
      const data = {
        amount: 1000,
      };
      const response = await appController.depositMoney(alice, data);
      expect(response.success).toBe(true);
    });

    it('should transfer money from alice to bob', async () => {
      const data = {
        amount: 100,
        accountNumber: bob.user.account.number,
      };
      const response = await appController.transferMoney(alice, data);
      expect(response.success).toBe(true);
    });

    it('should get alice transactions', async () => {
      const response = await appController.getTransactionHistory(alice);
      expect(response).toHaveProperty('transactions');
    });
  });
});
