import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './services/app.service';
import { UserService } from './services/user.service';
import { TransactionService } from './services/transaction.service';
import { PrismaModule } from './database/prisma.module';
import { AuthHelper } from './app.helper';
import { JwtStrategy } from './app.strategy';

@Module({
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
})
export class AppModule {}
