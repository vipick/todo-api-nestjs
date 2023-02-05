import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/_commons/auth/jwt.strategy';
import { UserRepository } from 'src/_repositories/user.repository';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_SECRET_EXPIRES_IN },
    }),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [UserController],
  providers: [JwtStrategy, UserService],
})
export class UserModule {}
