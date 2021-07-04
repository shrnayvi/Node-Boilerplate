import { model, Schema } from 'mongoose';

import { IUserDocument } from '../interfaces/entities/IUser';
import config from '../config';

const userSchema: Schema = new Schema(
  {
    email: String,
    username: String,
    firstName: String,
    lastName: String,
    password: String,
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: config.roles.user,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IUserDocument>(config.models.User, userSchema);
