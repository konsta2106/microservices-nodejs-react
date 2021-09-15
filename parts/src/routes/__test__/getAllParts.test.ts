import request from 'supertest';
import { app } from '../../app';

it('can fetch a list of tickets', async () => {
  await request(app)
    .post('/api/parts')
    .set('Cookie', global.signin())
    .send({
      title: 'test',
      price: 20,
      description: 'test desctiption',
    })
    .expect(201);

    await request(app)
    .post('/api/parts')
    .set('Cookie', global.signin())
    .send({
      title: 'test2',
      price: 20,
      description: 'test2 desctiption',
    })
    .expect(201);

    await request(app)
    .get('/api/parts')
    .send()
    .expect(200);
});

export { app }