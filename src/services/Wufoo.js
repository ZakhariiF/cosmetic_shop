import appConfig from 'constant/config';
import config from 'constant/config';

export const submitContact = (formData) => {
  let postData = new FormData();
  postData.append('Field1', formData.name);
  postData.append('Field3', formData.email);
  postData.append('Field4', formData.phoneNumber);
  postData.append('Field5', formData.message);
  return fetch(
    `https://${appConfig.wufoo.subDomain}.wufoo.com/api/v3/forms/${appConfig.wufoo.contactFormId}/entries.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(config.wufoo.apiKey + ':password')}`,
      },
      body: postData,
      redirect: 'follow',
    },
  )
    .then((response) => response.json())
    .then((data) => data);
};
