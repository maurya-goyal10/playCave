const express = require('express');
const viewController = require('../controller/viewController');
const authController = require('../controller/authController');
const favController = require('../controller/favController');

const route = express.Router();

// route.use();

route.get('/', authController.isLoggedIn, viewController.getHome);
route.get(
  '/game/:id',
  authController.isLoggedIn,
  favController.fetchUserId,
  favController.isFav,
  viewController.getDetails
);
route.get('/login', authController.isLoggedIn, viewController.getLoginForm);
route.get('/forgotPassword', viewController.getForgotPassword);
route.get('/resetPassword/:token', viewController.getResetPassword);
route.get('/me', authController.protected, viewController.getMe);

module.exports = route;
