import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { Order, OrderStatus } from '../../models/order'
import { Part } from '../../models/part'
import { natsWrapper } from '../../nats-wrapper'

it('returns an error if the ticket does not exist', async () => {
  const partId = mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ partId })
    .expect(404)
})

it('returns an error if the tricket is reserved', async () => {
  const part = Part.build({
    title: 'Test',
    price: 20
  })
  await part.save()

  const order = Order.build({
    part,
    userId: '1234',
    status: OrderStatus.Created,
    expiresAt: new Date()
  })
  await order.save();

  await request(app)
  .post('/api/orders')
  .set('Cookie', global.signin())
  .send({ partId: part.id })
  .expect(400)
})

it('reserves a ticket', async () => {
  const part = Part.build({
    title: 'Test',
    price: 20
  })
  await part.save()

  await request(app)
  .post('/api/orders')
  .set('Cookie', global.signin())
  .send({ partId: part.id })
  .expect(201)
  
})

it('emits an order created event', async () => {
  const part = Part.build({
    title: 'Test',
    price: 20
  })
  await part.save()

  await request(app)
  .post('/api/orders')
  .set('Cookie', global.signin())
  .send({ partId: part.id })
  .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled();
})