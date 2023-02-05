import { ApiProperty } from '@nestjs/swagger';
import { CustomHttpSuccess } from 'src/_commons/constants/http-success.contant';

//템플릿 카테고리
export class TemplateCategoryDto {
  @ApiProperty({
    example: 3,
    description: '아이디',
  })
  readonly id: number;

  @ApiProperty({
    example: 13,
    description: '템플릿 아이디',
  })
  readonly templateId: number;

  @ApiProperty({
    example: 23,
    description: '카테고리 아이디',
  })
  readonly categoryId: number;

  @ApiProperty({
    example: 'NestJS 스터디',
    description: '카테고리 이름',
  })
  readonly categoryName: string;

  @ApiProperty({
    example: '2023-01-27T04:34:42.288Z',
    description: '생성 날짜',
  })
  readonly createdAt: Date;
}

//템플릿 카테고리 추가 DTO
export class TemplateCategoryAddDto {
  @ApiProperty({
    type: TemplateCategoryDto,
  })
  readonly templateCategory: object;
}

//템플릿 카테고리 추가 Response
export class TemplateCategoryAddResponseDto {
  @ApiProperty({
    example: 201,
    description: '상태코드',
  })
  readonly statusCode: number;

  @ApiProperty({
    example: CustomHttpSuccess['ADD_CATEGORY_TO_TEMPLATE_SUCCESS'],
    description: '메시지',
  })
  readonly message: string;

  @ApiProperty({
    type: TemplateCategoryAddDto,
  })
  readonly data: object;
}

//템플릿 카테고리 리스트 DTO
export class TemplateCategoryListDto {
  @ApiProperty({
    type: [TemplateCategoryDto],
  })
  readonly templateCategories: Array<TemplateCategoryDto>;
}

//템플릿 카테고리 리스트 Response
export class TemplateCategoryListResponseDto {
  @ApiProperty({
    example: 200,
    description: '상태코드',
  })
  readonly statusCode: number;

  @ApiProperty({
    example: CustomHttpSuccess['GET_TEMPLATE_CATEGORIES_SUCCESS'],
    description: '메시지',
  })
  readonly message: string;

  @ApiProperty({
    type: TemplateCategoryListDto,
  })
  readonly data: object;
}

//템플릿에서 카테고리 제거 Response
export class TemplateCategoryRemoveResponseDto {
  @ApiProperty({
    example: 200,
    description: '상태코드',
  })
  readonly statusCode: number;

  @ApiProperty({
    example: CustomHttpSuccess['REMOVE_CATEGORY_FROM_TEMPLATE_SUCCESS'],
    description: '메시지',
  })
  readonly message: string;
}

//템플릿 복사 Response
export class TemplateCategoryCopyResponseDto {
  @ApiProperty({
    example: 201,
    description: '상태코드',
  })
  readonly statusCode: number;

  @ApiProperty({
    example: CustomHttpSuccess['COPY_TEMPLATE_SUCCESS'],
    description: '메시지',
  })
  readonly message: string;
}
