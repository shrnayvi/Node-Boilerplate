import { model, Schema } from 'mongoose';

import { IUserTokenDocument } from '../interfaces/entities/IUserToken';
import config from '../config';

const userTokenSchema: Schema = new Schema(
  {
    token: String,
    tokenType: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: config.models.User,
    },
    expiresIn: Date,
  },
  {
    timestamps: true,
  }
);

export default model<IUserTokenDocument>(config.models.UserToken, userTokenSchema);
