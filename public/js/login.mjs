/* eslint-disable */
import { showAlert, hideAlert } from './alerts.mjs';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Logged In Successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1250);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Successfully created an Account!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1250);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    if (res.data.status === 'success') location.reload(true);
  } catch (err) {
    showAlert('error', 'Some error occured Try Logging In Again!');
  }
};

export const updateSetting = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    // console.log(res);
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} uploaded successfully`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const addFav = async () => {
  try {
    const queryString = window.location.pathname;
    const urlParams = queryString.split('/');
    const gameid = urlParams[2];
    console.log(gameid);

    const url = `../api/v1/fav/${gameid}`;
    const res = await axios({
      method: 'POST',
      url,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Added to the favourites list successfully!!');
      location.reload();
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
