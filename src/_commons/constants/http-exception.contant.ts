export const CustomHttpException = {
  UNAUTHORIZED_ACCOUNT: {
    statusCode: 401,
    code: 'UNAUTHORIZED_ACCOUNT',
    message: '잘못된 아이디 또는 패스워드 입니다.',
  },
  FORBIDDEN_TODO: {
    statusCode: 403,
    code: 'FORBIDDEN_TODO',
    message: '해당 Todo의 접근 권한이 없습니다.',
  },
  FORBIDDEN_CATEGORY: {
    statusCode: 403,
    code: 'FORBIDDEN_CATEGORY',
    message: '해당 카테고리의 접근 권한이 없습니다.',
  },
  FORBIDDEN_TEMPLATE: {
    statusCode: 403,
    code: 'FORBIDDEN_TEMPLATE',
    message: '해당 템플릿의 접근 권한이 없습니다.',
  },
  FORBIDDEN_TEMPLATE_CATEGORY: {
    statusCode: 403,
    code: 'FORBIDDEN_TEMPLATE_CATEGORY',
    message: '해당 템플릿의 카테고리 접근 권한이 없습니다.',
  },
  CONFLICT_EMAIL: {
    statusCode: 409,
    code: 'CONFLICT_EMAIL',
    message: '이미 사용중인 이메일 입니다.',
  },
  CONFLICT_CATEGORY: {
    statusCode: 409,
    code: 'CONFLICT_CATEGORY',
    message: '이미 사용중인 카테고리 입니다.',
  },
  CONFLICT_TEMPLATE: {
    statusCode: 409,
    code: 'CONFLICT_TEMPLATE',
    message: '이미 사용중인 템플릿 입니다.',
  },
  DB_SERVER_ERROR: {
    statusCode: 500,
    code: 'DB_SERVER_ERROR',
    message: 'DB 서버 에러',
  },
};
