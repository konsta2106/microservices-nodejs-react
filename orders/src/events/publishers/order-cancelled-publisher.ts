import { Publisher, Subjects, OrderCancelledEvent } from "@motonet/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}
