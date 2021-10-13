import request from 'supertest';
import { app } from '../../app';
import { Request, Response } from 'express';
import { Part } from '../../models/part';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/parts for post request', async () => {
  const response = await request(app).post('/api/parts').send({});

  expect(response.status).not.toEqual(404);
});

it('can be only accessed if the user is signed in', async () => {
  const response = await request(app).post('/api/parts').send({});

  expect(response.status).toEqual(401);
});

it('returns status otrher than 401 if user is signed in', async () => {
  const response = await request(app)
    .post('/api/parts')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if invalid title is provided', async () => {
  const response = await request(app)
    .post('/api/parts')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10,
      description: '',
    });

  expect(response.status).toEqual(400);
});

it('return an error if invalid price is provided', async () => {
  const response = await request(app)
    .post('/api/parts')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10,
    });

  expect(response.status).toEqual(400);
});

it('creates a part with valid inputs', async () => {
  let parts = await Part.find({});
  expect(parts.length).toEqual(0);

  // add check to make sure ticket is saved

  const response = await request(app)
    .post('/api/parts')
    .set('Cookie', global.signin())
    .send({
      title: 'Wheels',
      price: 10,
      description: 'Wheel of the scania',
    });

  expect(response.status).toEqual(201);
  parts = await Part.find({});
  expect(parts.length).toEqual(1);
});

it('publishesh an event', async () => {
  let parts = await Part.find({});
  expect(parts.length).toEqual(0);

  // add check to make sure ticket is saved

  const response = await request(app)
    .post('/api/parts')
    .set('Cookie', global.signin())
    .send({
      title: 'Wheels',
      price: 10,
      description: 'Wheel of the scania',
    });

  expect(response.status).toEqual(201);

  console.log(natsWrapper);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
