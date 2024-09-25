import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PaginationInterceptor } from './interceptors/pagination.interceptor';
import { PaginationService } from './modules/pagination/pagination.service';
import { Environment, seaMailerClient } from 'seamailer-nodejs';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.useGlobalInterceptors(
    new PaginationInterceptor(new PaginationService(), 'data'),
  );

  const options = new DocumentBuilder()
    .setTitle('cutstruct-backend-v2')
    .setDescription('cutstruct-backend-v2')
    .setVersion('2.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);

  try {
    seaMailerClient.setApi(
      new ConfigService().get('SEAMAILER_PUBLIC_KEY'),
      Environment.production,
    );
    seaMailerClient.connectionCheck().then();
  } catch (e) {
    console.error(e.message);
  }

  await app.listen(3000);
}

bootstrap();
