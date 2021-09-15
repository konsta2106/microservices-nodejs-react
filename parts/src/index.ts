import mongoose from 'mongoose';
import { app } from './app';

// Start server
const startServer = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY variable not defined')
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined')
  }
  try {
    // Connect to Database in kubernetes cluster
    await mongoose.connect(process.env.MONGO_URI, {
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