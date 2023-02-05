import {
  Controller,
  Post,
  Param,
  UseGuards,
  Get,
  Delete,
  Body,
  ValidationPipe,
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
import { TemplateCategoryService } from 'src/template-category/template-category.service';
import {
  TemplateCategoryIdsDto,
  TemplateCopyRequestDto,
} from 'src/template-category/dto/template-category.request.dto';
import {
  TemplateCategoryAddDto,
  TemplateCategoryAddResponseDto,
  TemplateCategoryCopyResponseDto,
  TemplateCategoryListDto,
  TemplateCategoryListResponseDto,
  TemplateCategoryRemoveResponseDto,
} from 'src/template-category/dto/template-category.response.dto';

@ApiTags('템플릿-카테고리')
@ApiBearerAuth()
@ApiSecurity('access-token')
@Controller('templates')
export class TemplateCategoryController {
  constructor(private readonly templateCategoryService: TemplateCategoryService) {}

  /**
   * 템플릿에 카테고리 추가
   * @param user UserEntity
   * @param templateId string
   * @param categoryId string
   * @returns TemplateCategoryAddResponseDto
   */
  @ApiOperation({ summary: '템플릿에 카테고리 추가' })
  @ApiCreatedResponse({
    description: CustomHttpSuccess['ADD_CATEGORY_TO_TEMPLATE_SUCCESS'],
    type: TemplateCategoryAddResponseDto,
  })
  @ApiForbiddenResponse({
    content: {
      'application/json': {
        examples: {
          FORBIDDEN_TEMPLATE: {
            description: CustomHttpException['FORBIDDEN_TEMPLATE']['message'],
            value: CustomHttpException['FORBIDDEN_TEMPLATE'],
          },
          FORBIDDEN_CATEGORY: {
            description: CustomHttpException['FORBIDDEN_CATEGORY']['message'],
            value: CustomHttpException['FORBIDDEN_CATEGORY'],
          },
        },
      },
    },
  })
  @Post(':templateId/categories/:categoryId')
  @UseGuards(AuthGuard())
  async addCategoryToTemplate(
    @Token() user: UserEntity,
    @Param('templateId') templateId: string,
    @Param('categoryId') categoryId: string,
  ): Promise<TemplateCategoryAddResponseDto> {
    const templateCategory: TemplateCategoryAddDto =
      await this.templateCategoryService.addCategoryToTemplate(+user.id, +templateId, +categoryId);
    return {
      statusCode: 201,
      message: CustomHttpSuccess['ADD_CATEGORY_TO_TEMPLATE_SUCCESS'],
      data: templateCategory,
    };
  }

  /**
   * 모든 템블릿 카테고리 리스트
   * @param user UserEntity
   * @returns TemplateCategoryListResponseDto
   */
  @ApiOperation({ summary: '모든 템블릿 카테고리 리스트' })
  @ApiOkResponse({
    description: CustomHttpSuccess['GET_TEMPLATE_CATEGORIES_SUCCESS'],
    type: TemplateCategoryListResponseDto,
  })
  @Get('/categories')
  @UseGuards(AuthGuard())
  async getTemplateCategories(@Token() user: UserEntity): Promise<TemplateCategoryListResponseDto> {
    const templateCategories: TemplateCategoryListDto =
      await this.templateCategoryService.getTemplateCategories(+user.id);
    return {
      statusCode: 200,
      message: CustomHttpSuccess['GET_TEMPLATE_CATEGORIES_SUCCESS'],
      data: templateCategories,
    };
  }

  /**
   * 템플릿에서 카테고리 제거
   * @param user UserEntity
   * @param templateId string
   * @param templateCategoryIdsDto TemplateCategoryIdsDto
   * @returns TemplateCategoryRemoveResponseDto
   */
  @ApiOperation({ summary: '템플릿에서 카테고리 제거' })
  @ApiOkResponse({
    description: CustomHttpSuccess['REMOVE_CATEGORY_FROM_TEMPLATE_SUCCESS'],
    type: TemplateCategoryRemoveResponseDto,
  })
  @ApiForbiddenResponse({
    content: {
      'application/json': {
        examples: {
          FORBIDDEN_TEMPLATE: {
            description: CustomHttpException['FORBIDDEN_TEMPLATE']['message'],
            value: CustomHttpException['FORBIDDEN_TEMPLATE'],
          },
          FORBIDDEN_CATEGORY: {
            description: CustomHttpException['FORBIDDEN_CATEGORY']['message'],
            value: CustomHttpException['FORBIDDEN_CATEGORY'],
          },
        },
      },
    },
  })
  @Delete(':templateId/categories')
  @UseGuards(AuthGuard())
  async removeCategoryFromTemplate(
    @Token() user: UserEntity,
    @Param('templateId') templateId: string,
    @Body(ValidationPipe) templateCategoryIdsDto: TemplateCategoryIdsDto,
  ): Promise<TemplateCategoryRemoveResponseDto> {
    const templateCategoryIds = JSON.parse(templateCategoryIdsDto.templateCategoryIds);

    await this.templateCategoryService.removeCategoryFromTemplate(
      +user.id,
      +templateId,
      templateCategoryIds,
    );
    return {
      statusCode: 200,
      message: CustomHttpSuccess['REMOVE_CATEGORY_FROM_TEMPLATE_SUCCESS'],
    };
  }

  /**
   * 템플릿 복사
   * @param user UserEntity
   * @param templateId string
   * @param templateCopyRequestDto TemplateCopyRequestDto
   * @returns TemplateCategoryCopyReponseDto
   */
  @ApiOperation({ summary: '템플릿 복사' })
  @ApiCreatedResponse({
    description: CustomHttpSuccess['COPY_TEMPLATE_SUCCESS'],
    type: TemplateCategoryCopyResponseDto,
  })
  @ApiForbiddenResponse({
    content: {
      'application/json': {
        examples: {
          FORBIDDEN_TEMPLATE: {
            description: CustomHttpException['FORBIDDEN_TEMPLATE']['message'],
            value: CustomHttpException['FORBIDDEN_TEMPLATE'],
          },
        },
      },
    },
  })
  @Post(':templateId/todo-copy')
  @UseGuards(AuthGuard())
  async copyTemplate(
    @Token() user: UserEntity,
    @Param('templateId') templateId: string,
    @Body(ValidationPipe) templateCopyRequestDto: TemplateCopyRequestDto,
  ): Promise<TemplateCategoryCopyResponseDto> {
    await this.templateCategoryService.copyTemplate(+user.id, +templateId, templateCopyRequestDto);
    return {
      statusCode: 201,
      message: CustomHttpSuccess['COPY_TEMPLATE_SUCCESS'],
    };
  }
}
