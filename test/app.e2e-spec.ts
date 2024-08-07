import * as request from 'supertest';
import mongoose from 'mongoose';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_CONNECT);

    await mongoose.connection.db.dropDatabase();
  });

  afterAll(() => {
    mongoose.disconnect();
  });

  const user = {
    name: 'hao21',
    email: 'haolk03@gmail.com',
    password: '123456',
  };

  let jwtToken: string = '';

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('Auth', () => {
    it('(POST) - Register a new user', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(user)
        .expect(201)
        .then((res) => {
          expect(res.body).toBeDefined();
        });
    });

    it('(POST) - Login user', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: user.email, password: user.password })
        .expect(201)
        .then((res) => {
          expect(res.body.token).toBeDefined();
          jwtToken = res.body.token;
        });
    });

    it('(GET) - Profile user', async () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', 'Bearer ' + jwtToken)
        .expect(200)
        .then((res) => expect(res.body).toBeDefined());
    });
  });
});
