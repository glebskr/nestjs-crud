import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import * as config from 'config';

import { AppModule } from './app.module';

async function bootstrap() {
  const serverConfig = config.get('server');
  const PORT = process.env.PORT || serverConfig.port;
  const logger = new Logger('main');

  const app = await NestFactory.create(AppModule);

  await app.listen(PORT);
  logger.log(`Application listening on ${PORT}`);
}
bootstrap();
