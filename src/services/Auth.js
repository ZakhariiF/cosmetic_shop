import axios from 'axios';
import config from 'constant/config';
import {client} from 'services';

export const register = (data) => {
  return client
    .post('/okta/create-user', {
      profile: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        login: data.email,
        mobilePhone: data.phone,
      },
    })
    .then((response) => response.data);
};


export const updateUser = (data) => {
  return client
    .post('/okta/update-user', data)
    .then((response) => response.data);
};


export const recoverPassword = (email) => {
  return client
    .post('/okta/forgot-password', {
      id: email,
    })
    .then((response) => response.data);
};

export const changePassword = (userId, data) => {
  console.log('useId,,,,', userId, data);
  return axios
    .post(
      `${config.oktaBaseurl}/api/v1/users/${userId}/credentials/change_password`,
      {
        oldPassword: {value: data.oldPassword},
        newPassword: {value: data.newPassword},
      },
      {
        headers: {
          Authorization: `SSWS ${config.oktaToken}`,
        },
      },
    )
    .then((response) => response.data);
};

export const getUser = (userId) => {
  return axios
    .get(`${config.oktaBaseurl}/api/v1/users/${userId}`, {
      headers: {
        Authorization: `SSWS ${config.oktaToken}`,
      },
    })
    .then((response) => response.data);
};

export const getCustomer = (id) => {
  return client
    .post('/booker/GetCustomer', {
      method: 'GET',
      urlParams: {
        customerId: id,
      },
      data: {
        includeFieldValues: true,
      },
    })
    .then((response) => response.data);
};

export const resendEmail = (email) => {
  return client
    .post('/okta/resend-activation-link', {
      id: email,
    })
    .then((response) => response.data);
};
