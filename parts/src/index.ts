import mongoose from 'mongoose';
import { app } from './app';

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