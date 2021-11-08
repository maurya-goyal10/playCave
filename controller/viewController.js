const axios = require('axios');

exports.getHome = async (req, res, next) => {
  const page = req.query.page ? req.query.page : 1;
  const size = req.query.size ? req.query.size : 20;
  const games = await axios({
    method: 'GET',
    url: `https://api.rawg.io/api/games?key=${process.env.RAWG_API_KEY}&page=${page}&page_size=${size}`,
  });
  res.status(200).render('base', {
    title: 'Home Page',
    games: games.data,
    page,
    size,
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
