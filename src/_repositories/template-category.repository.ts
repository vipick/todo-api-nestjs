import { HttpException, HttpStatus } from '@nestjs/common';
import { EntityRepository, In, Repository } from 'typeorm';
import { CustomHttpException } from 'src/_commons/constants/http-exception.contant';
import { TemplateCategoryEntity } from 'src/_entities/template-category.entity';
import { TemplateCategoryDto } from 'src/template-category/dto/template-category.response.dto';

@EntityRepository(TemplateCategoryEntity)
export class TemplateCategoryRepository extends Repository<TemplateCategoryEntity> {
  // 템플릿에 카테고리 추가
  async createCategoryToTemplate(
    templateId: number,
    categoryId: number,
    categoryName: string,
  ): Promise<TemplateCategoryDto> {
    try {
      const result = await this.insert({ templateId: templateId, categoryId: categoryId });

      return {
        id: result.generatedMaps[0]['id'],
        templateId: templateId,
        categoryId: categoryId,
        categoryName: categoryName,
        createdAt: result.generatedMaps[0]['createdAt'],
      };
    } catch (error) {
      throw new HttpException(
        CustomHttpException['DB_SERVER_ERROR'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 모든 템플릿 카테고리 리스트 조회
  async findAllTemplates(templateIds: Array<number>): Promise<Array<TemplateCategoryDto>> {
    try {
      const templateCategories = await this.find({
        where: { templateId: In(templateIds) },
        relations: ['category'],
        order: {
          createdAt: 'ASC',
        },
      });

      const result: Array<TemplateCategoryDto> = await templateCategories.map((item) => {
        return {
          id: item.id,
          templateId: item.templateId,
          categoryId: item.categoryId,
          categoryName: item.category.name,
          createdAt: item.createdAt,
        };
      });

      return result;
    } catch (error) {
      throw new HttpException(
        CustomHttpException['DB_SERVER_ERROR'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 템플릿 카테고리 개수 가져오기
  async countTemplatCategories(templateCategoryIds: Array<number>): Promise<number> {
    try {
      const templateCategories: Array<TemplateCategoryEntity> = await this.find({
        where: { id: In(templateCategoryIds) },
      });
      return templateCategories.length;
    } catch (error) {
      throw new HttpException(
        CustomHttpException['DB_SERVER_ERROR'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 템플릿에서 카테고리 리스트 제거
  async removeCategoriesFromTemplate(templateCategoryIds: Array<number>): Promise<void> {
    try {
      await this.delete({
        id: In(templateCategoryIds),
      });
    } catch (error) {
      throw new HttpException(
        CustomHttpException['DB_SERVER_ERROR'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 템플릿의 카테고리 리스트 가져오기
  async getCategoriesFromTemplate(id: number): Promise<Array<TemplateCategoryEntity>> {
    try {
      const categories: Array<TemplateCategoryEntity> = await this.find({
        where: { templateId: id },
        relations: ['category'],
        order: {
          createdAt: 'ASC',
        },
      });
      return categories;
    } catch (error) {
      throw new HttpException(
        CustomHttpException['DB_SERVER_ERROR'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
