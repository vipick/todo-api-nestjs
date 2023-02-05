import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CustomHttpException } from 'src/_commons/constants/http-exception.contant';
import { TemplateEntity } from 'src/_entities/template.entity';
import { TemplateRepository } from 'src/_repositories/template.repository';
import { TemplateRequestDto } from 'src/template/dto/template.request.dto';
import {
  TemplateDto,
  TemplateIdDto,
  TemplateListDto,
} from 'src/template/dto/template.response.dto';

@Injectable()
export class TemplateService {
  constructor(private templateRepository: TemplateRepository) {}

  /**
   * 템플릿 추가
   * @param userId number
   * @param templateRequestDto TemplateRequestDto
   * @returns TemplateIdDto
   */
  async addTemplate(
    userId: number,
    templateRequestDto: TemplateRequestDto,
  ): Promise<TemplateIdDto> {
    const name: string = templateRequestDto['name'];

    //템플릿 이름 중복 체크
    const templateName: TemplateEntity = await this.templateRepository.findTemplateByName(
      userId,
      name,
    );
    if (templateName) {
      throw new HttpException(CustomHttpException['CONFLICT_TEMPLATE'], HttpStatus.CONFLICT);
    }

    const templateId: number = await this.templateRepository.createTemplate(userId, name);

    return { id: templateId };
  }

  /**
   * 템플릿 리스트
   * @param userId number
   * @returns TemplateListDto
   */
  async getTemplates(userId: number): Promise<TemplateListDto> {
    const templates: Array<TemplateDto> = await this.templateRepository.findAllTemplates(userId);

    return { templates };
  }

  /**
   * 템플릿 수정
   * @param userId number
   * @param id number
   * @param TemplateRequestDto TemplateRequestDto
   * @returns
   */
  async updateTemplate(
    userId: number,
    id: number,
    templateRequestDto: TemplateRequestDto,
  ): Promise<void> {
    //템플릿 접근 권한 체크
    const templateAccess: TemplateEntity = await this.templateRepository.checkTemplateAccess(
      userId,
      id,
    );
    if (!templateAccess) {
      throw new HttpException(CustomHttpException['FORBIDDEN_TEMPLATE'], HttpStatus.FORBIDDEN);
    }

    //템플릿 이름 중복 체크
    const name: string = templateRequestDto['name'];
    const templateName: TemplateEntity = await this.templateRepository.findTemplateByName(
      userId,
      name,
    );
    if (templateName) {
      throw new HttpException(CustomHttpException['CONFLICT_TEMPLATE'], HttpStatus.CONFLICT);
    }

    await this.templateRepository.updateTemplate(id, templateRequestDto);
  }

  /**
   * 템플릿 삭제
   * @param userId number
   * @param id number
   * @returns
   */
  async deleteTemplate(userId: number, id: number): Promise<void> {
    //템플릿 접근 권한 체크
    const templateAccess: TemplateEntity = await this.templateRepository.checkTemplateAccess(
      userId,
      id,
    );
    if (!templateAccess) {
      throw new HttpException(CustomHttpException['FORBIDDEN_TEMPLATE'], HttpStatus.FORBIDDEN);
    }

    await this.templateRepository.deleteTemplate(id);
  }
}
