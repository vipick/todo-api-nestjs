import { ApiProperty } from '@nestjs/swagger';
import { CustomHttpSuccess } from 'src/_commons/constants/http-success.contant';

//카테고리 ID
export class CategoryIdDto {
  @ApiProperty({
    example: 3,
    description: '아이디',
  })
  readonly id: number;
}

//카테고리 추가 Response
export class CategoryAddResponseDto {
  @ApiProperty({
    example: 201,
    description: '상태코드',
  })
  readonly statusCode: number;

  @ApiProperty({
    example: CustomHttpSuccess['ADD_CATEGORY_SUCCESS'],
    description: '메시지',
  })
  readonly message: string;

  @ApiProperty({
    type: CategoryIdDto,
  })
  readonly data: object;
}

//카테고리
export class CategoryDto {
  @ApiProperty({
    example: 3,
    description: '아이디',
  })
  readonly id: number;

  @ApiProperty({
    example: '코딩',
    description: '카테고리 이름',
  })
  readonly name: string;
}

//카테고리 리스트
export class CategoryListDto {
  @ApiProperty({
    type: [CategoryDto],
  })
  readonly categories: Array<CategoryDto>;
}

//카테고리 리스트 Response
export class CategoryListResponseDto {
  @ApiProperty({
    example: 200,
    description: '상태코드',
  })
  readonly statusCode: number;

  @ApiProperty({
    example: CustomHttpSuccess['GET_CATEGORIES_SUCCESS'],
    description: '메시지',
  })
  readonly message: string;

  @ApiProperty({
    type: CategoryListDto,
  })
  readonly data: object;
}

//카테고리 수정 Response
export class CategoryUpdateResponseDto {
  @ApiProperty({
    example: 200,
    description: '상태코드',
  })
  readonly statusCode: number;

  @ApiProperty({
    example: CustomHttpSuccess['UPDATE_CATEGORY_SUCCESS'],
    description: '메시지',
  })
  readonly message: string;
}

//카테고리 삭제 Response
export class CategoryDeleteResponseDto {
  @ApiProperty({
    example: 200,
    description: '상태코드',
  })
  readonly statusCode: number;

  @ApiProperty({
    example: CustomHttpSuccess['DELETE_CATEGORY_SUCCESS'],
    description: '메시지',
  })
  readonly message: string;
}
