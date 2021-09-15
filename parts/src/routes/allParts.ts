import express, { Request, Response } from 'express';
import { NotFoundError } from '@motonet/common';
import { Part } from '../models/part';

const router = express.Router();

router.get('/api/parts', async (req: Request, res: Response, next) => {
  try {
    const result = await Part.find();
    if (!result) {
      throw new NotFoundError()
    }
    res.send(result);
  } catch (error) {
    next(error)
  }
});

export { router as getallParts };