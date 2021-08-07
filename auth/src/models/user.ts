import mongoose from 'mongoose';
import { Password } from '../services/password';

// Interface describing properties for the new user
interface UserAttributes {
  email: string;
  password: string;
}

// Interface that describes properties that a user model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attributes: UserAttributes): UserDoc;
}

// Interface that describes that a user document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  // Modify response of the user entity
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v
        ret.id = ret._id
        delete ret._id
      },
    },
  }
);

// Mongoose middleware function to perform some action when saving document into db
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.hash(this.get('password'));
    this.set('password', hashed);
  }

  // Need to call done because callback based mongoose function
  done();
});

// Create method to the user schema model that checks required attributes with interface created above
userSchema.statics.build = (attributes: UserAttributes) => {
  return new User(attributes);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
