import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

const dbConfig = config.get('db');

const TypeOrmConfig: TypeOrmModuleOptions = {
  ...dbConfig,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
};

export { TypeOrmConfig };
