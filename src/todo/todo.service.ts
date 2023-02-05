import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CustomHttpException } from 'src/_commons/constants/http-exception.contant';
import { TodoEntity } from 'src/_entities/todo.entity';
import { CategoryEntity } from 'src/_entities/category.entity';
import { TodoRepository } from 'src/_repositories/todo.repository';
import { CategoryRepository } from 'src/_repositories/category.repository';
import { TodoRequestDto, TodayRequestDto } from 'src/todo/dto/todo.request.dto';
import { TodoDto, TodoIdDto, TodoListDto } from 'src/todo/dto/todo.response.dto';

@Injectable()
export class TodoService {
  constructor(
    private todoRepository: TodoRepository,
    private categoryRepository: CategoryRepository,
  ) {}

  /**
   * Todo 추가
   * @param userId number
   * @param todoRequestDto TodoRequestDto
   * @returns TodoIdDto
   */
  async addTodo(userId: number, todoRequestDto: TodoRequestDto): Promise<TodoIdDto> {
    const categoryId: number = todoRequestDto['categoryId'];

    //카테고리 접근 권한 체크
    const categoryAccess: CategoryEntity = await this.categoryRepository.checkCategoryAccess(
      userId,
      categoryId,
    );
    if (!categoryAccess) {
      throw new HttpException(CustomHttpException['FORBIDDEN_CATEGORY'], HttpStatus.FORBIDDEN);
    }

    todoRequestDto['userId'] = userId;
    const todoId: number = await this.todoRepository.createTodo(todoRequestDto);
    return { id: todoId };
  }

  /**
   * Todo 리스트
   * @param userId number
   * @param todayRequestDto TodayRequestDtro
   * @returns TodoListDto
   */
  async getTodos(userId: number, todayRequestDto: TodayRequestDto): Promise<TodoListDto> {
    const today: string = todayRequestDto.today;
    const todos: Array<TodoDto> = await this.todoRepository.findAllTodos(userId, today);

    return { todos: todos };
  }

  /**
   * Todo 수정
   * @param userId number
   * @param id number
   * @param todoRequestDto TodoRequestDto
   * @returns
   */
  async updateTodo(userId: number, id: number, todoRequestDto: TodoRequestDto): Promise<void> {
    const categoryId: number = todoRequestDto['categoryId'];

    //카테고리 접근 권한 체크
    const categoryAccess: CategoryEntity = await this.categoryRepository.checkCategoryAccess(
      userId,
      categoryId,
    );
    if (!categoryAccess) {
      throw new HttpException(CustomHttpException['FORBIDDEN_CATEGORY'], HttpStatus.FORBIDDEN);
    }

    //Todo 접근 권한 체크
    const todo: TodoEntity = await this.todoRepository.checkTodoAccess(userId, id);
    if (!todo) {
      throw new HttpException(CustomHttpException['FORBIDDEN_TODO'], HttpStatus.FORBIDDEN);
    }

    await this.todoRepository.updateTodo(id, todoRequestDto);
  }

  /**
   * Todo 삭제
   * @param userId number
   * @param id number
   * @returns
   */
  async deleteTodo(userId: number, id: number): Promise<void> {
    //Todo 접근 권한 체크
    const todo: TodoEntity = await this.todoRepository.checkTodoAccess(userId, id);
    if (!todo) {
      throw new HttpException(CustomHttpException['FORBIDDEN_TODO'], HttpStatus.FORBIDDEN);
    }

    await this.todoRepository.deleteTodo(id);
  }
}
