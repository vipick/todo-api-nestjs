import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from 'src/_entities/user.entity';
import { CategoryEntity } from 'src/_entities/category.entity';
import { TemplateEntity } from 'src/_entities/template.entity';
import { TemplateCategoryEntity } from 'src/_entities/template-category.entity';
import { TodoEntity } from 'src/_entities/todo.entity';
import * as dotenv from 'dotenv';
dotenv.config();

const entities = [UserEntity, CategoryEntity, TemplateEntity, TemplateCategoryEntity, TodoEntity];

export let typeORMConfig: TypeOrmModuleOptions;
if (process.env.NODE_ENV === 'dev') {
  typeORMConfig = {
    type: 'mysql',
    host: process.env.DEV_DB_HOST,
    port: 3307,
    username: process.env.DEV_DB_USERNAME,
    password: process.env.DEV_DB_PASSWORD,
    database: process.env.DEV_DB_DATABASE,
    entities: entities,
    autoLoadEntities: true,
    synchronize: true,
    logging: false,
    keepConnectionAlive: true,
    timezone: '+09:00',
  };
} else if (process.env.NODE_ENV === 'test') {
  typeORMConfig = {
    type: 'mysql',
    host: process.env.TEST_DB_HOST,
    port: Number(process.env.TEST_DB_PORT),
    username: process.env.TEST_DB_USERNAME,
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_DATABASE,
    entities: entities,
    autoLoadEntities: true,
    synchronize: true,
    logging: false,
    keepConnectionAlive: true,
    timezone: '+09:00',
  };
} else {
  //production (prod)
  console.log('DB 연결 성공 : ', process.env.NODE_ENV);
  typeORMConfig = {
    type: 'mysql',
    host: process.env.PROD_DB_HOST,
    port: 3306,
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_DATABASE,
    entities: entities,
    autoLoadEntities: true,
    synchronize: false,
    logging: false,
    keepConnectionAlive: true,
    timezone: '+09:00',
  };
}
