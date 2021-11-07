/* eslint-disable node/no-unsupported-features/es-syntax */
const AppError = require('../utilities/appError');

const handleCastErrorDB = (err) => {
  const mssg = `Invalid ${err.path}: ${err.value}`;
  return new AppError(mssg, 400);
};

const handleDuplicateErrorDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const mssg = `Duplicate Field Values ${value} .Please use another value`;
  return new AppError(mssg, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const mssg = `Invalid Input. ${errors.join('. ')}`;
  return new AppError(mssg, 400);
};

const handleJsonWebTokenError = () =>
  new AppError('Invalid Token Please login again!', 401);

const handleTokenExpiredError = () =>
  new AppError('The token provided has expired Please log in again!', 401);

const sendErrDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }
  return res.status(err.statusCode).render('error', {
    msg: err.message,
  });
};

const sendErrProd = (err, req, res) => {
  // A) API CALL NO NEED TO RENDER
  if (req.originalUrl.startsWith('/api')) {
    //Operational, Trusted Error : Send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    //Programming or other unknown error can't leak the message to the client
    // 1) Log the error
    console.error(err);
    // 2) Display an error message
    return res.status(500).json({
      status: 'error',
      message: 'Somethig went very wrong!',
    });
  }
  //Operational, Trusted Error : Send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      status: err.status,
      msg: err.message,
    });
  }
  return res.status(500).render('error', {
    status: 'error',
    msg: 'Somethig went very wrong!',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateErrorDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') error = handleJsonWebTokenError();
    if (err.name === 'TokenExpiredError') error = handleTokenExpiredError();

    sendErrProd(error, req, res);
  }
};
