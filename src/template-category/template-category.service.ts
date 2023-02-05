import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CustomHttpException } from 'src/_commons/constants/http-exception.contant';
import { TemplateCategoryEntity } from 'src/_entities/template-category.entity';
import { TemplateEntity } from 'src/_entities/template.entity';
import { CategoryEntity } from 'src/_entities/category.entity';
import { TemplateCategoryRepository } from 'src/_repositories/template-category.repository';
import { TemplateRepository } from 'src/_repositories/template.repository';
import { CategoryRepository } from 'src/_repositories/category.repository';
import { TodoRepository } from 'src/_repositories/todo.repository';
import { TemplateCopyRequestDto } from 'src/template-category/dto/template-category.request.dto';
import { TodoRequestDto } from 'src/todo/dto/todo.request.dto';
import {
  TemplateCategoryAddDto,
  TemplateCategoryDto,
  TemplateCategoryListDto,
} from 'src/template-category/dto/template-category.response.dto';

@Injectable()
export class TemplateCategoryService {
  constructor(
    private templateCategoryRepository: TemplateCategoryRepository,
    private templateRepository: TemplateRepository,
    private categoryRepository: CategoryRepository,
    private todoRepository: TodoRepository,
  ) {}

  /**
   * 템플릿에 카테고리 추가
   * @param userId number
   * @param templateId number
   * @param categoryId number
   * @returns TemplateCategoryAddDto
   */
  async addCategoryToTemplate(
    userId: number,
    templateId: number,
    categoryId: number,
  ): Promise<TemplateCategoryAddDto> {
    //템플릿 접근 권한 체크
    const templateAccess: TemplateEntity = await this.templateRepository.checkTemplateAccess(
      userId,
      templateId,
    );
    if (!templateAccess) {
      throw new HttpException(CustomHttpException['FORBIDDEN_TEMPLATE'], HttpStatus.FORBIDDEN);
    }

    //카테고리 접근 권한 체크
    const categoryAccess: CategoryEntity = await this.categoryRepository.checkCategoryAccess(
      userId,
      categoryId,
    );
    if (!categoryAccess) {
      throw new HttpException(CustomHttpException['FORBIDDEN_CATEGORY'], HttpStatus.FORBIDDEN);
    }

    const templateCategory: TemplateCategoryDto =
      await this.templateCategoryRepository.createCategoryToTemplate(
        templateId,
        categoryId,
        categoryAccess['name'],
      );

    return {
      templateCategory: templateCategory,
    };
  }

  /**
   * 템플릿 별 카테고리 리스트
   * @param userId number
   * @returns TemplateCategoryListDto
   */
  async getTemplateCategories(userId: number): Promise<TemplateCategoryListDto> {
    const templateIds: Array<number> = await this.templateRepository.getTemplateIdsByUserId(userId);

    const templateCategories: Array<TemplateCategoryDto> =
      await this.templateCategoryRepository.findAllTemplates(templateIds);

    return { templateCategories: templateCategories };
  }

  /**
   * 템플릿에서 카테고리 제거
   * @param userId number
   * @param templateId number
   * @param templateCategoryIds Array<number>
   * @returns
   */
  async removeCategoryFromTemplate(
    userId: number,
    templateId: number,
    templateCategoryIds: Array<number>,
  ): Promise<void> {
    //템플릿 접근 권한 체크
    const templateAccess: TemplateEntity = await this.templateRepository.checkTemplateAccess(
      userId,
      templateId,
    );
    if (!templateAccess) {
      throw new HttpException(CustomHttpException['FORBIDDEN_TEMPLATE'], HttpStatus.FORBIDDEN);
    }

    //템플릿 카테고리에서 카테고리 ids 접근 권한 체크
    const templateCategoriesCount: number =
      await this.templateCategoryRepository.countTemplatCategories(templateCategoryIds);
    if (templateCategoryIds.length != templateCategoriesCount) {
      throw new HttpException(
        CustomHttpException['FORBIDDEN_TEMPLATE_CATEGORY'],
        HttpStatus.FORBIDDEN,
      );
    }

    // 템플릿에서 카테고리 리스트 제거
    await this.templateCategoryRepository.removeCategoriesFromTemplate(templateCategoryIds);
  }

  /**
   * 템플릿 복사
   * @param userId number
   * @param id number
   * @param templateCopyRequestDto TemplateCopyRequestDto
   * @returns
   */
  async copyTemplate(
    userId: number,
    id: number,
    templateCopyRequestDto: TemplateCopyRequestDto,
  ): Promise<void> {
    //템플릿 접근 권한 체크
    const templateAccess = await this.templateRepository.checkTemplateAccess(userId, id);
    if (!templateAccess) {
      throw new HttpException(CustomHttpException['FORBIDDEN_TEMPLATE'], HttpStatus.FORBIDDEN);
    }

    //템플릿을 가져온다.
    const categories: Array<TemplateCategoryEntity> =
      await this.templateCategoryRepository.getCategoriesFromTemplate(id);
    // map 으로 한 번에 가져와서 한 번에 저장
    const todos: Array<TodoRequestDto> = await categories.map((item) => {
      return {
        userId: userId,
        categoryId: item['category']['id'],
        status: 'TODO',
        memo: null,
        today: templateCopyRequestDto['today'],
      };
    });

    // ToDo 2개 이상 추가
    await this.todoRepository.createTodos(todos);
  }
}
