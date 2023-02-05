import { ApiProperty } from '@nestjs/swagger';
import { CustomHttpSuccess } from 'src/_commons/constants/http-success.contant';

//AccessToken
export class AccessTokenDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imtvb0B0ZXN0LmNvbSIsImlhdCI6MTY1Mzc5MDU0MCwiZXhwIjoxNjU3MzkwNTQwfQ.3dS05AsGerUO15zdYnV6sXszbjt8j3GyzS5OLVD9WKE',
    description: 'Access Token',
  })
  readonly accessToken: string;
}

//회원가입 Response
export class SignupResponseDto {
  @ApiProperty({
    example: 201,
    description: '상태코드',
  })
  readonly statusCode: number;

  @ApiProperty({
    example: CustomHttpSuccess['SIGNUP_SUCCESS'],
    description: '메시지',
  })
  readonly message: string;

  @ApiProperty({
    type: AccessTokenDto,
  })
  readonly data: object;
}

//로그인 Response
export class SigninResponseDto {
  @ApiProperty({
    example: 200,
    description: '상태코드',
  })
  readonly statusCode: number;

  @ApiProperty({
    example: CustomHttpSuccess['SIGNIN_SUCCESS'],
    description: '메시지',
  })
  readonly message: string;

  @ApiProperty({
    type: AccessTokenDto,
  })
  readonly data: object;
}

//이메일
export class EmailDto {
  @ApiProperty({
    example: 'test@test.com',
    description: '이메일',
  })
  readonly email: string;
}

//내 정보보기 Response
export class MeResponseDto {
  @ApiProperty({
    example: 200,
    description: '상태코드',
  })
  readonly statusCode: number;

  @ApiProperty({
    example: CustomHttpSuccess['GET_MY_INFO_SUCCESS'],
    description: '메시지',
  })
  readonly message: string;

  @ApiProperty({
    type: EmailDto,
  })
  readonly data: object;
}
