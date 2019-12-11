import request from 'supertest';
import bcrypt from 'bcryptjs';

import app from '../../src/app';

import truncate from '../util/truncate';

import factory from '../factories';

describe('User', () => {
  let requestMock = {};
  beforeEach(async () => {
    await truncate();
    requestMock = await factory.attrs('User');
  });

  it('should encrypt user password when new user created', async () => {
    const user = await factory.create('User', {
      password: '123456',
    });

    const compareHash = await bcrypt.compare('123456', user.password_hash);
    expect(compareHash).toBe(true);
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
