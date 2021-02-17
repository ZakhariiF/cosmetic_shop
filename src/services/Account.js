import {client} from 'services';

export const getCustomerMembership = (data) => {
  return client
    .post('/booker/FindCustomerMemberships', {
      method: 'POST',
      urlParams: {},
      data,
    })
    .then((response) => response.data);
};

export const findMembershipByLocation = (locationId, pageSize = 5) => {
  return client.post('/booker/FindMemberships', {
    method: 'POST',
    urlParams: {},
    data: {
      PageSize: pageSize,
      LocationID: locationId,
    },
  });
};

export const getCustomerDetails = (id) => {
  return client
    .post('/booker/GetCustomer', {
      method: 'GET',
      urlParams: {
        customerId: id,
      },
      data: {
        Count: 1,
        PageNumber: 1,
        ShowAppointmentIconFlags: true,
        includeFieldValues: true,
      },
    })
    .then((response) => response.data);
};

export const updateCustomer = (customer) => {
  return client
    .post('/booker/UpdateCustomer', {
      method: 'PUT',
      urlParams: {
        customerId: customer.ID,
      },
      data: {
        LocationID: customer.LocationID,
        CustomerID: customer.ID,
        Customer: {
          LastName: customer.LastName,
          FirstName: customer.FirstName,
          Email: customer.Email,
          Address: customer.Address,
          CellPhone: customer.CellPhone,
          DateOfBirthOffset: customer.DateOfBirthOffset,
        },
      },
    })
    .then((response) => response.data);
};

export const addCreditCardForCustomer = (
  locationId,
  customerId,
  card,
  type,
  expirationDate,
) => {
  return client
    .post('/booker/AddCreditCardToCustomer', {
      method: 'POST',
      urlParams: {},
      data: {
        SpaID: locationId,
        CustomerID: customerId,
        CreditCard: {
          Type: {
            ID: type,
          },
          Number: card.Number,
          NameOnCard: card.NameOnCard,
          ExpirationDateOffset: expirationDate,
          SecurityCode: card.SecurityCode,
        },
      },
    })
    .then((res) => res.data);
};

export const createOrder = (customerId) => {
  return client
    .post('/booker/CreateOrder', {
      method: 'POST',
      urlParams: {},
      data: {
        CustomerID: customerId,
      },
    })
    .then((res) => res.data);
};

export const addMembershipToOrder = ({
  orderId,
  locationId,
  billingCycleStartDate,
  membershipId,
}) =>
  client
    .post('/booker/AddMembershipToOrder', {
      method: 'POST',
      urlParams: {
        orderId: orderId,
      },
      data: {
        BillingCycleStartDateOffset: billingCycleStartDate,
        InitiationFee: 0,
        LocationID: locationId,
        AutoRenew: true,
        IncludeBenefits: true,
        PaymentPlanID: membershipId,
        ID: orderId,
      },
    })
    .then((res) => res.data);

export const placeOrder = (
  orderId,
  {Number, NameOnCard, SecurityCode, ExpirationDateOffset, Type},
  price,
  BillingZip,
) => {
  return client
    .post('/booker/PlaceOrder', {
      method: 'POST',
      urlParams: {
        orderId,
      },
      data: {
        ReturnPartialOrderObject: 'true',
        PaymentItem: {
          Amount: {
            Amount: price.Amount,
            CurrencyCode: price.CurrencyCode,
          },
          Method: {
            ID: '1',
          },
          CreditCard: {
            Number,
            SecurityCode,
            NameOnCard,
            BillingZip,
            ExpirationDateOffset,
            Type: {
              ID: Type,
            },
          },
        },
      },
    })
    .then((res) => res.data);
};

export const updateCustomerMembershipCreditCardOnFile = ({
  CustomerMembershipID,
  LocationID,
  CustomerID,
  CustomerCreditCardID,
}) => {
  return client
    .post('/booker/UpdateCustomerMembershipCreditCardOnFile', {
      method: 'POST',
      urlParams: {},
      data: {
        CustomerMembershipID,
        LocationID,
        CustomerID,
        CustomerCreditCardID,
      },
    })
    .then((res) => res.data);
};
