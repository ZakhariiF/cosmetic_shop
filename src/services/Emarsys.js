import {client} from 'services';

export const subscribe = (email) => ({
  url: '/emarsys/addToContactList',
  data: {
    email,
  },
});

export const addToContactList = ({
  sourceType,
  firstName,
  lastName,
  email,
  homePhone = '',
  phoneNumber = '',
  bookerId = 0,
}) => {
  let data = [
    {
      11074: sourceType,
      1: firstName,
      2: lastName,
      3: email,
      15: homePhone,
      37: phoneNumber,
      8833: bookerId,
      31: 1,
    },
  ];

  console.log('Emarsys Payload:', data);

  return client.post('/emarsys/addToContactList', data).then((res) => res.data);
};
