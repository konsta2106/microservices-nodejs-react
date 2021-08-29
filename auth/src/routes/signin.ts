import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '@motonet/common';
import { User } from '../models/user';
import { BadRequestError } from '@motonet/common';
import { Password } from '../services/password';
import jwt from 'jsonwebtoken';

const router = express.Router();

//Routes
router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('Provide a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid login information');
    }

    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordMatch) {
      throw new BadRequestError('Invalid login credentials');
    }

    if (passwordMatch) {
      // Generate JWT
      const userJwt = jwt.sign(
        {
          id: existingUser.id,
          email: existingUser.email,
        },
        // ! in the end means that we have already a check in index.ts if JWT_KEY is defined
        process.env.JWT_KEY!
      );

      // Store JWT on the session object. In typescript we can not store it as req.session.jwt = userJwt
      // So we reassign entire object req.session
      // Cookie will be sent only with https
      req.session = {
        jwt: userJwt,
      };

      res.status(200).send(existingUser);
    }
  }
);

export { router as signInRouter };
