import request from 'supertest';
import { app } from '../../app';

it('returns 404 if provided id not exist', async () => {
  await request(app)
    .put('/api/parts/6140cae4ff9f26001b05ecc2')
    .set('Cookie', global.signin())
    .send({
      title: 'aaaa',
      price: 10,
      description: 'gfdsa',
    })
    .expect(404);
});

it('401 if user not authenticated', async () => {
  await request(app)
    .put('/api/parts/6140cae4ff9f26001b05ecc2')
    .send({
      title: 'aaaa',
      price: 10,
      desctiption: 'gfdsa',
    })
    .expect(401);
});

it('401 if user dont own title', async () => {
  const response = await request(app)
    .post('/api/parts')
    .set('Cookie', global.signin())
    .send({
      title: 'test',
      price: 20,
      description: 'test desctiption',
    })
    .expect(201);

  await request(app)
    .put(`/api/parts/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'test',
      price: 20,
      description: 'test desctiption',
    })
    .expect(401);
});

it('400 invalid title or price or description', async () => {
  const cookie = global.signin()
  const response = await request(app)
  .post('/api/parts')
  .set('Cookie', cookie)
  .send({
    title: 'test',
    price: 20,
    description: 'test desctiption',
  })
  .expect(201);

  await request(app)
  .put(`/api/parts/${response.body.id}`)
  .set('Cookie', cookie)
  .send({
    title: "",
    price: "eee",
    description: 'test desctiption',
  })
  .expect(400);
});

it('200 updates ticket', async () => {
  const cookie = global.signin()
  const response = await request(app)
  .post('/api/parts')
  .set('Cookie', cookie)
  .send({
    title: 'test',
    price: 20,
    description: 'test desctiption',
  })
  .expect(201);

  await request(app)
  .put(`/api/parts/${response.body.id}`)
  .set('Cookie', cookie)
  .send({
    title: 'test2',
    price: 20,
    description: 'test desctiption',
  })
  .expect(200);

  const partResponse = await request(app)
  .get(`/api/parts/${response.body.id}`)
  .set('Cookie', cookie)
  .send()

  expect(partResponse.body.title).toEqual('test2')
});
