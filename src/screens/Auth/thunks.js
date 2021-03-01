import {get} from 'lodash';
import MParticle from 'react-native-mparticle';
import {AlertHelper} from 'utils/AlertHelper';
import {authActions} from './ducks';
import {getUser, signOut} from '@okta/okta-react-native';
import * as API from 'services';

export const _onlogin = (token, email, password) => async (dispatch) => {
  dispatch(authActions.loginRequest());

  try {
    const userInfo = await getUser();

    const request = new MParticle.IdentityRequest();
    request.email = email;
    request.setCustomerID(get(userInfo, 'bookerID'));

    MParticle.Identity.login(request, (error, userId) => {
      console.log('MParticle Identify:', error, userId);
    });

    MParticle.logEvent('Login Successful', MParticle.EventType.Other, {
      'Source Page': 'Login',
    });

    return dispatch(loginSuccess(userInfo));
  } catch (error) {
    AlertHelper.showError(get(error, 'detail.message'));
    if (error && error.response) {
      console.log('error here', error, error.response);
    } else {
      console.log('error here', error);
    }
    AlertHelper.showError(
      get(error, 'response.data.errorSummary', 'Server Error'),
    );
    return dispatch(authActions.loginError());
  }
};

export const loginSuccess = (user) => async (dispatch) => {
  dispatch(
    authActions.loginSuccess({
      userInfo: user,
    }),
  );
};

export const onlogin = (email, password) => async (dispatch) => {
  dispatch(authActions.loginRequest());

  try {
    // const data = await oktaSigin(email, password);
    const data = await API.login(email, password);
    if (data) {
      const userInfo = await API.getUser(get(data, '_embedded.user.id'));
      let userData = data;
      userData.userInfo = userInfo;
      return dispatch(authActions.loginSuccess(userData));
    } else {
      return dispatch(authActions.loginError());
    }
  } catch (error) {
    // AlertHelper.showError(get(error, 'detail.message'));
    if (error && error.response) {
      console.log('error here', error, error.response);
    } else {
      console.log('error here', error);
    }
    AlertHelper.showError(
      get(error, 'response.data.errorSummary', 'Server Error'),
    );
    return dispatch(authActions.loginError());
  }
};

export const updateUserInfo = (obj) => async (dispatch) => {
  dispatch(authActions.updateUserRequest());

  try {
    const data = await API.updateUser(obj);
    console.log('update  data data>>>', data);
    if (data) {
      AlertHelper.showSuccess('User Updated Successfully');
      const userInfo = get(data, 'profile');
      return dispatch(
        authActions.updateUserSuccess({
          ...userInfo,
          firstname: userInfo.firstName,
          lastname: userInfo.lastName,
          preferred_username: userInfo.email,
        }),
      );
    } else {
      return dispatch(authActions.updateUserError());
    }
  } catch (error) {
    console.log('UpdateUserInfo:', error, get(error, 'response'));
    AlertHelper.showError(
      get(error, 'response.data.errorCauses[0].errorSummary', 'Server Error'),
    );
    return dispatch(authActions.updateUserError());
  }
};

export const getCustomerInfo = (id) => async (dispatch) => {
  dispatch(authActions.getCustomerRequest());

  try {
    const data = await API.getCustomer(id);
    console.log('customer info data data>>>', data);
    if (data.IsSuccess) {
      return dispatch(authActions.getCustomerSuccess(get(data, 'Customer')));
    } else {
      console.log('Customer Issue:', data);
      AlertHelper.showError(get(data, 'ErrorMessage', 'Server Error'));
      return dispatch(authActions.getCustomerError());
    }
  } catch (error) {
    console.log('Catch Customer Issue:', error);
    AlertHelper.showError(get(error.response, 'data.error', 'Server Error'));
    return dispatch(authActions.getCustomerError());
  }
};

export const updateCustomerInfo = (id) => async (dispatch) => {
  dispatch(authActions.updateCustomerRequest());

  try {
    const data = await API.updateCustomer(id);
    console.log('customer info data data>>>', data);
    if (data.IsSuccess) {
      return dispatch(authActions.updateCustomerSuccess());
    } else {
      AlertHelper.showError(get(data, 'ErrorMessage', 'Server Error'));
      return dispatch(authActions.updateCustomerError());
    }
  } catch (error) {
    AlertHelper.showError(get(error.response, 'data.error', 'Server Error'));
    return dispatch(authActions.updateCustomerError());
  }
};

export const onregister = (obj) => async (dispatch) => {
  dispatch(authActions.registerRequest());
  try {
    const data = await API.signin(obj);
    console.log('register>>>', data);
    if (data) {
      return dispatch(authActions.registerSuccess(data));
    } else {
      return dispatch(authActions.registerError());
    }
  } catch (error) {
    console.log('error>>>.', error, error.response);
    AlertHelper.showError(
      get(error, 'response.data.errorCauses[0].errorSummary', 'Server Error'),
    );
    return dispatch(authActions.registerError());
  }
};

export const forgotpassword = (email) => async (dispatch) => {
  dispatch(authActions.recoverPasswordRequest());
  try {
    const data = await API.recoverPassword(email);
    if (data) {
      AlertHelper.showSuccess('Verification email sent to your email');
      return dispatch(authActions.recoverPasswordSuccess(data));
    } else {
      return dispatch(authActions.recoverPasswordError());
    }
  } catch (error) {
    let errorMessage = get(error, 'response.data.errorCauses[0].errorSummary');
    if (!errorMessage) {
      errorMessage =
        get(error, 'response.data.errorSummary') ||
        get(error, 'response.data.message');
    }

    AlertHelper.showError(errorMessage || 'Server Error');
    return dispatch(authActions.recoverPasswordError());
  }
};

export const logoutSuccess = () => async (dispatch) => {
  return dispatch(authActions.logoutSuccess());
};

export const updatePassword = (id, obj) => async (dispatch) => {
  dispatch(authActions.changePassRequest());
  try {
    const data = await API.changePassword(id, obj);
    if (data) {
      return dispatch(authActions.changePassSuccess(data));
    } else {
      AlertHelper.showError(get(data, 'ErrorMessage', 'Server Error'));
      return dispatch(authActions.changePassError());
    }
  } catch (error) {
    AlertHelper.showError(
      get(error.response, 'data.errorCauses[0].errorSummary', 'Server Error'),
    );
    return dispatch(authActions.changePassError());
  }
};

export const setFavoriteStore = (data) => async (dispatch) => {
  return dispatch(authActions.setFavItem(data));
};

export const resendEmail = (email) => async (dispatch) => {
  dispatch(authActions.resendEmailRequest());
  try {
    const data = await API.resendEmail(email);

    console.log('email resend ', data);

    if (data) {
      AlertHelper.showSuccess(
        get(data, 'message', 'We have sent the activation link to your email'),
      );
      return dispatch(authActions.resendEmailSuccess());
    } else {
      AlertHelper.showError(get(data, 'ErrorMessage', 'Server Error'));
      return dispatch(authActions.resendEmailError());
    }
  } catch (error) {
    console.log('found err', error, error.responses);
    AlertHelper.showError(
      get(error.response, 'data.errorSummary', 'Server Error'),
    );
    return dispatch(authActions.resendEmailError());
  }
};
