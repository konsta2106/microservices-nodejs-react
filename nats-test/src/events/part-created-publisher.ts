import { Publisher } from "./base-publisher";
import { PartCreated } from "./part-created-event";
import { Subjects } from "./subjects";

export class PartCreatedPublisher extends Publisher<PartCreated> {
  subject: Subjects.PartCreated = Subjects.PartCreated
  

}