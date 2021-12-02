const Favourite = require('../models/favModel');
const catchAsync = require('../utilities/catchAsync');
const factory = require('./handlerFactory');

exports.fetchUserId = catchAsync(async (req, res, next) => {
  if (!req.body.user && req.user) req.body.user = req.user.id;
  if (!req.body.gid) req.body.gid = req.params.id;
  next();
});

exports.isFav = async (req, res, next) => {
  try {
    const fav = await Favourite.findOne({
      gid: req.body.gid,
      user: req.body.user,
    });
    // console.log(fav);
    if (!fav || fav === []) {
      return next();
    }
    res.locals.fav = fav;
    return next();
  } catch (err) {
    return next();
  }
};

exports.getAllFav = factory.getAll(Favourite);
exports.getFav = factory.getOne(Favourite);
exports.updateFav = factory.updateOne(Favourite);
exports.deleteFav = factory.deleteOne(Favourite);
exports.createFav = factory.createOne(Favourite);
