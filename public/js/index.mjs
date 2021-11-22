/* eslint-disable */
import { signup, login, logout, updateSetting } from './login.mjs';
import { forgot, reset } from './forgot.mjs';

// DOM Elements
const signupForm = document.querySelector('.form--signup');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const forgotBtn = document.querySelector('.form--forgot');
const resetBtn = document.querySelector('.form--reset');
const searchBtn = document.getElementById('search-form');
const updateForm = document.querySelector('.user-data');
const updatePassword = document.querySelector('.pswd-data');

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

if (searchBtn) {
  searchBtn.addEventListener('submit', (e) => {
    const search = document.getElementById('search').value || '';
    if (search) {
      e.preventDefault();
      location.assign(`/?search=${search}`);
    }
  });
}

if (updateForm) {
  console.log('hi');
  updateForm.addEventListener('submit', (e) => {
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    e.preventDefault();
    updateSetting(form, 'data');
    window.setTimeout(() => {
      location.reload();
    }, 5000);
  });
}
if (updatePassword)
  updatePassword.addEventListener('submit', async (e) => {
    document.querySelector('.btn--password-update').textContent =
      'Updating... ';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    e.preventDefault();
    await updateSetting(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );
    document.querySelector('.btn--password-update').textContent =
      'SAVE PASSWORD';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
