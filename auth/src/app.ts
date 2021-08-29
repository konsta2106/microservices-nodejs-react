import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/singup';
import { errorHandler } from '@motonet/common';
import { NotFoundError } from '@motonet/common';
import cookieSession from 'cookie-session';

// Express app
const app = express();
// Allow proxy, behind ingress nginx
app.set('trust proxy', true)
app.use(json());
app.use(cookieSession({
  // Disable coockie encryption, JWT is secure enough to be transferred withoud encryption
  signed: false,
  // Require https. True when not in test environment. 
  secure: process.env.NODE_ENV !== 'test'
}))

//Routes
app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

//Error handler
app.all('*', async (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };