import { Publisher, OrderCreatedEvent, Subjects } from "@motonet/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
}