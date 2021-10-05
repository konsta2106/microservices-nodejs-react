import nats from 'node-nats-streaming';
import { PartCreatedPublisher } from './events/part-created-publisher';

const stan = nats.connect('parts', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  const publisher = new PartCreatedPublisher(stan)
  await publisher.publish({
    id: "123",
    title: "test",
    price: 20,
    description: "test descpr"
  })

  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'wheel',
  //   price: 20
  // })

  // stan.publish('part:created', data, () => {
  //   console.log('Event published')
  // })
})
