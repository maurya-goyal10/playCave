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
