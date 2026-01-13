import { Schema, model, type InferSchemaType } from 'mongoose';
import { cleanResponse } from '../db/mongoose.plugins.js';

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email is not valid']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
      minlength: [8, 'Password must be at least 8 characters long']
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

userSchema.plugin(cleanResponse);

export type UserDoc = InferSchemaType<typeof userSchema>;
const User = model<UserDoc>('User', userSchema);
export default User;
