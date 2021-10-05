import Listener from "./base-listener";
import { Message } from 'node-nats-streaming';
import { PartCreated } from "./part-created-event";
import { Subjects } from "./subjects";

export default class PartCreatedListener extends Listener<PartCreated> {
  readonly subject: Subjects.PartCreated = Subjects.PartCreated;
  queueGroupName = 'payments-service'

  onMessage(data: PartCreated['data'], msg: Message) {
    console.log('Event data ', data)

    msg.ack()
  }
}