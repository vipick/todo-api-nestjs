import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';
import { HttpExceptionFilter } from 'src/_commons/exceptions/http-exception.filter';
import { AppModule } from 'src/app.module';
declare const module: any;

//웹 페이지를 새로고침을 해도 Token 값 유지
const swaggerCustomOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  app.use(
    ['/docs'],
    expressBasicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_API_USER]: process.env.SWAGGER_API_PASSWORD,
      },
    }),
  );

  if (process.env.NODE_ENV !== 'prod') {
    const config = new DocumentBuilder()
      .setTitle('ToDo API')
      .setDescription('ToDo API 문서입니다.')
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'access-token',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, swaggerCustomOptions);
  }

  await app.listen(port);
  console.log(`listening on port ${port}`);
  console.log(process.env.NODE_ENV);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
