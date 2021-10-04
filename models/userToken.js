const { model, Schema } = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const { models } = require('../config/vars');

const schema = new Schema(
  {
    _id: { type: String, default: uuidv4 }, // Using UUID v4
    token: String,
    tokenType: String,
    user: {
      type: String,
      ref: models.User,
    },
    expiresIn: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = model(models.UserToken, schema);
