import { Publisher, Subjects, PartUpdated } from "@motonet/common";

export class PartUpdatedPublisher extends Publisher<PartUpdated> {
  subject: Subjects.PartUpdated = Subjects.PartUpdated
}