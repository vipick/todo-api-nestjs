import { ApiProperty } from '@nestjs/swagger';
import { CustomHttpSuccess } from 'src/_commons/constants/http-success.contant';

//템플릿 ID
export class TemplateIdDto {
  @ApiProperty({
    example: 3,
    description: '아이디',
  })
  readonly id: number;
}

//템플릿 추가 Response
export class TemplateAddResponseDto {
  @ApiProperty({
    example: 201,
    description: '상태코드',
  })
  readonly statusCode: number;

  @ApiProperty({
    example: CustomHttpSuccess['ADD_TEMPLATE_SUCCESS'],
    description: '메시지',
  })
  readonly message: string;

  @ApiProperty({
    type: TemplateIdDto,
  })
  readonly data: object;
}

//템플릿
export class TemplateDto {
  @ApiProperty({
    example: 3,
    description: '아이디',
  })
  readonly id: number;

  @ApiProperty({
    example: '개인 일정',
    description: '템플릿 이름',
  })
  readonly name: string;
}

//템플릿 리스트
export class TemplateListDto {
  @ApiProperty({
    type: [TemplateDto],
  })
  readonly templates: Array<TemplateDto>;
}

//템플릿 리스트 Response
export class TemplateListResponseDto {
  @ApiProperty({
    example: 200,
    description: '상태코드',
  })
  readonly statusCode: number;

  @ApiProperty({
    example: CustomHttpSuccess['GET_TEMPLATES_SUCCESS'],
    description: '메시지',
  })
  readonly message: string;

  @ApiProperty({
    type: TemplateListDto,
  })
  readonly data: object;
}

//템플릿 수정 Response
export class TemplateUpdateResponseDto {
  @ApiProperty({
    example: 200,
    description: '상태코드',
  })
  readonly statusCode: number;

  @ApiProperty({
    example: CustomHttpSuccess['UPDATE_TEMPLATE_SUCCESS'],
    description: '메시지',
  })
  readonly message: string;
}

//템플릿 삭제 Response
export class TemplateDeleteResponseDto {
  @ApiProperty({
    example: 200,
    description: '상태코드',
  })
  readonly statusCode: number;

  @ApiProperty({
    example: CustomHttpSuccess['DELETE_TEMPLATE_SUCCESS'],
    description: '메시지',
  })
  readonly message: string;
}
