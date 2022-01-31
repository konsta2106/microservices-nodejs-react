import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

// Interface describing properties for the new user
interface PartAttributes {
  title: string;
  price: number;
  id: string;
}

// Interface that describes that a user document has
export interface PartDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

// Interface that describes properties that a user model has
interface PartModel extends mongoose.Model<PartDoc> {
  build(attributes: PartAttributes): PartDoc;
  findByEvent(event: { id: string, version: number }): Promise<PartDoc | null>
}

const partSchema = new mongoose.Schema(
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
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

partSchema.set('versionKey', 'version');
partSchema.plugin(updateIfCurrentPlugin);

partSchema.statics.findByEvent = (event: { id: string, version: number }) => {
  return Part.findOne({
    _id: event.id,
    version: event.version - 1
  })
}

partSchema.statics.build = (attributes: PartAttributes) => {
  return new Part({
    _id: attributes.id,
    title: attributes.title,
    price: attributes.price,
  });
};

partSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    part: this.id,
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
