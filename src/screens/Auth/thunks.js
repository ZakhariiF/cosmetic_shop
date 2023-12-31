import {get} from 'lodash';
import MParticle from 'react-native-mparticle';
import {AlertHelper} from 'utils/AlertHelper';
import {authActions} from './ducks';
import {
  getUser,
  refreshTokens,
  getUserFromIdToken,
} from '@okta/okta-react-native';
import * as API from 'services';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const _onlogin = (token, email, password) => async (dispatch) => {
  dispatch(authActions.loginRequest());

  try {
    const userInfo = await getUser();

    const tokens = await refreshTokens();
    await AsyncStorage.setItem('tokens', JSON.stringify(tokens));

    const userClams = await getUserFromIdToken();
    await AsyncStorage.setItem('userClams', JSON.stringify(userClams));

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

export const updateUserInfo = (obj) => async (dispatch) => {
  dispatch(authActions.updateUserRequest());

  try {
    const data = await API.updateUser(obj);
    const userInfo = get(data, 'profile');

    if (userInfo) {
      AlertHelper.showSuccess('User Updated Successfully');
      return dispatch(
        authActions.updateUserSuccess({
          ...userInfo,
          firstname: userInfo.firstName,
          lastname: userInfo.lastName,
          preferred_username: userInfo.email,
          bookerID: userInfo.bookerId,
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
    const data = await API.register(obj);
    console.log('register>>>', data);
    if (data) {
      return dispatch(authActions.registerSuccess(data));
    } else {
      return dispatch(authActions.registerError());
    }
  } catch (error) {
    console.log('error>>>.', error, error.response);
    if (get(error, 'response.data.errorCode', '') === 'E0000001') {
      AlertHelper.showError(
        'Registration Error:  An account already exists with this email address, please try resetting your password',
      );
    } else {
      AlertHelper.showError(
        get(error, 'response.data.errorCauses[0].errorSummary', 'Server Error'),
      );
    }
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
    if (get(error, 'response.data.status') === 404) {
      // does not exist
      errorMessage =
        'We have received your password reset request. if your email matches our records we will send you a password reset link in just a second.';
    } else if (get(error, 'response.data.status') === 'PROVISIONED') {
      // not activated
      errorMessage = null;
    } else {
      errorMessage =
        'Your account has been locked, please email customer service at buttercup@thedrybar.com';
    }

    if (errorMessage) {
      AlertHelper.showError(errorMessage);
    }
    return dispatch(authActions.recoverPasswordError(!errorMessage));
  }
};

export const hideReactivationModal = () => (dispatch) => {
  return dispatch(authActions.hideReactivationModal())
}

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

export const increaseLoggedInCount = () => (dispatch) => {
  dispatch(authActions.increaseLoggedInCount());
};
