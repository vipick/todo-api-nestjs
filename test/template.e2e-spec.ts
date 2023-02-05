import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';

let accessToken = null;
let name = null;
let templateId;

describe('템플릿 (e2e)', () => {
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

  describe('템플릿 API 테스트', () => {
    describe('템플릿 추가', () => {
      it('템플릿 추가 성공 201 /templates (POST)', async () => {
        name = 'test' + String(Math.floor(Math.random() * 10000000));
        const res = await request(app.getHttpServer())
          .post('/templates')
          .send({
            name: name,
          })
          .set('authorization', 'bearer ' + accessToken);
        templateId = res.body.data.id;
        expect(res.statusCode).toBe(201);
        expect(res.body.data).toHaveProperty('id');
        return;
      });

      it('템플릿 추가 실패 400 /templates (POST)', async () => {
        const name = 'a';
        const res = await request(app.getHttpServer())
          .post('/templates')
          .send({
            name: name,
          })
          .set('authorization', 'bearer ' + accessToken);
        expect(res.statusCode).toBe(400);
        return;
      });

      it('템플릿 추가 실패 401 /templates (POST)', async () => {
        const name = 'test' + String(Math.floor(Math.random() * 10000000));
        const res = await request(app.getHttpServer())
          .post('/templates')
          .send({
            name: name,
          })
          .set('authorization', 'bearer ' + '1234');
        expect(res.statusCode).toBe(401);
        return;
      });

      it('템플릿 추가 실패 409 /templates (POST)', async () => {
        const res = await request(app.getHttpServer())
          .post('/templates')
          .send({
            name: name,
          })
          .set('authorization', 'bearer ' + accessToken);
        expect(res.statusCode).toBe(409);
        expect(res.body.code).toBe('CONFLICT_TEMPLATE');
        return;
      });
    });

    describe('템플릿 리스트', () => {
      it('템플릿 리스트 성공 200 /templates (GET)', async () => {
        const res = await request(app.getHttpServer())
          .get('/templates')
          .set('authorization', 'bearer ' + accessToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty('templates');
        return;
      });

      it('템플릿 리스트 실패 401 /templates (GET)', async () => {
        const res = await request(app.getHttpServer())
          .get('/templates')
          .set('authorization', 'bearer ' + '1234');
        expect(res.statusCode).toBe(401);
        return;
      });
    });

    describe('템플릿 수정', () => {
      it('템플릿 수정 성공 200 /templates/:id (PATCH)', async () => {
        name = 'test' + String(Math.floor(Math.random() * 10000000));
        const res = await request(app.getHttpServer())
          .patch(`/templates/${templateId}`)
          .send({
            name: name,
          })
          .set('authorization', 'bearer ' + accessToken);

        expect(res.statusCode).toBe(200);
        return;
      });

      it('템플릿 수정 실패 400 /templates/:id (PATCH)', async () => {
        const name = 'a';
        const res = await request(app.getHttpServer())
          .patch(`/templates/${templateId}`)
          .send({
            name: name,
          })
          .set('authorization', 'bearer ' + accessToken);
        expect(res.statusCode).toBe(400);
        return;
      });

      it('템플릿 수정 실패 401 /templates/:id (PATCH)', async () => {
        const name = 'test' + String(Math.floor(Math.random() * 10000000));
        const res = await request(app.getHttpServer())
          .patch(`/templates/${templateId}`)
          .send({
            name: name,
          })
          .set('authorization', 'bearer ' + '1234');
        expect(res.statusCode).toBe(401);
        return;
      });

      it('템플릿 수정 실패 403 /templates/:id (PATCH)', async () => {
        const name = 'test' + String(Math.floor(Math.random() * 10000000));
        const res = await request(app.getHttpServer())
          .patch(`/templates/10000000`)
          .send({
            name: name,
          })
          .set('authorization', 'bearer ' + accessToken);
        expect(res.statusCode).toBe(403);
        expect(res.body.code).toBe('FORBIDDEN_TEMPLATE');
        return;
      });

      it('템플릿 수정 실패 409 /templates/:id (PATCH)', async () => {
        const res = await request(app.getHttpServer())
          .patch(`/templates/${templateId}`)
          .send({
            name: name,
          })
          .set('authorization', 'bearer ' + accessToken);
        expect(res.statusCode).toBe(409);
        expect(res.body.code).toBe('CONFLICT_TEMPLATE');
        return;
      });
    });

    describe('템플릿 삭제', () => {
      it('템플릿 삭제 성공 200 /templates/:id (DELETE)', async () => {
        const res = await request(app.getHttpServer())
          .delete(`/templates/${templateId}`)
          .set('authorization', 'bearer ' + accessToken);

        expect(res.statusCode).toBe(200);
        return;
      });

      it('템플릿 삭제 실패 401 /templates/:id (DELETE)', async () => {
        const res = await request(app.getHttpServer())
          .delete(`/templates/${templateId}`)
          .set('authorization', 'bearer ' + '1234');
        expect(res.statusCode).toBe(401);
        return;
      });

      it('템플릿 삭제 실패 403 /templates/:id (DELETE)', async () => {
        const res = await request(app.getHttpServer())
          .delete(`/templates/${templateId}`)
          .set('authorization', 'bearer ' + accessToken);
        expect(res.statusCode).toBe(403);
        expect(res.body.code).toBe('FORBIDDEN_TEMPLATE');
        return;
      });
    });
  });
});
