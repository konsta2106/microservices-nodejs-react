import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';
import { BadRequestError } from '../errors/bad-request-error';
import { User } from '../models/user';

const router = express.Router();

//Routes
router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 symbols'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    const { email, password } = req.body;

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email in use');
      throw new BadRequestError('Email in use')
    }

    if (!existingUser) {
      const user = User.build({ email, password });
      await user.save();
      console.log('User created. Update1');
      res.status(201).send(user);
    }
  }
);

export { router as signUpRouter };
