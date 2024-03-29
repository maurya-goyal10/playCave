const axios = require('axios');

exports.getHome = async (req, res, next) => {
  const page = req.query.page ? req.query.page : 1;
  const size = req.query.size ? req.query.size : 10;
  const search = req.query.search ? `&search=${req.query.search}` : '';
  const games = await axios({
    method: 'GET',
    url: `https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&page=${page}&page_size=${size}${search}&search_precise=true`,
  });
  res.status(200).render('home', {
    title: 'Home Page',
    games: games.data,
    page,
    size,
    search,
  });
};

exports.getLoginForm = (req, res, next) => {
  res.status(200).render('login', {
    title: 'LogIn',
  });
};
exports.getForgotPassword = (req, res, next) => {
  res.status(200).render('forgotPassword', {
    title: 'Forgot Password',
  });
};
exports.getResetPassword = (req, res, next) => {
  res.status(200).render('resetPassword', {
    title: 'Reset Password',
  });
};

exports.getDetails = async (req, res, next) => {
  const { id } = req.params;
  const game = await axios({
    method: 'GET',
    url: `https://api.rawg.io/api/games/${id}?key=${process.env.RAWG_API_KEY}`,
  });
  const pic = await axios({
    method: 'GET',
    url: `https://api.rawg.io/api/games/${id}/screenshots?key=${process.env.RAWG_API_KEY}`,
  });
  res.locals.styleNonce = 'fjslkdjflksjdlfkjsdlfjlakjdfl';
  res.status(200).render('details', {
    title: game.slug,
    game: game.data,
    pic: pic.data,
  });
};

exports.getMe = (req, res, next) => {
  res.status(200).render('getMe', {
    title: 'Update Me',
  });
};
