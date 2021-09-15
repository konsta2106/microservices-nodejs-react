import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import jwt from 'jsonwebtoken'

declare global {
  var signin: () => string[];
}

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfg';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  mongo.stop();
  mongoose.connection.close();
});

global.signin = () => {
  
  // Build a JWT payload { id, mail }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "koko@koko.fi"
  }
  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!)

  // Build session object { jwt: MY_JWT }
  const session = { jwt: token }

  // Turh that session into JSON
  const sessionJson = JSON.stringify(session)

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJson).toString('base64')

  // Return string that is cookie with the encoded data
  return [`express:sess=${base64}`]
}