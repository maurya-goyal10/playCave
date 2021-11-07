const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const Email = require('../utilities/email');

// eslint-disable-next-line arrow-body-style
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  //   const url = `${req.protocol}://${req.get('host')}/me`;
  //   await new Email(newUser, url).sendWelcome();
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //1) check if entered email ID and password
  if (!email || !password)
    return next(new AppError('Enter the email id or the password', 400));
  //2) check if user with email and password exist
  //have to differently for password as in the schma did select: false
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('Incorrect email or password'), 401);
  //3) Provide token
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

// shouldn't return error just run on render and files to check if logged in
exports.isLoggedIn = async (req, res, next) => {
  //1) Get the token and see if it exists
  try {
    if (req.cookies.jwt) {
      //2) Verify the token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );
      //3) check if user still exists
      const currUser = await User.findById(decoded.id);
      if (!currUser) {
        return next();
      }
      // 4) check if password was changed after generating the token
      if (currUser.changedPasswordAfter(decoded.iat)) return next();
      res.locals.user = currUser;
      return next();
    }
  } catch (err) {
    return next();
  }
  return next();
};

exports.protected = catchAsync(async (req, res, next) => {
  //1) Get the token and see if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token)
    return next(new AppError('Not logged in! Please login to access', 401));
  //2) Verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //3) check if user still exists
  const currUser = await User.findById(decoded.id);
  if (!currUser) {
    return next(
      new AppError('The user belonging to this token no longer exists!', 401)
    );
  }
  // 4) check if password was changed after generating the token
  if (currUser.changedPasswordAfter(decoded.iat))
    return next(
      new AppError('Generate new token as password was recently updated!', 401)
    );

  req.user = currUser;
  res.locals.user = currUser;
  next();
});

exports.restrictedTo =
  (...roles) =>
  //returns the middleware
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError(
          'You do not have the permission to perform this action!',
          403
        )
      );
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get User based on POSTed Email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new AppError('Could not find a user with given email ID', 404));
  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //   3) Send it to User's Email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  try {
    await new Email(user, resetURL).sendPasswordReset();
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!!',
    });
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
  } catch {
    user.passwordResetToken = undefined;
    user.passwordResetExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error in sending the mail try again ', 500)
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) get user based on token
  const resetToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: resetToken,
    passwordResetExpiry: { $gt: Date.now() },
  });
  //2) If the token has not expired and the user exists set the new password
  if (!user) return next(new AppError('Token is invalid or has expired!', 400));
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpiry = undefined;
  await user.save();

  //3) Update changedPasswordAt property for the user

  //4)Log the user in using JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1) Get the user
  const user = await User.findById(req.user.id).select('+password');
  //2) check the password
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password)))
    return next(new AppError('Incorrect Password!', 401));

  //3) If so update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //4) Login user,send JWT
  createSendToken(user, 200, res);
});
