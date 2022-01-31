import express, { Request, Response, NextFunction } from 'express';
import {
  NotFoundError,
  validateRequest,
  requireAuth,
  NotAuthorizedError,
  BadRequestError,
} from '@motonet/common';
import { Part } from '../models/part';
import { body } from 'express-validator';
import { PartUpdatedPublisher } from '../events/publishers/part-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/parts/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
    body('description').not().isEmpty().withMessage('Description must be set'),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await Part.findById(id);
      if (!result) {
        throw new NotFoundError();
      }
      if (result.createdBy !== req.currentUser!.id) {
        throw new NotAuthorizedError();
      }
      if(result.orderId) {
        throw new BadRequestError('Part is reserved')
      }
      result.set({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
      });
      await result.save();
      await new PartUpdatedPublisher(natsWrapper.client).publish({
        id: result.id,
        title: result.title,
        description: result.description,
        price: result.price,
        createdBy: result.createdBy,
        version: result.version
      })
      res.send(result);
    } catch (error) {
      next(error);
    }
  }
);

export { router as updatePart };
