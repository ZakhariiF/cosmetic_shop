import {client} from 'services';

export const getAppts = (userId, pageSize = 10, fromStartDate = null) =>
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

export const cancelAppt = (ID, type = 1) =>
  client
    .post('/booker/CancelAppointment', {
      method: 'PUT',
      urlParams: {},
      data: {
        ID,
        AppointmentCancellationType: {
          ID: type,
        },
      },
    })
    .then((response) => response.data);

export const cancelItinerary = (ID, LocationID, type) =>
  client
    .post('/booker/CancelItinerary', {
      method: 'POST',
      urlParams: {
        itineraryId: ID,
      },
      data: {
        ID,
        LocationID,
        AppointmentCancellationType: type,
      },
    })
    .then((response) => response.data);
