
import moment from 'moment';

// Types
export const types = {
  //---- GET APPTS ------

  GET_APPTS_REQUEST: 'GET_APPTS_REQUEST',
  GET_APPTS_SUCCESS: 'GET_APPTS_SUCCESS',
  GET_APPTS_ERROR: 'GET_APPTS_ERROR',

  //---- CANCEL APPT ------

  CANCEL_APPT_REQUEST: 'CANCEL_APPT_REQUEST',
  CANCEL_APPT_SUCCESS: 'CANCEL_APPT_SUCCESS',
  CANCEL_APPT_ERROR: 'CANCEL_APPT_ERROR',

  // ---- SET USE CURRENT LOCATION ---
  SET_USE_CURRENT_LOCATION: 'SET_USE_CURRENT_LOCATION',

  // ---- SET USE CURRENT LOCATION ---
  SET_GLOBAL_CONFIG: 'SET_GLOBAL_CONFIG',

  // ---- SET CURRENT LOCATION ----
  SET_CURRENT_LOCATION: 'SET_CURRENT_LOCATION',

  // ---- SET RADAR PERMISSION ----
  SET_RADAR_PERMISSION: 'SET_RADAR_PERMISSION',
};

export const homeIntialState = {
  appointments: [],
  pastAppt: [],
  apptLoading: false,
  useCurrentLocation: true,
  config: null,
  currentLocation: false,
  radarPermission: null,
};

// Reducer
const HomeReducer = (state = homeIntialState, action) => {
  switch (action.type) {
    //---- GET APPTS ------
    case types.GET_APPTS_REQUEST:
      return {
        ...state,
        apptLoading: true,
      };

    case types.GET_APPTS_SUCCESS:
      return {
        ...state,
        apptLoading: false,
        appointments: action.payload.filter(
          (e) =>
            !e.appointment.IsPastDue &&
            !e.appointment.IsCancelled &&
            moment(e.appointment.StartDateTimeOffset) >= moment(new Date()),
        ),
        pastAppt: action.payload.filter(
          (e) =>
            (e.appointment.IsPastDue ||
              moment(e.appointment.StartDateTimeOffset) < moment(new Date())) &&
            !e.appointment.IsCancelled &&
            moment(new Date()).subtract(3, 'months') <
              moment(e.appointment.StartDateTimeOffset),
        ),
      };

    case types.GET_APPTS_ERROR:
      return {
        ...state,
        apptLoading: false,
      };

    //---- CANCEL APPT ------

    case types.CANCEL_APPT_REQUEST:
      return {
        ...state,
        apptLoading: true,
      };

    case types.CANCEL_APPT_SUCCESS:
      return {
        ...state,
        apptLoading: false,
        appointments: state.appointments.filter(
          (e) =>
            (e.group &&
              action.payload.Group &&
              e.group !== action.payload.Group) ||
            (!e.group && e.appointment.ID !== action.payload.ID),
        ),
      };

    case types.CANCEL_APPT_ERROR:
      return {
        ...state,
        apptLoading: false,
      };

    case types.SET_USE_CURRENT_LOCATION:
      return {
        ...state,
        useCurrentLocation: action.payload,
      };

    case types.SET_GLOBAL_CONFIG:
      return {
        ...state,
        config: action.payload,
      };

    case types.SET_CURRENT_LOCATION:
      return {
        ...state,
        currentLocation: {
          ...state.currentLocation,
          ...action.payload,
        },
      };

    case types.SET_RADAR_PERMISSION:
      return {
        ...state,
        radarPermission: action.payload,
      };

    default:
      return state;
  }
};

export default HomeReducer;

export const homeActions = {
  //---- GET APPTS ------

  getApptRequest: () => ({
    type: types.GET_APPTS_REQUEST,
  }),

  getApptSuccess: (payload) => ({
    type: types.GET_APPTS_SUCCESS,
    payload,
  }),

  getApptError: () => ({
    type: types.GET_APPTS_ERROR,
  }),

  //---- CANCEL APPT ------

  cancelApptRequest: () => ({
    type: types.CANCEL_APPT_REQUEST,
  }),

  cancelApptSuccess: (payload) => ({
    type: types.CANCEL_APPT_SUCCESS,
    payload,
  }),

  cancelApptError: () => ({
    type: types.CANCEL_APPT_ERROR,
  }),

  // ---- SET CURRENT USE LOCATION ------

  setUseCurrentLocation: (payload) => ({
    type: types.SET_USE_CURRENT_LOCATION,
    payload,
  }),

  // --------- SET GLOBAL CONFIG ---------------
  setGlobalConfig: (payload) => ({
    type: types.SET_GLOBAL_CONFIG,
    payload,
  }),

  // -------- SET CURRENT LOCATION ----------------
  setCurrentLocation: (payload) => ({
    type: types.SET_CURRENT_LOCATION,
    payload,
  }),

  // ------- SET RADAR PERMISSION ----------------
  setRadarPermission: (payload) => ({
    type: types.SET_RADAR_PERMISSION,
    payload,
  }),
};
