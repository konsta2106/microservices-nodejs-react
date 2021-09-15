import mongoose from 'mongoose';

// Interface describing properties for the new user
interface PartAttributes {
  title: string;
  price: number;
  description: string;
  createdBy: string;
}

// Interface that describes properties that a user model has
interface PartModel extends mongoose.Model<PartDoc> {
  build(attributes: PartAttributes): PartDoc;
}

// Interface that describes that a user document has
interface PartDoc extends mongoose.Document {
  title: string;
  price: number;
  description: string;
  createdBy: string;
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
    },
    description: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true
    }
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
  return new Part(attributes)
}

const Part = mongoose.model<PartDoc, PartModel>('Part', partSchema)

export { Part }
