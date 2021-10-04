const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const { models } = require('../config/vars');

const schema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 }, // Using UUID v4
    firstName: String,
    lastName: String,
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model(models.User, schema);

module.exports = User;
