import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler } from '@motonet/common';
import { NotFoundError, currentUser } from '@motonet/common';
import cookieSession from 'cookie-session';
import { newPart } from './routes/newPart';
import { getPartById } from './routes/partById';
import { getallParts } from './routes/allParts';
import { updatePart } from './routes/updatePart';

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
app.use(currentUser)

//Routes
app.use(newPart)
app.use(getPartById)
app.use(getallParts)
app.use(updatePart)

//Error handler
app.all('*', async (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };