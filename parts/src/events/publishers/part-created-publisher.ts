import { Publisher, Subjects, PartCreated } from "@motonet/common";

export class PartCreatedPublisher extends Publisher<PartCreated> {
  subject: Subjects.PartCreated = Subjects.PartCreated
}