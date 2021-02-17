import {get} from 'lodash';
import {accountActions} from './ducks';

import * as API from 'services';
import {AlertHelper} from 'utils/AlertHelper';
import {logoutSuccess} from 'screens/Auth/thunks'

export const getCustomerMembership = (customerId, locationId) => async (dispatch) => {
  dispatch(accountActions.getCustomerMembershipRequest);

  try {
    const data = await API.getCustomerMembership({
      CustomerID: customerId,
      LocationID: locationId
    });

    return dispatch(accountActions.getCustomerMembershipSuccess(data))
  } catch (e) {

    if (e.response && e.response.status === 401) {
      dispatch(accountActions.getCustomerMembershipError());
      return dispatch(logoutSuccess())
    } else {
      AlertHelper.showError(get(e.response, 'data.error', 'Server Error'))
      return dispatch(accountActions.getCustomerMembershipError())
    }
  }
}

export const getCustomerDetails = (id) => async (dispatch) => {
  dispatch(accountActions.getCustomerDetailsRequest())
  try {
    const data = await API.getCustomerDetails(id);
    return dispatch(accountActions.getCustomerDetailsSuccess(data.Customer.Customer))
  } catch (e) {
    if (e.response && e.response.status === 401) {
      dispatch(accountActions.getCustomerDetailsError());
      return dispatch(logoutSuccess())
    } else {
      AlertHelper.showError(get(e.response, 'data.error', 'Server Error'))
      return dispatch(accountActions.getCustomerDetailsError())
    }
  }

}


export const updateCustomer = (customer) => async (dispatch)=> {
  dispatch(accountActions.updateCustomerDetailsRequest())
  try {
    const data = await API.updateCustomer(customer);
    if (data.IsSuccess) {
      return dispatch(
        accountActions.updateCustomerDetailsSuccess(customer),
      );
    }
  } catch (e) {
    if (e.response && e.response.status === 401) {
      dispatch(accountActions.updateCustomerDetailsError());
      return dispatch(logoutSuccess())
    } else {
      console.log('Update Customer Error: ', e);
      AlertHelper.showError(get(e.response, 'data.error', 'Server Error'))
      return dispatch(accountActions.updateCustomerDetailsError());
    }
  }
}

export const addCreditCardForCustomer = (card) => async (dispatch) => {
  dispatch(accountActions.addCreditCardForCustomer())
}
