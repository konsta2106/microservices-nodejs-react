import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';
import { json } from 'body-parser';
import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/singup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';
import cookieSession from 'cookie-session';

// Express app
const app = express();
// Allow proxy, behind ingress nginx
app.set('trust proxy', true)
app.use(json());
app.use(cookieSession({
  // Disable coockie encryption, JWT is secure enough to be transferred withoud encryption
  signed: false,
  // Require https
  secure: true
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

// Start server
const startServer = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY variable not defined')
  }
  try {
    // Connect to Database in kubernetes cluster
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to Database')
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

startServer();