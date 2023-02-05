import { HttpException, HttpStatus } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CustomHttpException } from 'src/_commons/constants/http-exception.contant';
import { TemplateEntity } from 'src/_entities/template.entity';
import { TemplateDto } from 'src/template/dto/template.response.dto';
import { TemplateRequestDto } from 'src/template/dto/template.request.dto';

@EntityRepository(TemplateEntity)
export class TemplateRepository extends Repository<TemplateEntity> {
  // 템플릿 이름 중복 체크
  async findTemplateByName(userId: number, name: string): Promise<TemplateEntity> {
    try {
      const template: TemplateEntity = await this.findOne({
        where: { userId: userId, name: name },
      });
      return template;
    } catch (error) {
      throw new HttpException(
        CustomHttpException['DB_SERVER_ERROR'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 템플릿 추가
  async createTemplate(userId: number, name: string): Promise<number> {
    try {
      const template = await this.insert({ userId: userId, name: name });
      return template.identifiers[0].id;
    } catch (error) {
      throw new HttpException(
        CustomHttpException['DB_SERVER_ERROR'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 모든 템플릿 리스트 조회
  async findAllTemplates(userId: number): Promise<Array<TemplateDto>> {
    try {
      const templates: Array<TemplateDto> = await this.find({
        where: { userId: userId },
        order: {
          createdAt: 'ASC',
        },
        select: ['id', 'name'],
      });

      return templates;
    } catch (error) {
      throw new HttpException(
        CustomHttpException['DB_SERVER_ERROR'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 템플릿 접근 권한 체크
  async checkTemplateAccess(userId: number, id: number): Promise<TemplateEntity> {
    try {
      const template: TemplateEntity = await this.findOne({
        where: { userId: userId, id: id },
      });
      return template;
    } catch (error) {
      throw new HttpException(
        CustomHttpException['DB_SERVER_ERROR'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 템플릿 수정
  async updateTemplate(id: number, templateRequestDto: TemplateRequestDto): Promise<void> {
    try {
      await this.update(id, templateRequestDto);
    } catch (error) {
      throw new HttpException(
        CustomHttpException['DB_SERVER_ERROR'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 템플릿 삭제
  async deleteTemplate(id: number): Promise<void> {
    try {
      await this.delete(id);
    } catch (error) {
      throw new HttpException(
        CustomHttpException['DB_SERVER_ERROR'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // userId 에 해당하는 모든 템플릿 id 반환
  async getTemplateIdsByUserId(userId: number): Promise<Array<number>> {
    try {
      const templates: Array<TemplateEntity> = await this.find({ where: { userId: userId } });

      const templateIds = [];
      templates.forEach((item) => {
        templateIds.push(item.id);
      });
      return templateIds;
    } catch (error) {
      throw new HttpException(
        CustomHttpException['DB_SERVER_ERROR'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
