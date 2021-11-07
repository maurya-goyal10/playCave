const express = require('express');
const userController = require('../controller/userController');
const authController = require('../controller/authController');

const route = express.Router();
route.post('/signup', authController.signup);
route.post('/login', authController.login);
route.get('/logout', authController.logout);
route.post('/forgotPassword', authController.forgotPassword);
route.patch('/resetPassword/:token', authController.resetPassword);
route.patch(
  '/updateMyPassword',
  authController.protected,
  authController.updatePassword
);
//apply protected to all routes after that ensures that we are logged in!!
route.use(authController.protected);
route.patch(
  '/updateMe',
  userController.updateUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
route.delete('/deleteMe', userController.deleteMe);
route.get('/getMe', userController.getMe, userController.getUser);
//all the routes after this can be executed only by the admin
route.use(authController.restrictedTo('admin'));
route.route('/').get(userController.getAllUsers).post(userController.addUsers);
route
  .route('/:id')
  .get(userController.getUser)
  //don't update password using this update
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = route;
