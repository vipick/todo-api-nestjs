import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateCategoryController } from 'src/template-category/template-category.controller';
import { TemplateCategoryService } from 'src/template-category/template-category.service';
import { TemplateCategoryRepository } from 'src/_repositories/template-category.repository';
import { TemplateRepository } from 'src/_repositories/template.repository';
import { TodoRepository } from 'src/_repositories/todo.repository';
import { CategoryRepository } from 'src/_repositories/category.repository';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([
      TemplateCategoryRepository,
      TemplateRepository,
      CategoryRepository,
      TodoRepository,
    ]),
  ],
  controllers: [TemplateCategoryController],
  providers: [TemplateCategoryService],
})
export class TemplateCategoryModule {}
