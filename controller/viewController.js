exports.getLoginForm = (req, res, next) => {
  res.status(200).render('login', {
    title: 'LogIn',
  });
};
