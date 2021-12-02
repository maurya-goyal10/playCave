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
      unique: [
        true,
        'Cant have the same user making same game favourite multple times',
      ],
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
