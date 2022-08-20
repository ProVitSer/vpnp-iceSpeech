import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import configuration from '@app/config/config.provides';

async function bootstrap() {
  const config = new ConfigService(configuration());
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..' ,'public'));
  await app.listen(config.get('appPort'));
}
bootstrap();
