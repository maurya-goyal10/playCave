/* eslint-disable */
import { signup, login, logout } from './login.mjs';
import { forgot, reset } from './forgot.mjs';

// DOM Elements
const signupForm = document.querySelector('.form--signup');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const forgotBtn = document.querySelector('.form--forgot');
const resetBtn = document.querySelector('.form--reset');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    e.preventDefault();
    login(email, password);
  });
  signupForm.addEventListener('submit', (e) => {
    const name = document.getElementById('sname').value;
    const email = document.getElementById('semail').value;
    const password = document.getElementById('spassword').value;
    const passwordConfirm = document.getElementById('spasswordconfirm').value;
    e.preventDefault();
    signup(name, email, password, passwordConfirm);
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}

if (forgotBtn) {
  forgotBtn.addEventListener('submit', (e) => {
    const email = document.getElementById('email').value;
    e.preventDefault();
    forgot(email);
  });
}

if (resetBtn) {
  resetBtn.addEventListener('submit', (e) => {
    const password = document.getElementById('pass').value;
    const passwordConfirm = document.getElementById('passConfirm').value;
    let token = window.location.href.split('/');
    token = token[token.length - 1];
    console.log(token);
    e.preventDefault();
    reset(token, password, passwordConfirm);
  });
}
