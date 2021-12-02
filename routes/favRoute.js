const express = require('express');
const favController = require('../controller/favController');
const authController = require('../controller/authController');

const route = express.Router({ mergeParams: true });
//all routes after these can only be accessed if logged in
route.use(authController.protected);

route.route('/').get(favController.getAllFav);
route
  .route('/:gid')
  .get(favController.getFav)
  .post(
    authController.restrictedTo('user'),
    favController.fetchUserId,
    favController.createFav
  )
  .patch(authController.restrictedTo('user', 'admin'), favController.updateFav)
  .delete(
    authController.restrictedTo('user', 'admin'),
    favController.deleteFav
  );
module.exports = route;
