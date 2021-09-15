import express, { Request, Response } from 'express';
import { NotFoundError } from '@motonet/common';
import { Part } from '../models/part';

const router = express.Router();

router.get('/api/parts/:id', async (req: Request, res: Response, next) => {
  try {
    const { id } = req.params;
    const result = await Part.findById(id);
    if (!result) {
      throw new NotFoundError()
    }
    res.send(result);
  } catch (error) {
    next(error)
  }
});

export { router as getPartById };
