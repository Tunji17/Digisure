import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaService } from './database/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prisma Database listner for beforeExit event
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // Swagger Documentation Configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Digisure Assessment API')
    .setDescription('Digisure Assessment API description')
    .setVersion('1.0')
    .addTag('User')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(9200);
}
bootstrap();
