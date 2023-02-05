import { Body, Controller, Get, HttpCode, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Token } from 'src/_commons/auth/token.decorator';
import { CustomHttpSuccess } from 'src/_commons/constants/http-success.contant';
import { CustomHttpException } from 'src/_commons/constants/http-exception.contant';
import { UserEntity } from 'src/_entities/user.entity';
import { UserService } from 'src/user/user.service';
import { SigninRequestDto, SignupRequestDto } from 'src/user/dto/user.request.dto';
import {
  AccessTokenDto,
  MeResponseDto,
  SigninResponseDto,
  SignupResponseDto,
} from 'src/user/dto/user.response.dto';

@ApiTags('회원')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * 회원가입
   *  @param signupRequestDto SignupRequestDto
   *  @returns SignupResponseDto
   */
  @ApiOperation({ summary: '회원가입' })
  @ApiCreatedResponse({
    description: CustomHttpSuccess['SIGNUP_SUCCESS'],
    type: SignupResponseDto,
  })
  @ApiConflictResponse({
    content: {
      'application/json': {
        examples: {
          CONFLICT_CATEGORY: {
            description: CustomHttpException['CONFLICT_EMAIL']['message'],
            value: CustomHttpException['CONFLICT_EMAIL'],
          },
        },
      },
    },
  })
  @Post('/signup')
  async signup(
    @Body(ValidationPipe) signupRequestDto: SignupRequestDto,
  ): Promise<SignupResponseDto> {
    const accessToken: AccessTokenDto = await this.userService.signup(signupRequestDto);
    return {
      statusCode: 201,
      message: CustomHttpSuccess['SIGNUP_SUCCESS'],
      data: accessToken,
    };
  }

  /**
   * 로그인
   * @param signinRequestDto SigninRequestDto
   * @returns SigninResponseDto
   */
  @ApiOperation({ summary: '로그인' })
  @ApiOkResponse({
    description: CustomHttpSuccess['SIGNIN_SUCCESS'],
    type: SigninResponseDto,
  })
  @ApiUnauthorizedResponse({
    content: {
      'application/json': {
        examples: {
          UNAUTHORIZED_ACCOUNT: {
            description: CustomHttpException['UNAUTHORIZED_ACCOUNT']['message'],
            value: CustomHttpException['UNAUTHORIZED_ACCOUNT'],
          },
        },
      },
    },
  })
  @HttpCode(200)
  @Post('/signin')
  async signin(
    @Body(ValidationPipe) signinRequestDto: SigninRequestDto,
  ): Promise<SigninResponseDto> {
    const accessToken = await this.userService.signin(signinRequestDto);
    return {
      statusCode: 200,
      message: CustomHttpSuccess['SIGNIN_SUCCESS'],
      data: accessToken,
    };
  }

  /**
   * 내 정보 보기
   * @param user UserEntity
   * @returns MeResponseDto
   */
  @ApiOperation({ summary: '내 정보 보기' })
  @ApiBearerAuth()
  @ApiSecurity('access-token')
  @ApiOkResponse({
    description: CustomHttpSuccess['GET_MY_INFO_SUCCESS'],
    type: MeResponseDto,
  })
  @Get('/me')
  @UseGuards(AuthGuard())
  async getMyInfo(@Token() user: UserEntity): Promise<MeResponseDto> {
    const email = await this.userService.getMyInfo(user);
    return {
      statusCode: 200,
      message: CustomHttpSuccess['GET_MY_INFO_SUCCESS'],
      data: email,
    };
  }
}
