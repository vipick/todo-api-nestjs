import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoRepository } from 'src/_repositories/todo.repository';
import { CategoryRepository } from 'src/_repositories/category.repository';
import { TodoController } from 'src/todo/todo.controller';
import { TodoService } from 'src/todo/todo.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([TodoRepository, CategoryRepository]),
  ],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
