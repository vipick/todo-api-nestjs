import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';

let accessToken = null;
let categoryId;
let todoId;

describe('Todo (e2e)', () => {
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
    const name = 'test' + String(Math.floor(Math.random() * 10000000));
    const category = await request(app.getHttpServer())
      .post('/categories')
      .send({
        name: name,
      })
      .set('authorization', 'bearer ' + accessToken);
    categoryId = category.body.data.id;
  });

  describe('ToDo API 테스트', () => {
    describe('ToDo 추가', () => {
      it('ToDo 추가 성공 201 /todos (POST)', async () => {
        const res = await request(app.getHttpServer())
          .post('/todos')
          .send({
            categoryId: categoryId,
            status: 'TODO',
            memo: 'aaaa',
            today: '2023-01-26',
          })
          .set('authorization', 'bearer ' + accessToken);
        todoId = res.body.data.id;
        expect(res.statusCode).toBe(201);
        expect(res.body.data).toHaveProperty('id');
        return;
      });

      it('ToDo 추가 실패 400 /todos (POST)', async () => {
        const res = await request(app.getHttpServer())
          .post('/todos')
          .send({
            categoryId: categoryId,
            status: 'TODO1',
            memo: 'aaaa',
            today: '2023-01-26',
          })
          .set('authorization', 'bearer ' + accessToken);
        expect(res.statusCode).toBe(400);
        return;
      });

      it('ToDo 추가 실패 401 /todos (POST)', async () => {
        const res = await request(app.getHttpServer())
          .post('/todos')
          .send({
            categoryId: categoryId,
            status: 'TODO',
            memo: 'aaaa',
            today: '2023-01-26',
          })
          .set('authorization', 'bearer ' + '1234');
        expect(res.statusCode).toBe(401);
        return;
      });

      it('ToDo 추가 실패 403 /todos (POST)', async () => {
        const res = await request(app.getHttpServer())
          .post('/todos')
          .send({
            categoryId: '1000000',
            status: 'TODO',
            memo: 'aaaa',
            today: '2023-01-26',
          })
          .set('authorization', 'bearer ' + accessToken);
        expect(res.statusCode).toBe(403);
        expect(res.body.code).toBe('FORBIDDEN_CATEGORY');
        return;
      });
    });

    describe('ToDo 리스트', () => {
      it('ToDo 리스트 성공 200 /todos (GET)', async () => {
        const res = await request(app.getHttpServer())
          .get('/todos?today=2023-01-11')
          .set('authorization', 'bearer ' + accessToken);
        expect(res.statusCode).toBe(200);
        expect(res.body.data).toHaveProperty('todos');
        return;
      });

      it('ToDo 리스트 실패 401 /todos (GET)', async () => {
        const res = await request(app.getHttpServer())
          .get('/todos?today=2023-01-11')
          .set('authorization', 'bearer ' + '1234');
        expect(res.statusCode).toBe(401);
        return;
      });
    });

    describe('ToDo 수정', () => {
      it('ToDo 수정 성공 200 /todos/:id (PATCH)', async () => {
        const res = await request(app.getHttpServer())
          .patch(`/todos/${todoId}`)
          .send({
            categoryId: categoryId,
            status: 'DONE',
            memo: 'aaaa',
            today: '2023-01-26',
          })
          .set('authorization', 'bearer ' + accessToken);

        expect(res.statusCode).toBe(200);
        return;
      });

      it('ToDo 수정 실패 400 /todos/:id (PATCH)', async () => {
        const res = await request(app.getHttpServer())
          .patch(`/todos/${todoId}`)
          .send({
            categoryId: categoryId,
            status: 'DONE2',
            memo: 'aaaa',
            today: '2023-01-26',
          })
          .set('authorization', 'bearer ' + accessToken);
        expect(res.statusCode).toBe(400);
        return;
      });

      it('ToDo 수정 실패 401 /todos/:id (PATCH)', async () => {
        const res = await request(app.getHttpServer())
          .patch(`/todos/${todoId}`)
          .send({
            categoryId: categoryId,
            status: 'DONE',
            memo: 'aaaa',
            today: '2023-01-26',
          })
          .set('authorization', 'bearer ' + '1234');
        expect(res.statusCode).toBe(401);
        return;
      });

      it('ToDo 수정 실패 403 /todos/:id (PATCH)', async () => {
        const res = await request(app.getHttpServer())
          .patch(`/todos/10000000`)
          .send({
            categoryId: categoryId,
            status: 'DONE',
            memo: 'aaaa',
            today: '2023-01-26',
          })
          .set('authorization', 'bearer ' + accessToken);
        expect(res.statusCode).toBe(403);
        expect(res.body.code).toBe('FORBIDDEN_TODO');
        return;
      });

      it('ToDo 수정 실패 403 /todos/:id (PATCH)', async () => {
        const res = await request(app.getHttpServer())
          .patch(`/todos/${todoId}`)
          .send({
            categoryId: '100000000',
            status: 'DONE',
            memo: 'aaaa',
            today: '2023-01-26',
          })
          .set('authorization', 'bearer ' + accessToken);
        expect(res.statusCode).toBe(403);
        expect(res.body.code).toBe('FORBIDDEN_CATEGORY');
        return;
      });
    });

    describe('ToDo 삭제', () => {
      it('ToDo 삭제 성공 200 /todos/:id (DELETE)', async () => {
        const res = await request(app.getHttpServer())
          .delete(`/todos/${todoId}`)
          .set('authorization', 'bearer ' + accessToken);

        expect(res.statusCode).toBe(200);
        return;
      });

      it('ToDo 삭제 실패 401 /todos/:id (DELETE)', async () => {
        const res = await request(app.getHttpServer())
          .delete(`/todos/${todoId}`)
          .set('authorization', 'bearer ' + '1234');
        expect(res.statusCode).toBe(401);
        return;
      });

      it('ToDo 삭제 실패 403 /todos/:id (DELETE)', async () => {
        const res = await request(app.getHttpServer())
          .delete(`/todos/${todoId}`)
          .set('authorization', 'bearer ' + accessToken);
        expect(res.statusCode).toBe(403);
        expect(res.body.code).toBe('FORBIDDEN_TODO');
        return;
      });
    });
  });
});
