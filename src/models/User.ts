import { Schema, model, type InferSchemaType } from 'mongoose';
import bcrypt from 'bcrypt';
import { cleanResponse } from '../db/mongoose.plugins.js';

const userSchema = new Schema(
  {
    firstName: { type: String, required: [true, 'First name is required'], trim: true },
    lastName: { type: String, required: [true, 'Last name is required'], trim: true },
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
      select: false, // schützt bei Queries (GET /users)
      minlength: [8, 'Password must be at least 8 characters long']
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// PW Hashing
userSchema.pre('save', async function () {
  // nur hashen wenn password neu/geändert ist
  if (!this.isModified('password')) return;

  const roundsRaw = process.env.SALT_ROUNDS;
  const rounds = roundsRaw ? Number(roundsRaw) : 12; // default SALT_ROUNDS

  if (!Number.isInteger(rounds) || rounds < 10 || rounds > 15) {
    throw new Error('Invalid SALT_ROUNDS', { cause: 500 });
  }

  this.password = await bcrypt.hash(this.password, rounds);
});

// clean Response: remove password
userSchema.plugin(cleanResponse, { remove: ['password'] });

export type UserDoc = InferSchemaType<typeof userSchema>;
const User = model<UserDoc>('User', userSchema);
export default User;
