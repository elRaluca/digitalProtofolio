// test/works.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('WorksController (e2e)', () => {
  let app: INestApplication;
  let workId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const response = await request(app.getHttpServer()).post('/works').send({
      title: 'Initial Work',
      description: 'Initial Description',
      images: [],
      workLink: 'http://example.com',
      status: 'visible',
    });
    workId = response.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/works (GET) - ar trebui să returneze toate works', async () => {
    return request(app.getHttpServer())
      .get('/works')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
      });
  });

  it('/works/:id (GET) - ar trebui să returneze un work după ID', async () => {
    return request(app.getHttpServer())
      .get(`/works/${workId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', workId);
        expect(res.body).toHaveProperty('title', 'Initial Work');
      });
  });

  it('/works (POST) - ar trebui să creeze un work', async () => {
    const newWork = {
      title: 'New Work',
      description: 'New Description',
      images: [],
      workLink: 'http://example.com',
      status: 'visible',
    };

    return request(app.getHttpServer())
      .post('/works')
      .send(newWork)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('title', newWork.title);
        expect(res.body).toHaveProperty('description', newWork.description);
      });
  });

  it('/works/:id (PUT) - ar trebui să actualizeze un work', async () => {
    const updateData = {
      title: 'Updated Work',
      description: 'Updated Description',
    };

    return request(app.getHttpServer())
      .put(`/works/${workId}`)
      .send(updateData)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('title', updateData.title);
        expect(res.body).toHaveProperty('description', updateData.description);
      });
  });

  it('/works/:id (DELETE) - ar trebui să elimine un work', async () => {
    return request(app.getHttpServer())
      .delete(`/works/${workId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual({ deleted: true });
      });
  });
});
