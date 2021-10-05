import { Subjects } from './subjects';

export interface PartCreated {
  subject: Subjects.PartCreated;
  data: {
    id: string;
    title: string;
    price: number;
    description: string;
    createdBy: string;
  };
}
