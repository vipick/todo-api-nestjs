import {
  Controller,
  Post,
  Body,
  UseGuards,
  ValidationPipe,
  Get,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Token } from 'src/_commons/auth/token.decorator';
import { CustomHttpSuccess } from 'src/_commons/constants/http-success.contant';
import { UserEntity } from 'src/_entities/user.entity';
import { CategoryService } from 'src/category/category.service';
import { CategoryRequestDto } from 'src/category/dto/category.request.dto';
import { CustomHttpException } from 'src/_commons/constants/http-exception.contant';
import {
  CategoryAddResponseDto,
  CategoryDeleteResponseDto,
  CategoryIdDto,
  CategoryListDto,
  CategoryListResponseDto,
  CategoryUpdateResponseDto,
} from 'src/category/dto/category.response.dto';

@ApiTags('카테고리')
@ApiBearerAuth()
@ApiSecurity('access-token')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * 카테고리 추가
   * @param user UserEntity
   * @param categoryRequestDto CategoryRequestDto
   * @returns CategoryAddResponseDto
   */
  @ApiOperation({ summary: '카테고리 추가' })
  @ApiCreatedResponse({
    description: CustomHttpSuccess['ADD_CATEGORY_SUCCESS'],
    type: CategoryAddResponseDto,
  })
  @ApiConflictResponse({
    content: {
      'application/json': {
        examples: {
          CONFLICT_CATEGORY: {
            description: CustomHttpException['CONFLICT_CATEGORY']['message'],
            value: CustomHttpException['CONFLICT_CATEGORY'],
          },
        },
      },
    },
  })
  @Post()
  @UseGuards(AuthGuard())
  async addCategory(
    @Token() user: UserEntity,
    @Body(ValidationPipe) categoryRequestDto: CategoryRequestDto,
  ): Promise<CategoryAddResponseDto> {
    const categoryId: CategoryIdDto = await this.categoryService.addCategory(
      +user.id,
      categoryRequestDto,
    );
    return {
      statusCode: 201,
      message: CustomHttpSuccess['ADD_CATEGORY_SUCCESS'],
      data: categoryId,
    };
  }

  /**
   * 카테고리 리스트
   * @param user UserEntity
   * @returns CategoryListResponseDto
   */
  @ApiOperation({ summary: '카테고리 리스트' })
  @ApiOkResponse({
    description: CustomHttpSuccess['GET_CATEGORIES_SUCCESS'],
    type: CategoryListResponseDto,
  })
  @Get()
  @UseGuards(AuthGuard())
  async getCategories(@Token() user: UserEntity): Promise<CategoryListResponseDto> {
    const categories: CategoryListDto = await this.categoryService.getCategories(+user.id);
    return {
      statusCode: 200,
      message: CustomHttpSuccess['GET_CATEGORIES_SUCCESS'],
      data: categories,
    };
  }

  /**
   * 카테고리 수정
   * @param user UserEntity
   * @param id string
   * @param categoryRequestDto CategoryRequestDto
   * @returns CategoryUpdateResponseDto
   */
  @ApiOperation({ summary: '카테고리 수정' })
  @ApiOkResponse({
    description: CustomHttpSuccess['UPDATE_CATEGORY_SUCCESS'],
    type: CategoryUpdateResponseDto,
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
  @ApiConflictResponse({
    content: {
      'application/json': {
        examples: {
          CONFLICT_CATEGORY: {
            description: CustomHttpException['CONFLICT_CATEGORY']['message'],
            value: CustomHttpException['CONFLICT_CATEGORY'],
          },
        },
      },
    },
  })
  @Patch(':id')
  @UseGuards(AuthGuard())
  async updateCategory(
    @Token() user: UserEntity,
    @Param('id') id: string,
    @Body(ValidationPipe) categoryRequestDto: CategoryRequestDto,
  ): Promise<CategoryUpdateResponseDto> {
    await this.categoryService.updateCategory(+user.id, +id, categoryRequestDto);

    return {
      statusCode: 200,
      message: CustomHttpSuccess['UPDATE_CATEGORY_SUCCESS'],
    };
  }

  /**
   * 카테고리 삭제
   * @param user UserEntity
   * @param id string
   * @param categoryRequestDto CategoryRequestDto
   * @returns CategoryDeleteResponseDto
   */
  @ApiOperation({ summary: '카테고리 삭제' })
  @ApiOkResponse({
    description: CustomHttpSuccess['DELETE_CATEGORY_SUCCESS'],
    type: CategoryDeleteResponseDto,
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
  @Delete(':id')
  @UseGuards(AuthGuard())
  async deleteCategory(
    @Token() user: UserEntity,
    @Param('id') id: string,
  ): Promise<CategoryDeleteResponseDto> {
    await this.categoryService.deleteCategory(+user.id, +id);
    return {
      statusCode: 200,
      message: CustomHttpSuccess['DELETE_CATEGORY_SUCCESS'],
    };
  }
}
