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
import { CustomHttpException } from 'src/_commons/constants/http-exception.contant';
import { UserEntity } from 'src/_entities/user.entity';
import { TemplateService } from 'src/template/template.service';
import { TemplateRequestDto } from 'src/template/dto/template.request.dto';
import {
  TemplateAddResponseDto,
  TemplateDeleteResponseDto,
  TemplateIdDto,
  TemplateListDto,
  TemplateListResponseDto,
  TemplateUpdateResponseDto,
} from 'src/template/dto/template.response.dto';

@ApiTags('템플릿')
@ApiBearerAuth()
@ApiSecurity('access-token')
@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  /**
   * 템플릿 추가
   * @param user UserEntity
   * @param templateRequestDto TemplateRequestDto
   * @returns TemplateAddResponseDto
   */
  @ApiOperation({ summary: '템플릿 추가' })
  @ApiCreatedResponse({
    description: CustomHttpSuccess['ADD_TEMPLATE_SUCCESS'],
    type: TemplateAddResponseDto,
  })
  @ApiConflictResponse({
    content: {
      'application/json': {
        examples: {
          CONFLICT_TEMPLATE: {
            description: CustomHttpException['CONFLICT_TEMPLATE']['message'],
            value: CustomHttpException['CONFLICT_TEMPLATE'],
          },
        },
      },
    },
  })
  @Post()
  @UseGuards(AuthGuard())
  async addTemplate(
    @Token() user: UserEntity,
    @Body(ValidationPipe) templateRequestDto: TemplateRequestDto,
  ): Promise<TemplateAddResponseDto> {
    const templateId: TemplateIdDto = await this.templateService.addTemplate(
      +user.id,
      templateRequestDto,
    );
    return {
      statusCode: 201,
      message: CustomHttpSuccess['ADD_TEMPLATE_SUCCESS'],
      data: templateId,
    };
  }

  /**
   * 템플릿 리스트
   * @param user UserEntity
   * @returns TemplateListResponseDto
   */
  @ApiOperation({ summary: '템플릿 리스트' })
  @ApiOkResponse({
    description: CustomHttpSuccess['GET_TEMPLATES_SUCCESS'],
    type: TemplateListResponseDto,
  })
  @Get()
  @UseGuards(AuthGuard())
  async getTemplates(@Token() user: UserEntity): Promise<TemplateListResponseDto> {
    const templates: TemplateListDto = await this.templateService.getTemplates(+user.id);
    return {
      statusCode: 200,
      message: CustomHttpSuccess['GET_TEMPLATES_SUCCESS'],
      data: templates,
    };
  }

  /**
   * 템플릿 수정
   *  @param user UserEntity
   *  @param id string
   *  @param templateRequestDto TemplateRequestDto
   *  @returns TemplateUpdateResponseDto
   */
  @ApiOperation({ summary: '템플릿 수정' })
  @ApiOkResponse({
    description: CustomHttpSuccess['UPDATE_TEMPLATE_SUCCESS'],
    type: TemplateUpdateResponseDto,
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
  @ApiConflictResponse({
    content: {
      'application/json': {
        examples: {
          CONFLICT_TEMPLATE: {
            description: CustomHttpException['CONFLICT_TEMPLATE']['message'],
            value: CustomHttpException['CONFLICT_TEMPLATE'],
          },
        },
      },
    },
  })
  @Patch(':id')
  @UseGuards(AuthGuard())
  async updateTemplate(
    @Token() user: UserEntity,
    @Param('id') id: string,
    @Body(ValidationPipe) templateRequestDto: TemplateRequestDto,
  ): Promise<TemplateUpdateResponseDto> {
    await this.templateService.updateTemplate(+user.id, +id, templateRequestDto);
    return {
      statusCode: 200,
      message: CustomHttpSuccess['UPDATE_TEMPLATE_SUCCESS'],
    };
  }

  /**
   * 템플릿 삭제
   *  @param user UserEntity
   *  @param id string
   *  @returns TemplateDeleteResponseDto
   */
  @ApiOperation({ summary: '템플릿 삭제' })
  @ApiOkResponse({
    description: CustomHttpSuccess['DELETE_TEMPLATE_SUCCESS'],
    type: TemplateDeleteResponseDto,
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
  @Delete(':id')
  @UseGuards(AuthGuard())
  async deleteTemplate(
    @Token() user: UserEntity,
    @Param('id') id: string,
  ): Promise<TemplateDeleteResponseDto> {
    await this.templateService.deleteTemplate(+user.id, +id);
    return {
      statusCode: 200,
      message: CustomHttpSuccess['DELETE_TEMPLATE_SUCCESS'],
    };
  }
}
