import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class TodoRequestDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 3,
    description: '아이디',
    required: true,
  })
  categoryId: number; //ToDo 아이디

  @IsString()
  @IsNotEmpty()
  @IsIn(['TODO', 'DONE'], {
    message: 'status는 TODO, DONE 만 가능합니다.',
  })
  @MaxLength(10)
  @ApiProperty({
    enum: ['TODO', 'DONE'],
    description: '상태 : TODO(진행중), DONE(완료)',
    required: true,
  })
  status: string; //상태

  @IsString()
  @MaxLength(1000)
  @ApiProperty({
    example: 'NestJS 스터디',
    description: '메모',
    required: false,
  })
  memo: string; //메모

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2023-01-27',
    description: 'ToDo 날짜',
    required: true,
  })
  today: string; //ToDO 날짜
}

export class TodayRequestDto {
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2023-01-27',
    description: 'ToDo 날짜',
    required: true,
  })
  today: string; //ToDO 날짜
}
