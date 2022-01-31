import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Part } from '../../models/part';
import { natsWrapper } from '../../nats-wrapper'

it('cancels order', async () => {
  const part = Part.build({
    title: 'Test',
    price: 20,
    id: mongoose.Types.ObjectId().toHexString()
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

  // Cancel order
  const response = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', userOne)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emits an order cancel event', async () => {
  const part = Part.build({
    title: 'Test',
    price: 20,
    id: mongoose.Types.ObjectId().toHexString()
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

  // Cancel order
  const response = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', userOne)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)

  expect(natsWrapper.client.publish).toHaveBeenCalled();
})