/* eslint-disable */
import { showAlert, hideAlert } from './alerts.mjs';

export const forgot = async (email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data: {
        email,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Email sent successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1250);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const reset = async (token, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/resetPassword/${token}`,
      data: {
        password,
        passwordConfirm,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Password changed successfully');
      window.setTimeout(() => {
        location.assign('/login');
      }, 1250);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
