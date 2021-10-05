import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import PartCreatedListener from './events/part-created-listener';

const stan = nats.connect('parts', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to nats');

  stan.on('close', () => {
    console.log('Nats connection lost');
    process.exit();
  });

  new PartCreatedListener(stan).listen()
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
