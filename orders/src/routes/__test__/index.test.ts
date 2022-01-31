import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Part } from '../../models/part';

const buildPart = async () => {
  const part = Part.build({
    title: 'Test',
    price: 20,
    id: mongoose.Types.ObjectId().toHexString()
  });
  await part.save();

  return part;
};

it('returns list of orders', async () => {
  // Crerate 3 part
  const partOne = await buildPart();
  const partTwo = await buildPart();
  const partThree = await buildPart();

  const userOne = global.signin()
  const userTwo = global.signin()
  // Create order for user 1
  await request(app)
  .post('/api/orders')
  .set('Cookie', userOne)
  .send({ partId: partOne.id })
  .expect(201)

  // Create order for user 2
  const { body: orderOne } = await request(app)
  .post('/api/orders')
  .set('Cookie', userTwo)
  .send({ partId: partTwo.id })
  .expect(201)

  const { body: orderTwo } = await request(app)
  .post('/api/orders')
  .set('Cookie', userTwo)
  .send({ partId: partThree.id })
  .expect(201)

  // Make request to get orders for user 2
  const response = await request(app)
  .get('/api/orders')
  .set('Cookie', userTwo)
  .expect(200)

  // Make sure only orders for user 2 returned
  expect(response.body.length).toEqual(2)
  expect(response.body[0].id).toEqual(orderOne.id)
  expect(response.body[1].id).toEqual(orderTwo.id)
});

it('returns an error if the part does not exist', async () => {});
