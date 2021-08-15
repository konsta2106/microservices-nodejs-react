import request from 'supertest';
import { app } from '../../app';

it('200 with information about the current user', async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .get('/api/users/current-user')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');

  // const response = await request(app)
  // .post('/api/users/signout')
  // .send({})
  // .expect(200);
});

it('400 not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/current-user')
    .send()
    .expect(200);

  console.log(response.body)
  expect(response.body.currentUser).toEqual(null)
});
