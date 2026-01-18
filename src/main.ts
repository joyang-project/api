import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedDomainRegex = /(^|.*\.)jo-yang\.com$/;

  const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      if (!origin || origin.includes('localhost') || allowedDomainRegex.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error('동일하지 않은 도메인입니다.'));
      }
    },
    credentials: true,
  };

  app.enableCors(corsOptions);

  await app.listen(4000);
}
bootstrap();