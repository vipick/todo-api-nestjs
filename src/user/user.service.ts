import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CustomHttpException } from 'src/_commons/constants/http-exception.contant';
import { UserEntity } from 'src/_entities/user.entity';
import { UserRepository } from 'src/_repositories/user.repository';
import { SigninRequestDto, SignupRequestDto } from 'src/user/dto/user.request.dto';
import { AccessTokenDto, EmailDto } from 'src/user/dto/user.response.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository, private jwtService: JwtService) {}

  /**
   * 회원가입
   * @param signupRequestDto SignupRequestDto
   * @returns AccessTokenDto
   */
  async signup(signupRequestDto: SignupRequestDto): Promise<AccessTokenDto> {
    const { email, password } = signupRequestDto;

    // 이메일로 회원 찾기
    const user: UserEntity = await this.userRepository.findByEmail(email);
    if (user) {
      throw new HttpException(CustomHttpException['CONFLICT_EMAIL'], HttpStatus.CONFLICT); //이메일 중복
    }

    // 회원 생성
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt); //DB 패스워드 암호화
    await this.userRepository.createUser(email, hashedPassword);

    // JWT 토큰 생성
    const payload = { email };
    const accessToken: string = await this.jwtService.sign(payload);

    return { accessToken };
  }

  /**
   * 로그인
   * @param signinRequestDto SigninRequestDto
   * @returns AccessTokenDto
   */
  async signin(signinRequestDto: SigninRequestDto): Promise<AccessTokenDto> {
    const { email, password } = signinRequestDto;

    // 이메일로 회원 찾기
    const user: UserEntity = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new HttpException(CustomHttpException['UNAUTHORIZED_ACCOUNT'], HttpStatus.UNAUTHORIZED); //이메일이 없는 경우
    }

    if (!(await bcrypt.compare(password, user['password']))) {
      throw new HttpException(CustomHttpException['UNAUTHORIZED_ACCOUNT'], HttpStatus.UNAUTHORIZED); //패스워드가 다른 경우
    }

    // JWT 토큰 생성
    const payload = { email };
    const accessToken: string = await this.jwtService.sign(payload);

    return { accessToken };
  }

  /**
   * 내 정보보기
   * @param user UserEntity
   * @returns EmailDto
   */
  async getMyInfo(user: UserEntity): Promise<EmailDto> {
    const email: string = user.email;

    return { email };
  }
}
