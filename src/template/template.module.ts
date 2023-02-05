import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateRepository } from 'src/_repositories/template.repository';
import { TemplateController } from 'src/template/template.controller';
import { TemplateService } from 'src/template/template.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([TemplateRepository]),
  ],
  controllers: [TemplateController],
  providers: [TemplateService],
})
export class TemplateModule {}
