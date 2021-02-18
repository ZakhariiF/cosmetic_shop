import {homeActions} from './ducks';
import * as API from 'services';
import {AlertHelper} from 'utils/AlertHelper';
import {get} from 'lodash';
import {logoutSuccess} from 'screens/Auth/thunks';

export const getAppointments = (userId) => async (dispatch) => {
  dispatch(homeActions.getApptRequest());
  try {
    const data = await API.getAppts(userId);
    if (data.IsSuccess) {
      const groups = data.Appointments.reduce((obj, cur) => {
        if (cur.GroupID) {
          const groupKey = `group_${cur.GroupID}`;
          if (!obj[groupKey]) {
            obj[groupKey] = {
              bookingNumbers: [],
              appointment: cur,
              groupID: cur.GroupID,
            };
          }
          obj[groupKey].bookingNumbers.push(cur.BookingNumber);
          return obj;
        }
        obj[`group_${cur.BookingNumber}`] = {
          appointment: cur,
          bookingNumbers: [cur.BookingNumber],
        };
        return obj;
      }, {});
      return dispatch(homeActions.getApptSuccess(Object.values(groups)));
    } else {
      AlertHelper.showError(get(data, 'ErrorMessage', 'Server Error'));
      return dispatch(homeActions.getApptError());
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return dispatch(homeActions.getApptError());
      // return dispatch(logoutSuccess())
    } else {
      AlertHelper.showError(get(error.response, 'data.error', 'Server Error'));
      return dispatch(homeActions.getApptError());
    }
  }
};

export const cancelAppointment = (id) => async (dispatch) => {
  dispatch(homeActions.cancelApptRequest());
  try {
    const data = await API.cancelAppt(id);
    if (data.IsSuccess) {
      return dispatch(homeActions.cancelApptSuccess(data.Appointment));
    } else {
      AlertHelper.showError(get(data, 'ErrorMessage', 'Server Error'));
      return dispatch(homeActions.cancelApptError());
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return dispatch(homeActions.cancelApptError());
      // return dispatch(logoutSuccess())
    } else {
      AlertHelper.showError(get(error.response, 'data.error', 'Server Error'));
      return dispatch(homeActions.cancelApptError());
    }
  }
};

export const cancelItinerary = (id, locationId) => async (dispatch) => {
  dispatch(homeActions.cancelApptRequest());
  try {
    const data = await API.cancelItinerary(id, locationId);
    if (data.IsSuccess) {
      return dispatch(homeActions.cancelApptSuccess({Group: id}));
    } else {
      AlertHelper.showError(get(data, 'ErrorMessage', 'Server Error'));
      return dispatch(homeActions.cancelApptError());
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      dispatch(homeActions.cancelApptError());
      return dispatch(logoutSuccess());
    } else {
      AlertHelper.showError(get(error.response, 'data.error', 'Server Error'));
      return dispatch(homeActions.cancelApptError());
    }
  }
};
