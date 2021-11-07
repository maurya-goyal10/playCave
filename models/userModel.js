const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A name must be provided'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email must be provided'],
    lowercase: true,
    validate: [validator.isEmail, 'Provide a valid Email ID'],
  },
  photo: { type: String, default: 'default.jpg' },
  password: {
    type: String,
    required: [true, 'Password must be provided'],
    minlength: [8, 'Must be greater tha 8 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Password must be confirmed'],
    validate: {
      // works only on CREATE and SAVE
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords should match',
    },
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'guide', 'lead-guide'],
    default: 'user',
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpiry: Date,
});

userSchema.pre('save', async function (next) {
  //only run if modified
  if (!this.isModified('password')) return next();
  //hash the password
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

//implicit declarartion of a method
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const passwordTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    // console.log(passwordTimestamp, JWTTimestamp);
    return passwordTimestamp > JWTTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  //encrypt the resetToken but lightly only
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  //   console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpiry = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
