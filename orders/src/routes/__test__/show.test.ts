import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Part } from '../../models/part';

it('returns the order', async () => {
  const part = Part.build({
    title: 'Test',
    price: 20,
  });
  await part.save();

  const userOne = global.signin();
  const userTwo = global.signin();

  // Create order for user 1
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ partId: part.id })
    .expect(201);

  // Make request to get orders for user 2
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', userOne)
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it('returns 401 if fetching another user order', async () => {
  const part = Part.build({
    title: 'Test',
    price: 20,
  });
  await part.save();

  const userOne = global.signin();
  const userTwo = global.signin();

  // Create order for user 1
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ partId: part.id })
    .expect(201);

  // Make request to get orders for user 2
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', userTwo)
    .expect(401);
});

