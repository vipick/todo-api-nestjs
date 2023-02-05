import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

// 템플리에서 카테고리 리스트 제거
export class TemplateCategoryIdsDto {
  @IsString()
  @ApiProperty({
    example: '[127, 128]',
    description: '템플릿 카테고리 ids',
    required: true,
  })
  templateCategoryIds: string; //TemplateCategoryIds
}

// 템플릿 복사
export class TemplateCopyRequestDto {
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2023-01-27',
    description: '오늘 날짜',
    required: true,
  })
  today: string; //오늘날짜
}
