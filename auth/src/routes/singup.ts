import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError } from '@motonet/common';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';
import { validateRequest } from '@motonet/common';

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
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    if (!existingUser) {
      const user = User.build({ email, password });
      await user.save();
      // console.log('User created. Update1');

      // Generate JWT
      const userJwt = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        // ! in the end means that we have already a check in index.ts if JWT_KEY is defined
        process.env.JWT_KEY!
      );

      // Store JWT on the session object. In typescript we can not store it as req.session.jwt = userJwt
      // So we reassign entire object req.session
      // Cookie will be sent only with https
      req.session = {
        jwt: userJwt
      }

      res.status(201).send(user);
    }
  }
);

export { router as signUpRouter };
