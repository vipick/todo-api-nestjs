import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';

let accessToken = null;
let templateId;
let categoryId;
let templateCategoryId;

describe('템플릿 - 카테고리 (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    //로그인
    const res = await request(app.getHttpServer()).post('/users/signin').send({
      email: 'test@test.com',
      password: '1234',
    });
    accessToken = res.body.data.accessToken;

    //카테고리 추가
    const categoryName = 'test' + String(Math.floor(Math.random() * 10000000));
    const category = await request(app.getHttpServer())
      .post('/categories')
      .send({
        name: categoryName,
      })
      .set('authorization', 'bearer ' + accessToken);
    categoryId = category.body.data.id;

    //템플릿 추가
    const templateName = 'test' + String(Math.floor(Math.random() * 10000000));
    const template = await request(app.getHttpServer())
      .post('/templates')
      .send({
        name: templateName,
      })
      .set('authorization', 'bearer ' + accessToken);
    templateId = template.body.data.id;
  });

  describe('템플릿 API 테스트', () => {
    describe('템플릿에 카테고리 추가', () => {
      it('템플릿에 카테고리 추가 성공 201 /templates/:templateId/categories/:categoryId (POST)', async () => {
        const res = await request(app.getHttpServer())
          .post(`/templates/${templateId}/categories/${categoryId}`)
          .set('authorization', 'bearer ' + accessToken);

        templateCategoryId = res.body.data.templateCategory.id;
        expect(res.statusCode).toBe(201);
        expect(res.body.data).toHaveProperty('templateCategory');
        return;
      });

      it('템플릿에 카테고리 추가 실패 401 /templates/:templateId/categories/:categoryId (POST)', async () => {
        const res = await request(app.getHttpServer())
          .post(`/templates/${templateId}/categories/${categoryId}`)
          .set('authorization', 'bearer ' + '1234');
        expect(res.statusCode).toBe(401);
        return;
      });

      it('템플릿에 카테고리 추가 실패 403 /templates/:templateId/categories/:categoryId (POST)', async () => {
        const res = await request(app.getHttpServer())
          .post(`/templates/100000000/categories/${categoryId}`)
          .set('authorization', 'bearer ' + accessToken);
        expect(res.statusCode).toBe(403);
        expect(res.body.code).toBe('FORBIDDEN_TEMPLATE');
        return;
      });

      it('템플릿에 카테고리 추가 실패 403 /templates/:templateId/categories/:categoryId (POST)', async () => {
        const res = await request(app.getHttpServer())
          .post(`/templates/${templateId}/categories/100000000`)
          .set('authorization', 'bearer ' + accessToken);
        expect(res.statusCode).toBe(403);
        expect(res.body.code).toBe('FORBIDDEN_CATEGORY');
        return;
      });
    });

    describe('템플릿 별 카테고리 리스트', () => {
      it('템플릿 별 카테고리 리스트 성공 200 /templates/categories (GET)', async () => {
        const res = await request(app.getHttpServer())
          .get('/templates/categories')
          .set('authorization', 'bearer ' + accessToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty('templateCategories');
        return;
      });

      it('템플릿 별 카테고리 리스트 실패 401 /templates/categories (GET)', async () => {
        const res = await request(app.getHttpServer())
          .get('/templates')
          .set('authorization', 'bearer ' + '1234');
        expect(res.statusCode).toBe(401);
        return;
      });
    });

    describe('템플릿 복사', () => {
      it('템플릿 복사 성공 201 /templates/:templateId/todo-copy (POST)', async () => {
        const res = await request(app.getHttpServer())
          .post(`/templates/${templateId}/todo-copy`)
          .send({
            today: '2023-01-26',
          })
          .set('authorization', 'bearer ' + accessToken);
        expect(res.statusCode).toBe(201);
        return;
      });

      it('템플릿 복사 실패 401 /templates/:templateId/todo-copy (POST)', async () => {
        const res = await request(app.getHttpServer())
          .post(`/templates/${templateId}/todo-copy`)
          .send({
            today: '2023-01-26',
          })
          .set('authorization', 'bearer ' + '1234');
        expect(res.statusCode).toBe(401);
        return;
      });

      it('템플릿에 복사 실패 403 /templates/:templateId/todo-copy (POST)', async () => {
        const res = await request(app.getHttpServer())
          .post(`/templates/100000000/todo-copy`)
          .send({
            today: '2023-01-26',
          })
          .set('authorization', 'bearer ' + accessToken);
        expect(res.statusCode).toBe(403);
        expect(res.body.code).toBe('FORBIDDEN_TEMPLATE');
        return;
      });
    });

    describe('템플릿에서 카테고리 제거', () => {
      it('템플릿에서 카테고리 제거 실패 401 /templates/:id/categories (DELETE)', async () => {
        const res = await request(app.getHttpServer())
          .delete(`/templates/${templateId}/categories`)
          .send({
            templateCategoryIds: `[${templateCategoryId}]`,
          })
          .set('authorization', 'bearer ' + '1234');
        expect(res.statusCode).toBe(401);
        return;
      });

      it('템플릿에서 카테고리 제거 실패 403 /templates/:id/categories (DELETE)', async () => {
        const res = await request(app.getHttpServer())
          .delete(`/templates/100000000/categories`)
          .send({
            templateCategoryIds: `[${templateCategoryId}]`,
          })
          .set('authorization', 'bearer ' + accessToken);
        expect(res.statusCode).toBe(403);
        expect(res.body.code).toBe('FORBIDDEN_TEMPLATE');
        return;
      });

      it('템플릿에서 카테고리 제거 실패 403 /templates/:id/categories (DELETE)', async () => {
        const res = await request(app.getHttpServer())
          .delete(`/templates/${templateId}/categories`)
          .send({
            templateCategoryIds: '[100000, 20000]',
          })
          .set('authorization', 'bearer ' + accessToken);
        expect(res.statusCode).toBe(403);
        expect(res.body.code).toBe('FORBIDDEN_TEMPLATE_CATEGORY');
        return;
      });

      it('템플릿에서 카테고리 제거 성공 200 /templates/:id/categories (DELETE)', async () => {
        const res = await request(app.getHttpServer())
          .delete(`/templates/${templateId}/categories`)
          .send({
            templateCategoryIds: `[${templateCategoryId}]`,
          })
          .set('authorization', 'bearer ' + accessToken);

        expect(res.statusCode).toBe(200);
        return;
      });
    });
  });
});
