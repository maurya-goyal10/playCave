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
