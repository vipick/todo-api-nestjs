import {
  Controller,
  Post,
  Body,
  UseGuards,
  ValidationPipe,
  Get,
  Query,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Token } from 'src/_commons/auth/token.decorator';
import { CustomHttpSuccess } from 'src/_commons/constants/http-success.contant';
import { CustomHttpException } from 'src/_commons/constants/http-exception.contant';
import { UserEntity } from 'src/_entities/user.entity';
import { TodoService } from 'src/todo/todo.service';
import { TodayRequestDto, TodoRequestDto } from 'src/todo/dto/todo.request.dto';
import {
  TodoIdDto,
  TodoAddResponseDto,
  TodoListResponseDto,
  TodoListDto,
  TodoUpdateResponseDto,
  TodoDeleteResponseDto,
} from 'src/todo/dto/todo.response.dto';

@ApiTags('ToDo')
@ApiBearerAuth()
@ApiSecurity('access-token')
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  /**
   * Todo 추가
   * @param user UserEntity
   * @param todoRequestDto TodoRequestDto
   * @returns TodoAddResponseDto
   */
  @ApiOperation({ summary: 'ToDo 추가' })
  @ApiCreatedResponse({
    description: CustomHttpSuccess['ADD_TODO_SUCCESS'],
    type: TodoAddResponseDto,
  })
  @ApiForbiddenResponse({
    content: {
      'application/json': {
        examples: {
          FORBIDDEN_CATEGORY: {
            description: CustomHttpException['FORBIDDEN_CATEGORY']['message'],
            value: CustomHttpException['FORBIDDEN_CATEGORY'],
          },
        },
      },
    },
  })
  @Post()
  @UseGuards(AuthGuard())
  async addTodo(
    @Token() user: UserEntity,
    @Body(ValidationPipe) todoRequestDto: TodoRequestDto,
  ): Promise<TodoAddResponseDto> {
    const todoId: TodoIdDto = await this.todoService.addTodo(+user.id, todoRequestDto);
    return {
      statusCode: 201,
      message: CustomHttpSuccess['ADD_TODO_SUCCESS'],
      data: todoId,
    };
  }

  /**
   * Todo 리스트
   * @param user UserEntity
   * @param todayRequestDto TodayRequestDto
   * @returns TodoListResponseDto
   */
  @ApiOperation({ summary: 'ToDo 리스트' })
  @ApiOkResponse({
    description: CustomHttpSuccess['GET_TODOS_SUCCESS'],
    type: TodoListResponseDto,
  })
  @Get()
  @UseGuards(AuthGuard())
  async getTodos(
    @Token() user: UserEntity,
    @Query(ValidationPipe) todayRequestDto: TodayRequestDto,
  ): Promise<TodoListResponseDto> {
    const todos: TodoListDto = await this.todoService.getTodos(+user.id, todayRequestDto);
    return {
      statusCode: 200,
      message: CustomHttpSuccess['GET_TODOS_SUCCESS'],
      data: todos,
    };
  }

  /**
   * Todo 수정
   * @param user UserEntity
   * @param id string
   * @param TodoRequestDto TodoRequestDto
   * @returns TodoUpdateResponseDto
   */
  @ApiOperation({ summary: 'ToDo 수정' })
  @ApiOkResponse({
    description: CustomHttpSuccess['UPDATE_TODO_SUCCESS'],
    type: TodoUpdateResponseDto,
  })
  @ApiForbiddenResponse({
    content: {
      'application/json': {
        examples: {
          FORBIDDEN_TODO: {
            description: CustomHttpException['FORBIDDEN_TODO']['message'],
            value: CustomHttpException['FORBIDDEN_TODO'],
          },
          FORBIDDEN_CATEGORY: {
            description: CustomHttpException['FORBIDDEN_CATEGORY']['message'],
            value: CustomHttpException['FORBIDDEN_CATEGORY'],
          },
        },
      },
    },
  })
  @Patch(':id')
  @UseGuards(AuthGuard())
  async updateTodo(
    @Token() user: UserEntity,
    @Param('id') id: string,
    @Body(ValidationPipe) todoRequestDto: TodoRequestDto,
  ): Promise<TodoUpdateResponseDto> {
    await this.todoService.updateTodo(+user.id, +id, todoRequestDto);
    return {
      statusCode: 200,
      message: CustomHttpSuccess['UPDATE_TODO_SUCCESS'],
    };
  }

  /**
   * Todo 삭제
   * @param user UserEntity
   * @param id string
   * @returns TodoDeleteResponseDto
   */
  @ApiOperation({ summary: 'ToDo 삭제' })
  @ApiOkResponse({
    description: CustomHttpSuccess['DELETE_TODO_SUCCESS'],
    type: TodoDeleteResponseDto,
  })
  @ApiForbiddenResponse({
    content: {
      'application/json': {
        examples: {
          FORBIDDEN_TODO: {
            description: CustomHttpException['FORBIDDEN_TODO']['message'],
            value: CustomHttpException['FORBIDDEN_TODO'],
          },
        },
      },
    },
  })
  @Delete(':id')
  @UseGuards(AuthGuard())
  async deleteTodo(
    @Token() user: UserEntity,
    @Param('id') id: string,
  ): Promise<TodoDeleteResponseDto> {
    await this.todoService.deleteTodo(+user.id, +id);
    return {
      statusCode: 200,
      message: CustomHttpSuccess['DELETE_TODO_SUCCESS'],
    };
  }
}
