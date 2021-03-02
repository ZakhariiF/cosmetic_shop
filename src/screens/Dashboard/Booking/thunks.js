import {convertAppointmentToState, getExtensionFromAppointment} from 'utils';

const {bookingActions} = require('./ducks');
import {get} from 'lodash';
import * as API from 'services';
import {AlertHelper} from 'utils/AlertHelper';
import {logoutSuccess} from '../../Auth/thunks';

export const setmemberCount = (data) => async (dispatch) => {
  return dispatch(bookingActions.setMembers(data));
};

export const setActiveGuestTab = (data) => async (dispatch) => {
  return dispatch(bookingActions.setGuestTab(data));
};

export const setExtensionType = (data) => async (dispatch) => {
  return dispatch(bookingActions.setExtension(data));
};

export const getServices = (id) => async (dispatch) => {
  dispatch(bookingActions.getServiceRequest());
  try {
    const data = await API.getServices(id);

    if (data.IsSuccess) {
      let serviceArr = get(data, 'Treatments', []);
      let services = [];
      serviceArr.forEach((service) => {
        if (service.Name === 'Extensions') {
          dispatch(bookingActions.setExtensionAddon(service));
        } else if (service.AllowCustomersToBookOnline) {
          services.push(service);
        }
      });
      return dispatch(
        bookingActions.getServiceSuccess(
          services.sort((a, b) => {
            if (a.Name > b.Name) {
              return 1;
            } else if (a.Name < b.Name) {
              return -1;
            }
            return 0;
          }),
        ),
      );
    } else {
      AlertHelper.showError(get(data, 'ErrorMessage', 'Server Error'));
      return dispatch(bookingActions.getServiceError());
    }
  } catch (error) {
    if (error.response.status === 401) {
      dispatch(bookingActions.getServiceError());
      return dispatch(logoutSuccess());
    } else {
      AlertHelper.showError(get(error.response, 'data.error', 'Server Error'));
      return dispatch(bookingActions.getServiceError());
    }
  }
};

export const getAddons = (serviceId) => async (dispatch) => {
  dispatch(bookingActions.getAddonRequest());
  try {
    const data = await API.getAddons(serviceId);

    return dispatch(bookingActions.getAddonSuccess(data));
  } catch (error) {
    if (error.response.status === 401) {
      dispatch(bookingActions.getAddonError());
      return dispatch(logoutSuccess());
    } else {
      AlertHelper.showError(get(error.response, 'data.error', 'Server Error'));
      return dispatch(bookingActions.getAddonError());
    }
  }
};

export const findAddons = (locationId) => async (dispatch) => {
  dispatch(bookingActions.getAddonRequest());
  try {
    const data = await API.findAddonServices({
      LocationID: locationId,
      AddonsOnly: true,
    });

    return dispatch(bookingActions.getAddonSuccess(data));
  } catch (error) {
    if (error.response.status === 401) {
      dispatch(bookingActions.getAddonError());
      return dispatch(logoutSuccess());
    } else {
      AlertHelper.showError(get(error.response, 'data.error', 'Server Error'));
      return dispatch(bookingActions.getAddonError());
    }
  }
};

export const getTimeSlots = (obj) => async (dispatch) => {
  dispatch(bookingActions.getSlotsRequest());
  try {
    const data = await API.getSlots(obj);

    // console.log('single slots data', data);
    return dispatch(bookingActions.getSlotsSuccess(data));
  } catch (error) {
    if (error.response.status === 401) {
      dispatch(bookingActions.getSlotsError());
      return dispatch(logoutSuccess());
    } else {
      AlertHelper.showError(get(error.response, 'data.error', 'Server Error'));
      return dispatch(bookingActions.getSlotsError());
    }
  }
};

export const createAppointment = (obj, addons, locationId) => async (
  dispatch,
) => {
  dispatch(bookingActions.bookingRequest());
  try {
    const data = await API.createAppt(obj);

    let appointment = get(data, 'Appointment');

    if (addons && addons.length) {
      const addonRequests = addons.map((a) => {
        return API.addAddonsToAppointment({
          LocationID: locationId,
          AppointmentID: get(data, 'Appointment.ID'),
          AddonItemID: a.ServiceID,
          // AddonItemID: '3818047',
          AddonItemTypeID: 1,
          Quantity: 1,
        });
      });

      const addonData = await Promise.all(addonRequests);

      addonData.forEach((addon) => {
        const addons = get(addon, 'Appointment.AddOnItems', []);
        addons.forEach((a) => {
          const addonIds = get(appointment, 'AddOnItems', []).map(
            (i) => i.ItemID,
          );
          if (!addonIds.includes(a.ItemID)) {
            appointment.AddOnItems.push(a);
          }
        });
      });
    }
    if (data.IsSuccess) {
      return dispatch(
        bookingActions.bookingSuccess({
          Appointment: appointment,
          IsSuccess: true,
        }),
      );
    } else {
      AlertHelper.showError(get(data, 'ErrorMessage', 'Server Error'));
      return dispatch(bookingActions.bookingError());
    }
  } catch (error) {
    if (error.response.status === 401) {
      dispatch(bookingActions.bookingError());
      return dispatch(logoutSuccess());
    } else {
      AlertHelper.showError(get(error.response, 'data.error', 'Server Error'));
      return dispatch(bookingActions.bookingError());
    }
  }
};

export const createGuestAppointment = (obj) => async (dispatch) => {
  dispatch(bookingActions.guestBookingRequest());
  try {
    const data = await API.createItinerary(obj);
    if (data.IsSuccess) {
      const res = await API.bookItinerary(data.ID, obj.GroupName);

      console.log('CreateItinerary:', obj);
      if (res.IsSuccess) {
        return dispatch(bookingActions.guestBookingSuccess(data));
      } else {
        AlertHelper.showError(get(res, 'ErrorMessage', 'Server Error'));
        return dispatch(bookingActions.guestBookingError());
      }
    } else {
      AlertHelper.showError(get(data, 'ErrorMessage', 'Server Error'));
      return dispatch(bookingActions.guestBookingError());
    }
  } catch (error) {
    if (error.response.status === 401) {
      dispatch(bookingActions.guestBookingError());
      return dispatch(logoutSuccess());
    } else {
      AlertHelper.showError(get(error.response, 'data.error', 'Server Error'));
      return dispatch(bookingActions.guestBookingError());
    }
  }
};

export const getAvailableDates = (obj) => async (dispatch) => {
  dispatch(bookingActions.getAvailSlotsRequest());
  try {
    const data = await API.availableDates(obj);
    console.log('single  pile dates>>', data);
    return dispatch(bookingActions.getAvailSlotsSuccess(data));
  } catch (error) {
    if (error.response.status === 401) {
      dispatch(bookingActions.getAvailSlotsError());
      return dispatch(logoutSuccess());
    } else {
      AlertHelper.showError(get(error.response, 'data.error', 'Server Error'));
      return dispatch(bookingActions.getAvailSlotsError());
    }
  }
};

export const getMultiUserDates = (obj) => async (dispatch) => {
  dispatch(bookingActions.getMultiDatesRequest());
  try {
    const data = await API.multiUserDates(obj);

    console.log('multi pile dates>>', data);
    return dispatch(bookingActions.getMultiDatesSuccess(data));
  } catch (error) {
    if (error.response.status === 401) {
      dispatch(bookingActions.getMultiDatesError());
      return dispatch(logoutSuccess());
    } else {
      AlertHelper.showError(get(error.response, 'data.error', 'Server Error'));
      return dispatch(bookingActions.getMultiDatesError());
    }
  }
};

export const getLocations = (data) => async (dispatch) => {
  dispatch(bookingActions.getLocRequest());
  return dispatch(bookingActions.getLocSuccess(data));
};

export const setIsEdit = (data) => async (dispatch) => {
  return dispatch(bookingActions.fromEdit(data));
};

export const updateAppointment = (obj) => async (dispatch) => {
  dispatch(bookingActions.updateApptRequest());
  try {
    const data = await API.updateAppt(obj);
    if (data.IsSuccess) {
      return dispatch(bookingActions.updateApptSuccess());
    } else {
      AlertHelper.showError(get(data, 'ErrorMessage', 'Server Error'));
      return dispatch(bookingActions.updateApptError());
    }
  } catch (error) {
    if (error.response.status === 401) {
      dispatch(bookingActions.updateApptError());
      return dispatch(logoutSuccess());
    } else {
      AlertHelper.showError(get(error.response, 'data.error', 'Server Error'));
      return dispatch(bookingActions.updateApptError());
    }
  }
};

export const setLocation = (data) => async (dispatch) => {
  return dispatch(bookingActions.setSelectedLocation(data));
};

export const setExtensionAddon = (extension) => async (dispatch) => {
  return dispatch(bookingActions.setExtensionAddon(extension));
};

export const applyPromoCode = (locId, code) => async (dispatch) => {
  dispatch(bookingActions.promoCodeRequest());
  try {
    const data = await API.promoCode(locId, code);
    console.log('promo code data', data);
    if (data.IsSuccess) {
      AlertHelper.showSuccess('Coupon applied successfully');
      return dispatch(bookingActions.promoCodeSuccess(data));
    } else {
      AlertHelper.showError(get(data, 'ErrorMessage', 'Server Error'));
      return dispatch(bookingActions.promoCodeError());
    }
  } catch (error) {
    if (error.response.status === 401) {
      dispatch(bookingActions.promoCodeError());
      return dispatch(logoutSuccess());
    } else {
      console.log('promo code error>>', error);
      AlertHelper.showError(get(error.response, 'data.error', 'Server Error'));
      return dispatch(bookingActions.promoCodeError());
    }
  }
};

export const addCreditCard = (obj) => async (dispatch) => {
  dispatch(bookingActions.addCCRequest());
  try {
    const data = await API.addCC(obj);
    if (data.IsSuccess) {
      AlertHelper.showSuccess('Credit card added successfully');
      return dispatch(bookingActions.addCCSuccess(data));
    } else {
      AlertHelper.showError(get(data, 'ErrorMessage', 'Server Error'));
      return dispatch(bookingActions.addCCError());
    }
  } catch (error) {
    if (error.response.status === 401) {
      return dispatch(logoutSuccess());
    } else {
      console.log('promo code error>>', error);
      AlertHelper.showError(get(error.response, 'data.error', 'Server Error'));
      return dispatch(bookingActions.addCCError());
    }
  }
};

export const getCreditCard = (userId, locationId) => async (dispatch) => {
  dispatch(bookingActions.getCCRequest());
  try {
    const data = await API.getCC(userId, locationId);
    console.log('get ccc', data);
    if (data.IsSuccess) {
      return dispatch(
        bookingActions.getCCSuccess(get(data, 'CreditCards', [])),
      );
    } else {
      AlertHelper.showError(get(data, 'ErrorMessage', 'Server Error'));
      return dispatch(bookingActions.getCCError());
    }
  } catch (error) {
    if (error.response.status === 401) {
      dispatch(bookingActions.getCCError());
      return dispatch(logoutSuccess());
    } else {
      console.log('promo code error>>', error);
      AlertHelper.showError(get(error.response, 'data.error', 'Server Error'));
      return dispatch(bookingActions.getCCError());
    }
  }
};

export const getEmplyeesData = (objs, extensionObjs) => async (dispatch) => {
  dispatch(bookingActions.getEmployeeRequest());
  try {
    const data = await Promise.all(objs.map((obj) => API.getEmployee(obj)));
    const extensionAddonData = extensionObjs.length
      ? await Promise.all(extensionObjs.map((obj) => API.getEmployee(obj)))
      : [];
    if (data) {
      return dispatch(
        bookingActions.getEmployeeSuccess(data, extensionAddonData),
      );
    } else {
      AlertHelper.showError(get(data, 'ErrorMessage', 'Server Error'));
      return dispatch(bookingActions.getEmployeeError());
    }
  } catch (error) {
    if (error.response.status === 401) {
      dispatch(bookingActions.getEmployeeError());
      return dispatch(logoutSuccess());
    } else {
      AlertHelper.showError(get(error.response, 'data.error', 'Server Error'));
      return dispatch(bookingActions.getEmployeeError());
    }
  }
};

export const setFavoriteLocation = (obj) => async (dispatch) => {
  dispatch(bookingActions.setFavRequest());
  try {
    const data = await API.setFavLoc(obj);
    if (data.IsSuccess) {
      return dispatch(bookingActions.setFavSuccess());
    } else {
      AlertHelper.showError(get(data, 'ErrorMessage', 'Server Error'));
      return dispatch(bookingActions.setFavError());
    }
  } catch (error) {
    if (error.response.status === 401) {
      dispatch(bookingActions.setFavError());
      return dispatch(logoutSuccess());
    } else {
      AlertHelper.showError(get(error.response, 'data.error', 'Server Error'));
      return dispatch(bookingActions.setFavError());
    }
  }
};

export const getMultiUserTimeSlots = (obj) => async (dispatch) => {
  dispatch(bookingActions.getMultiSlotsRequest());
  try {
    const data = await API.multiUserSlots(obj);
    console.log('muti user slots >>', data);
    if (data) {
      dispatch(bookingActions.getMultiSlotsError());
      return dispatch(bookingActions.getMultiSlotsSuccess(data));
    } else {
      AlertHelper.showError(get(data, 'ErrorMessage', 'Server Error'));
      return dispatch(bookingActions.getMultiSlotsError());
    }
  } catch (error) {
    if (error.response.status === 401) {
      dispatch(bookingActions.getMultiSlotsError());
      return dispatch(logoutSuccess());
    } else {
      AlertHelper.showError(get(error.response, 'data.error', 'Server Error'));
      return dispatch(bookingActions.getMultiSlotsError());
    }
  }
};

export const bookedForMoreUser = (obj) => async (dispatch) => {
  dispatch(bookingActions.bookingFormRequest());
  try {
    const data = await API.bookedForMoreUser(obj);
    console.log('bookedForMoreUser >>', data);
    if (data.Success) {
      AlertHelper.showSuccess(
        'Request Sent. Someone from Drybar will contact you soon.',
      );
      return dispatch(bookingActions.bookingFormSuccess(data));
    } else {
      AlertHelper.showError(
        get(data, 'FieldErrors[0].ErrorText', 'Server Error'),
      );
      return dispatch(bookingActions.bookingFormError());
    }
  } catch (error) {
    if (error.response.status === 401) {
      dispatch(bookingActions.bookingFormError());
      return dispatch(logoutSuccess());
    } else {
      AlertHelper.showError(get(error.response, 'data.error', 'Server Error'));
      return dispatch(bookingActions.bookingFormError());
    }
  }
};

export const editOrRebookFromAppointment = (location, appointment) => async (
  dispatch,
) => {
  const extensionData = getExtensionFromAppointment(appointment);
  const locationId = get(location, 'bookerLocationId');
  dispatch(getServices(locationId));
  const addons = await API.findAddonServices({
    LocationID: locationId,
    AddonsOnly: true,
  });

  const tempArr = convertAppointmentToState(
    appointment,
    get(addons, 'Results', []),
  );
  dispatch(setLocation(location));
  dispatch(
    setExtensionAddon({
      Name: get(extensionData, 'TreatmentName'),
      Price: {Amount: get(extensionData, 'Treatment.Price.Amount')},
      ...get(extensionData, 'Treatment', {}),
    }),
  );
  dispatch(bookingActions.getAddonSuccess(addons));
  dispatch(setmemberCount(tempArr));
  return dispatch(
    setIsEdit({
      group: appointment.groupID,
      appointment: appointment.appointment.ID,
      oldLocation: location.bookerLocationId,
    }),
  );
};
