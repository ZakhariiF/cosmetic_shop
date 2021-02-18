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
  isEmail = false,
}) => {
  let data = [
    {
      11074: sourceType,
      1: firstName,
      2: lastName,
      3: email,
      15: homePhone,
      37: phoneNumber,
    },
  ];

  if (isEmail) {
    data[0]['31'] = 1;
  } else {
    data[0]['4415'] = 1;
  }

  console.log('Emarsys Payload:', data);

  return client.post('/emarsys/addToContactList', data).then((res) => res.data);
};
