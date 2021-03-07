import {get} from 'lodash';

// Types
export const types = {
  //---- GET CUSTOMER MEMBERSHIP ------
  GET_CUSTOMER_MEMBERSHIP_REQUEST: 'GET_CUSTOMER_MEMBERSHIP_REQUEST',
  GET_CUSTOMER_MEMBERSHIP_SUCCESS: 'GET_CUSTOMER_MEMBERSHIP_SUCCESS',
  GET_CUSTOMER_MEMBERSHIP_ERROR: 'GET_CUSTOMER_MEMBERSHIP',

  // -------- GET CUSTOMER DETAILS ----------------
  GET_CUSTOMER_DETAILS_REQUEST: 'GET_CUSTOMER_DETAILS_REQUEST',
  GET_CUSTOMER_DETAILS_SUCCESS: 'GET_CUSTOMER_DETAILS_SUCCESS',
  GET_CUSTOMER_DETAILS_FAIL: 'GET_CUSTOMER_DETAILS_FAIL',

  // ---------- UPDATE_CUSTOMER_DETAILS
  UPDATE_CUSTOMER_DETAILS_REQUEST: 'UPDATE_CUSTOMER_DETAILS_REQUEST',
  UPDATE_CUSTOMER_DETAILS_SUCCESS: 'UPDATE_CUSTOMER_DETAILS_SUCCESS',
  UPDATE_CUSTOMER_DETAILS_FAIL: 'UPDATE_CUSTOMER_DETAILS_FAIL',

  // SET MEMBERSHIP LOCATION
  SET_MEMBERSHIP_LOCATION: 'SET_MEMBERSHIP_LOCATION',
};

export const accountIntialState = {
  membership: null,
  accountLoading: false,
  location: null,
  details: null,
};

// Reducer
const AccountReducer = (state = accountIntialState, action) => {
  switch (action.type) {
    //---- GET CUSTOMER MEMBERSHIP ------

    case types.GET_CUSTOMER_MEMBERSHIP_REQUEST:
      return {
        ...state,
        accountLoading: true,
      };

    case types.GET_CUSTOMER_MEMBERSHIP_SUCCESS:
      return {
        ...state,
        accountLoading: false,
        membership: action.payload,
      };

    case types.GET_CUSTOMER_MEMBERSHIP_ERROR:
      return {
        ...state,
        accountLoading: false,
      };

    // ---------- GET CUSTOMER DETAILS ------------

    case types.GET_CUSTOMER_DETAILS_REQUEST:
      return {
        ...state,
        accountLoading: true,
      };

    case types.GET_CUSTOMER_DETAILS_SUCCESS:
      return {
        ...state,
        accountLoading: false,
        details: action.payload,
      };

    case types.GET_CUSTOMER_DETAILS_FAIL:
      return {
        ...state,
        accountLoading: false,
      };

    // -------- UPDATE CUSTOMER DETAILS ----------
    case types.UPDATE_CUSTOMER_DETAILS_REQUEST:
      return {
        ...state,
        accountLoading: true,
      };

    case types.UPDATE_CUSTOMER_DETAILS_SUCCESS:
      return {
        ...state,
        accountLoading: false,
        details: {
          ...state.details,
          ...action.payload,
        },
      };

    case types.UPDATE_CUSTOMER_DETAILS_FAIL:
      return {
        ...state,
        accountLoading: false,
      };

    case types.SET_MEMBERSHIP_LOCATION:
      return {
        ...state,
        location: action.payload,
      };

    default:
      return state;
  }
};

export default AccountReducer;

export const accountActions = {
  //---- GET CUSTOMER MEMBERSHIP ------
  getCustomerMembershipRequest: () => ({
    type: types.GET_CUSTOMER_MEMBERSHIP_REQUEST,
  }),

  getCustomerMembershipSuccess: (payload) => ({
    type: types.GET_CUSTOMER_MEMBERSHIP_SUCCESS,
    payload,
  }),

  getCustomerMembershipError: () => ({
    type: types.GET_CUSTOMER_MEMBERSHIP_ERROR,
  }),

  // ---- GET CUSTOMER DETAILS ---------
  getCustomerDetailsRequest: () => ({
    type: types.GET_CUSTOMER_DETAILS_REQUEST,
  }),

  getCustomerDetailsSuccess: (payload) => ({
    type: types.GET_CUSTOMER_DETAILS_SUCCESS,
    payload,
  }),

  getCustomerDetailsError: () => ({
    type: types.GET_CUSTOMER_DETAILS_FAIL,
  }),

  // ------------- UPDATE  ------------------
  updateCustomerDetailsRequest: () => ({
    type: types.UPDATE_CUSTOMER_DETAILS_REQUEST,
  }),

  updateCustomerDetailsSuccess: (payload) => ({
    type: types.UPDATE_CUSTOMER_DETAILS_SUCCESS,
    payload,
  }),

  updateCustomerDetailsError: () => ({
    type: types.UPDATE_CUSTOMER_DETAILS_FAIL,
  }),

  // ---- Set Location ------
  setMembershipLocation: (payload) => ({
    type: types.SET_MEMBERSHIP_LOCATION,
    payload,
  }),
};
