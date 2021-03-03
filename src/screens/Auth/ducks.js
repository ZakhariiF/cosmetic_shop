import {get} from 'lodash';
import { act } from 'react-test-renderer';

// Types
export const types = {
  //TOKEN
  TOKEN: 'TOKEN',

  // LOGIN

  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',

  // REGISTER

  REGISTER_REQUEST: 'REGISTER_REQUEST',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_ERROR: 'REGISTER_ERROR',

  // UPDATE LOGIN DETAILS

  UPDATE_LOGIN_DETAILS_REQUEST: 'UPDATE_LOGIN_DETAILS_REQUEST',
  UPDATE_LOGIN_DETAILS_SUCCESS: 'UPDATE_LOGIN_DETAILS_SUCCESS',
  UPDATE_LOGIN_DETAILS_ERROR: 'UPDATE_LOGIN_DETAILS_ERROR',

  // GET CUSTOMER

  GET_CUSTOMER_REQUEST: 'GET_CUSTOMER_REQUEST',
  GET_CUSTOMER_SUCCESS: 'GET_CUSTOMER_SUCCESS',
  GET_CUSTOMER_ERROR: 'GET_CUSTOMER_ERROR',

  // UPDATE CUSTOMER

  UPDATE_CUSTOMER_REQUEST: 'UPDATE_CUSTOMER_REQUEST',
  UPDATE_CUSTOMER_SUCCESS: 'UPDATE_CUSTOMER_SUCCESS',
  UPDATE_CUSTOMER_ERROR: 'UPDATE_CUSTOMER_ERROR',

  // RECOVER PASSWORD

  RECOVER_PASSWORD_REQUEST: 'RECOVER_PASSWORD_REQUEST',
  RECOVER_PASSWORD_SUCCESS: 'RECOVER_PASSWORD_SUCCESS',
  RECOVER_PASSWORD_ERROR: 'RECOVER_PASSWORD_ERROR',

  //---- CHANGE PASSWORD ------

  CHANGE_PASSWORD_REQUEST: 'CHANGE_PASSWORD_REQUEST',
  CHANGE_PASSWORD_SUCCESS: 'CHANGE_PASSWORD_SUCCESS',
  CHANGE_PASSWORD_ERROR: 'CHANGE_PASSWORD_ERROR',

  //---- RESEND EMAIL ------

  RESEND_EMAIL_REQUEST: 'RESEND_EMAIL_REQUEST',
  RESEND_EMAIL_SUCCESS: 'RESEND_EMAIL_SUCCESS',
  RESEND_EMAIL_ERROR: 'RESEND_EMAIL_ERROR',

  // SET_FAV_ITEM

  SET_FAV_ITEM: 'SET_FAV_ITEM',

  // LOGOUT

  LOGOUT_REQUEST: 'LOGOUT_REQUEST',
  LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
  LOGOUT_ERROR: 'LOGOUT_ERROR',

  // SET_LOGGEDIN_COUNT
  INCREASE_LOGGEDIN_COUNT: 'INCREASE_LOGGEDIN_COUNT',
};

export const authIntialState = {
  token: null,
  userInfo: null,
  isLoading: false,
  forgotLoading: false,
  isPasswordLoading: false,
  customerInfo: null,
  isUpdate: false,
  favItem: '',
  isResend: false,
  loggedInCount: 0,
};

// Reducer
const AuthReducer = (state = authIntialState, action) => {
  console.log(action);
  switch (action.type) {
    case types.TOKEN:
      return {
        ...state,
        token: action.token,
        userInfo: action.data
      }
    case types.LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case types.LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        userInfo: action.payload.userInfo,
        isLoading: false,
      };

    case types.LOGIN_ERROR:
      return {
        ...state,
        isLoading: false,
      };

    // REGISTER

    case types.REGISTER_REQUEST:
      return {
        ...state,
        isLoading: true,
      };

    case types.REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: false,
      };

    case types.REGISTER_ERROR:
      return {
        ...state,
        isLoading: false,
      };

    // UPDATE LOGIN DETAILS

    case types.UPDATE_LOGIN_DETAILS_REQUEST:
      return {
        ...state,
        isUpdate: true,
      };

    case types.UPDATE_LOGIN_DETAILS_SUCCESS:
      return {
        ...state,
        userInfo: action.payload,
        isUpdate: false,
      };

    case types.UPDATE_LOGIN_DETAILS_ERROR:
      return {
        ...state,
        isUpdate: false,
      };

    // GET CUSTOMER

    case types.GET_CUSTOMER_REQUEST:
      return {
        ...state,
      };

    case types.GET_CUSTOMER_SUCCESS:
      let getFavItem = get(
        action,
        'payload.Customer.CustomerFieldValues.FieldValues',
        [],
      );
      let favLoc = '';

      if (getFavItem.length) {
        getFavItem = getFavItem.find((e) => e.Key == 56378);

        if (getFavItem) {
          favLoc = get(getFavItem, 'Value.TextValue.Value', '');
        }
      }
      return {
        ...state,
        customerInfo: action.payload,
        favItem: favLoc,
      };

    case types.GET_CUSTOMER_ERROR:
      return {
        ...state,
      };

    // UPDATE CUSTOMER

    case types.UPDATE_CUSTOMER_REQUEST:
      return {
        ...state,
      };

    case types.UPDATE_CUSTOMER_SUCCESS:
      return {
        ...state,
        customerInfo: action.payload,
      };

    case types.UPDATE_CUSTOMER_ERROR:
      return {
        ...state,
      };

    // RECOVER PASSWORD

    case types.RECOVER_PASSWORD_REQUEST:
      return {
        ...state,
        forgotLoading: true,
      };

    case types.RECOVER_PASSWORD_SUCCESS:
      return {
        ...state,
        forgotLoading: false,
      };

    case types.RECOVER_PASSWORD_ERROR:
      return {
        ...state,
        forgotLoading: false,
      };

    // SET_FAV_ITEM

    case types.SET_FAV_ITEM:
      return {
        ...state,
        favItem: action.payload,
      };

    // LOGOUT
    case types.LOGOUT_REQUEST:
      return {
        ...state,
      };

    case types.LOGOUT_SUCCESS:
      console.log(state.loggedInCount);
      return {
        ...state,
        token: null,
        userInfo: null,
      };

    case types.LOGOUT_ERROR:
      return {
        ...state,
      };

    //---- RESEND EMAIL ------

    case types.RESEND_EMAIL_REQUEST:
      return {
        ...state,
        isResend: true,
      };

    case types.RESEND_EMAIL_SUCCESS:
      return {
        ...state,
        isResend: false,
      };

    case types.RESEND_EMAIL_ERROR:
      return {
        ...state,
        isResend: false,
      };

    //---- CHANGE PASSWORD ------

    case types.CHANGE_PASSWORD_REQUEST:
      return {
        ...state,
        isPasswordLoading: true,
      };

    case types.CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        isPasswordLoading: false,
      };

    case types.CHANGE_PASSWORD_ERROR:
      return {
        ...state,
        isPasswordLoading: false,
      };
    case types.INCREASE_LOGGEDIN_COUNT:
      return {
        ...state,
        loggedInCount: state.loggedInCount + 1,
      };

    default:
      return state;
  }
};

export const authActions = {
  // LOGIN
  loginRequest: () => ({
    type: types.LOGIN_REQUEST,
  }),

  loginSuccess: (payload) => ({
    type: types.LOGIN_SUCCESS,
    payload,
  }),

  loginError: () => ({
    type: types.LOGIN_ERROR,
  }),

  // REGISTER

  registerRequest: () => ({
    type: types.REGISTER_REQUEST,
  }),

  registerSuccess: (payload) => ({
    type: types.REGISTER_SUCCESS,
    payload,
  }),

  registerError: () => ({
    type: types.REGISTER_ERROR,
  }),

  // UPDATE LOGIN DETAILS

  updateUserRequest: () => ({
    type: types.UPDATE_LOGIN_DETAILS_REQUEST,
  }),

  updateUserSuccess: (payload) => ({
    type: types.UPDATE_LOGIN_DETAILS_SUCCESS,
    payload,
  }),

  updateUserError: () => ({
    type: types.UPDATE_LOGIN_DETAILS_ERROR,
  }),

  // GET CUSTOMER

  getCustomerRequest: () => ({
    type: types.GET_CUSTOMER_REQUEST,
  }),

  getCustomerSuccess: (payload) => ({
    type: types.GET_CUSTOMER_SUCCESS,
    payload,
  }),

  getCustomerError: () => ({
    type: types.GET_CUSTOMER_ERROR,
  }),

  // UPDATE CUSTOMER

  updateCustomerRequest: () => ({
    type: types.UPDATE_CUSTOMER_REQUEST,
  }),

  updateCustomerSuccess: (payload) => ({
    type: types.UPDATE_CUSTOMER_SUCCESS,
    payload,
  }),

  updateCustomerError: () => ({
    type: types.UPDATE_CUSTOMER_ERROR,
  }),

  // RECOVER PASSWORD

  recoverPasswordRequest: () => ({
    type: types.RECOVER_PASSWORD_REQUEST,
  }),

  recoverPasswordSuccess: (payload) => ({
    type: types.RECOVER_PASSWORD_SUCCESS,
    payload,
  }),

  recoverPasswordError: () => ({
    type: types.RECOVER_PASSWORD_ERROR,
  }),

  //---- CHANGE PASSWORD ------

  changePassRequest: () => ({
    type: types.CHANGE_PASSWORD_REQUEST,
  }),

  changePassSuccess: (payload) => ({
    type: types.CHANGE_PASSWORD_SUCCESS,
    payload,
  }),

  changePassError: () => ({
    type: types.CHANGE_PASSWORD_ERROR,
  }),

  //---- RESEND EMAIL ------

  resendEmailRequest: () => ({
    type: types.RESEND_EMAIL_REQUEST,
  }),

  resendEmailSuccess: () => ({
    type: types.RESEND_EMAIL_SUCCESS,
  }),

  resendEmailError: () => ({
    type: types.RESEND_EMAIL_ERROR,
  }),

  // SET_FAV_ITEM

  setFavItem: (payload) => ({
    type: types.SET_FAV_ITEM,
    payload,
  }),

  // LOGOUT
  logoutRequest: () => ({
    type: types.LOGOUT_REQUEST,
  }),

  logoutSuccess: () => ({
    type: types.LOGOUT_SUCCESS,
  }),

  logoutError: () => ({
    type: types.LOGOUT_ERROR,
  }),

  increaseLoggedInCount: () => ({
    type: types.INCREASE_LOGGEDIN_COUNT,
  }),
};

export default AuthReducer;
