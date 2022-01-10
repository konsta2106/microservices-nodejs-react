import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

// Interface describing properties for the new user
interface PartAttributes {
  title: string;
  price: number;
}

// Interface that describes that a user document has
export interface PartDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

// Interface that describes properties that a user model has
interface PartModel extends mongoose.Model<PartDoc> {
  build(attributes: PartAttributes): PartDoc;
}

const partSchema = new mongoose.Schema<PartDoc>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

partSchema.statics.build = (attributes: PartAttributes) => {
  return new Part(attributes);
};
partSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    part: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Part = mongoose.model<PartDoc, PartModel>('Part', partSchema);

export { Part };
