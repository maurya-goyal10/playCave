/* eslint-disable */
import { signup, login, logout } from './login.mjs';
import { forgot } from './forgot.mjs';

// DOM Elements
const signupForm = document.querySelector('.form--signup');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const forgotBtn = document.querySelector('.form--forgot');

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
