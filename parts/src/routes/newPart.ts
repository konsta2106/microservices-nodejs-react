import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  currentUser,
  requireAuth,
  validateRequest,
  BadRequestError,
} from '@motonet/common';
import { Part } from '../models/part';

const router = express.Router();

router.post(
  '/api/parts',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
    body('description').not().isEmpty().withMessage('Description must be set'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price, description } = req.body;
    const createdBy = req.currentUser!.id
    const existingPart = await Part.findOne({ title });
    if (existingPart) {
      throw new BadRequestError('Title in use');
    }
    if (!existingPart) {
      const part = Part.build({ title, price, description, createdBy });
      await part.save();
      res.status(201).send(part);
    }
  }
);

export { router as newPart };
