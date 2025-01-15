import { DataSource as ORMDataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const getPGConnection = (): ORMDataSource => {
  return new ORMDataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    migrationsRun: true,
    entities: [`${__dirname}/**/entities/*.entity{.ts,.js}`],
    migrations: [`${__dirname}/**/migrations/*{.ts,.js}`],
  });
};

export default getPGConnection();
