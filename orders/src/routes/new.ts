import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  currentUser,
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  OrderStatus,
} from '@motonet/common';
import { Part } from '../models/part';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  '/api/orders',
  requireAuth,
  [
    body('partId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('PartId must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { partId } = req.body;

    // Find the ticket the user is trying to order in DB
    const part = await Part.findById(partId);
    if (!part) {
      throw new NotFoundError();
    }

    // Make sure that ticket is not already reserved
    const isReserved = await part.isReserved()
    if(isReserved) { throw new BadRequestError('Ticket is already reserved'); }

    // Calculate an expiration date for the order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the DB
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      part: part
    })
    await order.save();

    // Publish an event that order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      part: {
        id: part.id,
        price: part.price
      }
    })

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
