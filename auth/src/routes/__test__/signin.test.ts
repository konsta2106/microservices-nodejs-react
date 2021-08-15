import request from 'supertest';
import { app } from '../../app';

it('fails when email does not exist', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});

it('fails when wrong password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
  
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'passwor',
    })
    .expect(400);
});

it('f200 when email and password matches', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
  
  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
});