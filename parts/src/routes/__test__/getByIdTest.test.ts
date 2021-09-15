import request from 'supertest';
import { app } from '../../app';

it('returns 404 if part not found', async () => {
  await request(app)
    .get('/api/parts/6140cae4ff9f26001b05ecc2')
    .send()
    .expect(404);
});

it('returns a ticket if ticket is found', async () => {
  const response = await request(app)
    .post('/api/parts')
    .set('Cookie', global.signin())
    .send({
      title: 'test',
      price: 20,
      description: 'test desctiption',
    })
    .expect(201);

  const part = await request(app)
    .get(`/api/parts/${response.body.id}`)
    .send()
    .expect(200);
});

export { app };
