import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';

let accessToken = null;
let name = null;
let categoryId;

describe('카테고리 (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    const res = await request(app.getHttpServer()).post('/users/signin').send({
      email: 'test@test.com',
      password: '1234',
    });
    accessToken = res.body.data.accessToken;
  });

  describe('카테고리 API 테스트', () => {
    describe('카테고리 추가', () => {
      it('카테고리 추가 성공 201 /categories (POST)', async () => {
        name = 'test' + String(Math.floor(Math.random() * 10000000));
        const res = await request(app.getHttpServer())
          .post('/categories')
          .send({
            name: name,
          })
          .set('authorization', 'bearer ' + accessToken);
        categoryId = res.body.data.id;
        expect(res.statusCode).toBe(201);
        expect(res.body.data).toHaveProperty('id');
        return;
      });

      it('카테고리 추가 실패 400 /categories (POST)', async () => {
        const name = 'a';
        const res = await request(app.getHttpServer())
          .post('/categories')
          .send({
            name: name,
          })
          .set('authorization', 'bearer ' + accessToken);
        expect(res.statusCode).toBe(400);
        return;
      });

      it('카테고리 추가 실패 401 /categories (POST)', async () => {
        const name = 'test' + String(Math.floor(Math.random() * 10000000));
        const res = await request(app.getHttpServer())
          .post('/categories')
          .send({
            name: name,
          })
          .set('authorization', 'bearer ' + '1234');
        expect(res.statusCode).toBe(401);
        return;
      });

      it('카테고리 추가 실패 409 /categories (POST)', async () => {
        const res = await request(app.getHttpServer())
          .post('/categories')
          .send({
            name: name,
          })
          .set('authorization', 'bearer ' + accessToken);
        expect(res.statusCode).toBe(409);
        expect(res.body.code).toBe('CONFLICT_CATEGORY');
        return;
      });
    });

    describe('카테고리 리스트', () => {
      it('카테고리 리스트 성공 200 /categories (GET)', async () => {
        const res = await request(app.getHttpServer())
          .get('/categories')
          .set('authorization', 'bearer ' + accessToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty('categories');
        return;
      });

      it('카테고리 리스트 실패 401 /categories (GET)', async () => {
        const res = await request(app.getHttpServer())
          .get('/categories')
          .set('authorization', 'bearer ' + '1234');
        expect(res.statusCode).toBe(401);
        return;
      });
    });

    describe('카테고리 수정', () => {
      it('카테고리 수정 성공 200 /categories/:id (PATCH)', async () => {
        name = 'test' + String(Math.floor(Math.random() * 10000000));
        const res = await request(app.getHttpServer())
          .patch(`/categories/${categoryId}`)
          .send({
            name: name,
          })
          .set('authorization', 'bearer ' + accessToken);

        expect(res.statusCode).toBe(200);
        return;
      });

      it('카테고리 수정 실패 400 /categories/:id (PATCH)', async () => {
        const name = 'a';
        const res = await request(app.getHttpServer())
          .patch(`/categories/${categoryId}`)
          .send({
            name: name,
          })
          .set('authorization', 'bearer ' + accessToken);
        expect(res.statusCode).toBe(400);
        return;
      });

      it('카테고리 수정 실패 401 /categories/:id (PATCH)', async () => {
        const name = 'test' + String(Math.floor(Math.random() * 10000000));
        const res = await request(app.getHttpServer())
          .patch(`/categories/${categoryId}`)
          .send({
            name: name,
          })
          .set('authorization', 'bearer ' + '1234');
        expect(res.statusCode).toBe(401);
        return;
      });

      it('카테고리 수정 실패 403 /categories/:id (PATCH)', async () => {
        const name = 'test' + String(Math.floor(Math.random() * 10000000));
        const res = await request(app.getHttpServer())
          .patch(`/categories/10000000`)
          .send({
            name: name,
          })
          .set('authorization', 'bearer ' + accessToken);
        expect(res.statusCode).toBe(403);
        expect(res.body.code).toBe('FORBIDDEN_CATEGORY');
        return;
      });

      it('카테고리 수정 실패 409 /categories/:id (PATCH)', async () => {
        const res = await request(app.getHttpServer())
          .patch(`/categories/${categoryId}`)
          .send({
            name: name,
          })
          .set('authorization', 'bearer ' + accessToken);
        expect(res.statusCode).toBe(409);
        expect(res.body.code).toBe('CONFLICT_CATEGORY');
        return;
      });
    });

    describe('카테고리 삭제', () => {
      it('카테고리 삭제 성공 200 /categories/:id (DELETE)', async () => {
        const res = await request(app.getHttpServer())
          .delete(`/categories/${categoryId}`)
          .set('authorization', 'bearer ' + accessToken);

        expect(res.statusCode).toBe(200);
        return;
      });

      it('카테고리 삭제 실패 401 /categories/:id (DELETE)', async () => {
        const res = await request(app.getHttpServer())
          .delete(`/categories/${categoryId}`)
          .set('authorization', 'bearer ' + '1234');
        expect(res.statusCode).toBe(401);
        return;
      });

      it('카테고리 삭제 실패 403 /categories/:id (DELETE)', async () => {
        const res = await request(app.getHttpServer())
          .delete(`/categories/${categoryId}`)
          .set('authorization', 'bearer ' + accessToken);
        expect(res.statusCode).toBe(403);
        expect(res.body.code).toBe('FORBIDDEN_CATEGORY');
        return;
      });
    });
  });
});
