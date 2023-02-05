import { HttpException, HttpStatus } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CustomHttpException } from 'src/_commons/constants/http-exception.contant';
import { TodoEntity } from 'src/_entities/todo.entity';
import { TodoRequestDto } from 'src/todo/dto/todo.request.dto';
import { TodoDto } from 'src/todo/dto/todo.response.dto';

@EntityRepository(TodoEntity)
export class TodoRepository extends Repository<TodoEntity> {
  // ToDo 추가
  async createTodo(todoRequestDto: TodoRequestDto): Promise<number> {
    try {
      const todoId = await this.insert(todoRequestDto);
      return todoId.identifiers[0].id;
    } catch (error) {
      throw new HttpException(
        CustomHttpException['DB_SERVER_ERROR'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 모든 ToDo 리스트 조회
  async findAllTodos(userId: number, today: string): Promise<Array<TodoDto>> {
    try {
      const todos = await this.find({
        where: { userId: userId, today: today },
        relations: ['category'],
        order: {
          createdAt: 'ASC',
        },
      });

      const result: Array<TodoDto> = await todos.map((todo) => {
        return {
          id: todo.id,
          categoryId: todo.categoryId,
          status: todo.status,
          memo: todo.memo,
          today: todo.today.toString(),
          categoryName: todo.category?.name,
          createdAt: todo.createdAt,
        };
      });

      return result;
    } catch (error) {
      throw new HttpException(
        CustomHttpException['DB_SERVER_ERROR'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ToDo 접근 권한 체크
  async checkTodoAccess(userId: number, id: number): Promise<TodoEntity> {
    try {
      const todo: TodoEntity = await this.findOne({ where: { userId: userId, id: id } });
      return todo;
    } catch (error) {
      throw new HttpException(
        CustomHttpException['DB_SERVER_ERROR'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ToDo 수정
  async updateTodo(id: number, todoRequestDto: TodoRequestDto): Promise<void> {
    try {
      await this.update(id, todoRequestDto);
    } catch (error) {
      throw new HttpException(
        CustomHttpException['DB_SERVER_ERROR'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ToDo 삭제
  async deleteTodo(id: number): Promise<void> {
    try {
      await this.delete(id);
    } catch (error) {
      throw new HttpException(
        CustomHttpException['DB_SERVER_ERROR'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ToDo 2개 이상 추가
  async createTodos(todos: Array<TodoRequestDto>): Promise<void> {
    try {
      await this.save(todos);
    } catch (error) {
      throw new HttpException(
        CustomHttpException['DB_SERVER_ERROR'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
