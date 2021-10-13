import Listener from "./base-listener";
import { Message } from 'node-nats-streaming';
import { PartUpdated } from "./part-created-event";
import { Subjects } from "./subjects";

export default class PartCUpdatedListener extends Listener<PartUpdated> {
  readonly subject: Subjects.PartUpdated = Subjects.PartUpdated;
  queueGroupName = 'payments-service'

  onMessage(data: PartUpdated['data'], msg: Message) {
    console.log('Event data ', data)

    msg.ack()
  }
}