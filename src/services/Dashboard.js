import {client} from 'services';

export const getAppts = (userId, pageSize=10, fromStartDate=null) =>
  client
    .post('/booker/GetCustomerAppointments', {
      method: 'GET',
      urlParams: {
        customerId: userId,
      },
      data: {
        Count: pageSize,
        PageNumber: 1,
        ShowAppointmentIconFlags: true,
        fromStartDate,
      },
    })
    .then((response) => response.data);

export const cancelAppt = (ID) =>
  client
    .post('/booker/CancelAppointment', {
      method: 'PUT',
      urlParams: {},
      data: {
        ID,
      },
    })
    .then((response) => response.data);

export const cancelItinerary = (ID, LocationID) =>
  client
    .post('/booker/CancelItinerary', {
      method: 'POST',
      urlParams: {
        itineraryId: ID
      },
      data: {
        ID,
        LocationID
      },
    })
    .then((response) => response.data);
