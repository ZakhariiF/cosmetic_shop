/**
 * @file: index.js
 * @description: Application Reducer for rehydrating state to the store and exporting reducers.
 * @date: 11.03.2020
 * @author: Dalbeer Sandhu
 * */
import {combineReducers} from 'redux';
import authReducer, {authIntialState} from './screens/Auth/ducks';
import homeReducer from './screens/Dashboard/ducks';
import bookingReducer from './screens/Dashboard/Booking/ducks';
import accountReducer from 'screens/Dashboard/MyAccount/ducks';

const appReducer = combineReducers({
  auth: authReducer,
  home: homeReducer,
  booking: bookingReducer,
  account: accountReducer,
});

export default (state, action) => {
  if (action.type === 'LOGOUT_SUCCESS' || action.type === 'LOGOUT_ERROR') {
    state.auth = {
      ...authIntialState,
      loggedInCount: state.auth.loggedInCount,
    };
  }
  return appReducer(state, action);
};
