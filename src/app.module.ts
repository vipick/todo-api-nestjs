import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from 'src/_configs/typeorm.config';
import { LoggerMiddleware } from 'src/_commons/middlewares/logger.middleware';
import { AppController } from 'src/app.controller';
import { UserModule } from 'src/user/user.module';
import { CategoryModule } from 'src/category/category.module';
import { TodoModule } from 'src/todo/todo.module';
import { TemplateModule } from 'src/template/template.module';
import { TemplateCategoryModule } from 'src/template-category/template-category.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    UserModule,
    CategoryModule,
    TodoModule,
    TemplateModule,
    TemplateCategoryModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
