import {client} from 'services';
import config from 'constant/config';
import {responsePathAsArray} from 'graphql';

export const getServices = (locationId) =>
  client
    .post('/booker/FindTreatments', {
      method: 'POST',
      urlParams: {},
      data: {
        LocationID: locationId,
      },
    })
    .then((response) => response.data);

export const getAddons = (id) =>
  client
    .post('/booker/GetTreatmentAddOns', {
      method: 'GET',
      urlParams: {
        treatmentId: id,
      },
      data: {},
    })
    .then((response) => response.data);

export const findAddonServices = (data) =>
  client
    .post('/booker/FindAddOnServices', {
      method: 'POST',
      urlParams: {},
      data,
    })
    .then((response) => response.data);

export const getSlots = (data) =>
  client
    .post('/booker/Availability1Day', {
      method: 'GET',
      urlParams: {},
      data,
    })
    .then((response) => response.data);

export const createAppt = (data) =>
  client
    .post('/booker/CreateAppointment', {
      method: 'POST',
      urlParams: {},
      data,
    })
    .then((response) => response.data);

export const addAddonsToAppointment = (data) =>
  client
    .post('/booker/AddAddonItemToAppointment', {
      method: 'POST',
      urlParams: {},
      data,
    })
    .then((response) => response.data);

export const createItinerary = (data) =>
  client
    .post('/booker/CreateItinerary', {
      method: 'POST',
      urlParams: {},
      data,
    })
    .then((response) => response.data);

export const bookItinerary = (itineraryId, groupName) =>
  client
    .post('/booker/BookItinerary', {
      method: 'POST',
      urlParams: {
        itineraryId,
      },
      data: {
        ID: itineraryId,
        GroupName: groupName,
      },
    })
    .then((response) => response.data);

export const availableDates = (data) =>
  client
    .post('/booker/AvailableDates', {
      method: 'GET',
      urlParams: {},
      data,
    })
    .then((response) => response.data);

export const findLocation = (data) =>
  client
    .post('/booker/FindLocations', {
      method: 'POST',
      urlParams: {},
      data: {},
    })
    .then((response) => response.data);

export const updateAppt = (data) =>
  client
    .put('/booker/UpdateAppointment', {
      method: 'POST',
      urlParams: {},
      data,
    })
    .then((response) => response.data);

export const promoCode = (locationId, code) =>
  client
    .post('/booker/GetSpecialByCode', {
      method: 'GET',
      urlParams: {
        locationId,
      },
      data: {
        couponcode: code,
      },
    })
    .then((response) => response.data);

export const applyPromoCodeToMultiple = ({orderId, specialIds}) =>
  client
    .post('/booker/AddSpecialToOrder', {
      method: 'POST',
      urlParams: {
        orderId,
      },
      data: {
        ID: orderId,
        SpecialIDs: specialIds,
      },
    })
    .then((response) => response.data);

export const validatePromoCode = (promoCode) =>
  client
    .get(`/promo/getList?code=${promoCode}`)
    .then((response) => response.data);

export const updatePromoCode = (promoCode) =>
  client
    .post('/promo/updateItem', {
      code: promoCode,
    })
    .then((response) => response.data);

export const addCC = (data) =>
  client
    .post('/booker/AddCreditCardToCustomer', {
      method: 'POST',
      urlParams: {},
      data,
    })
    .then((response) => response.data);

export const getCC = (userId, locationId) =>
  client
    .post('/booker/GetCustomerCreditCards', {
      method: 'POST',
      urlParams: {},
      data: {
        CustomerID: userId,
        SpaID: locationId,
      },
    })
    .then((response) => response.data);

export const getEmployee = (data) =>
  client
    .post('/booker/TimeSlot', {
      method: 'POST',
      urlParams: {},
      data,
    })
    .then((response) => response.data);

export const setFavLoc = (data) =>
  client
    .post('/booker/SetCustomerFavoriteLocation', {
      method: 'POST',
      urlParams: {
        customerId: data.userId,
      },
      data: {
        LocationID: data.locId,
        CustomerID: data.userId,
        CustomerFieldValues: {
          FieldValues: [
            {
              Key: '56378',
              Value: {
                TextValue: {
                  Value: data.locId,
                },
              },
            },
          ],
        },
      },
    })
    .then((response) => response.data);

export const multiUserSlots = (data) =>
  client
    .post('/booker/MultiGuest1Day', {
      method: 'POST',
      urlParams: {},
      data,
    })
    .then((response) => response.data);

export const getFieldValues = () =>
  fetch(
    `https://${config.wufoo.subDomain}.wufoo.com/api/v3/forms/${config.wufoo.genericPartyFormId}/fields.json`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa(config.wufoo.apiKey + ':password')}`,
      },
      redirect: 'follow',
    },
  )
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.log('error in wufoo api ', error));

export const bookedForMoreUser = (data) => {
  let formdata = new FormData();
  formdata.append('Field1', data.firstName);
  formdata.append('Field2', data.lastName);
  formdata.append('Field3', data.email);
  formdata.append('Field10', data.phoneNumber);
  formdata.append('Field4', data.address1);
  formdata.append('Field5', data.address2);
  formdata.append('Field6', data.city);
  formdata.append('Field7', data.states);
  formdata.append('Field8', data.postalCode);
  formdata.append('Field12', data.selectedLoc);
  formdata.append('Field15', data.selectedTime);
  formdata.append('Field17', data.partySize);
  formdata.append('Field19', data.notes);
  formdata.append('Field25', data.occasion);
  formdata.append('Field21', 'Book More Than 4');

  return fetch(
    `https://${config.wufoo.subDomain}.wufoo.com/api/v3/forms/${config.wufoo.genericPartyFormId}/entries.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(config.wufoo.apiKey + ':password')}`,
      },
      body: formdata,
      redirect: 'follow',
    },
  )
    .then((response) => response.json())
    .then((data) => data);
};
