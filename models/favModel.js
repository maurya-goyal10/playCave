const mongoose = require('mongoose');

const favSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must be written by an existing User'],
    },
    gid: {
      type: Number,
      required: [true, 'Must be required'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Favourite = mongoose.model('Favourite', favSchema);
module.exports = Favourite;
