import request from 'supertest';
import app from '../../src/app';
import truncate from '../util/truncate';

const requestMock = {
  name: 'Everton Miranda',
  email: 'everton.mirandav@gmail.com',
  password_hash: '123456',
};

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to register', async () => {
    const response = await request(app)
      .post('/users')
      .send(requestMock);

    expect(response.body).toHaveProperty('id');
  });

  it('should not be able with duplicated email', async () => {
    await request(app)
      .post('/users')
      .send(requestMock);

    const response = await request(app)
      .post('/users')
      .send(requestMock);

    expect(response.status).toBe(400);
  });
});
