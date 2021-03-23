import axios from 'axios';
import config from 'constant/config';
import {
  refreshTokens,
  getUserFromIdToken,
  getIdToken,
} from '@okta/okta-react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const checkStatus = (status) => status >= 200 && status < 300;

const client = axios.create({
  baseURL: config.baseUrl,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  // validateStatus: checkStatus,
});

client.interceptors.request.use(async (requestConfig) => {
  if (
    requestConfig.url.includes('/booker/') ||
    requestConfig.url.includes('/okta/update-user')
  ) {
    let retries = 0;
    try {
      const tokenStr = await AsyncStorage.getItem('tokens');
      const tokens = JSON.parse(tokenStr);

      const userClamStr = await AsyncStorage.getItem('userClams');
      const userClams = JSON.parse(userClamStr);

      requestConfig.headers = {
        ...requestConfig.headers,
        Authorization: `Bearer ${tokens.id_token}`,
        clientId: config.clientId,
      };

      if (userClams.nonce) {
        requestConfig.headers.nonce = userClams.nonce;
      }
    } catch (e) {
      retries += 1;
      console.log('Adding Header Issue:', e);
    }
  }

  return requestConfig;
});

client.interceptors.response.use(
  (response) => {
    console.log(55, response);
    return response;
  },
  async (error) => {
    if (error.response.status === 401 && error.config.url.includes('/booker/')) {
      const tokens = await refreshTokens();
      await AsyncStorage.setItem('tokens', JSON.stringify(tokens));
  
      console.log('refreshTokens:', tokens);

      const userClams = await getUserFromIdToken();
      await AsyncStorage.setItem('userClams', JSON.stringify(userClams));

      error.config.headers = {
        ...error.config.headers,
        Authorization: `Bearer ${tokens.id_token}`,
        clientId: config.clientId,
      };

      if (userClams.nonce) {
        error.config.headers.nonce = userClams.nonce;
      }

      console.log('Error Config:', error.config);

      return axios.request(error.config);
    } else {
      console.log('erro>>>>>', error, error.response);
      return Promise.reject(error);
    }
  },
);

export {client};

export * from './Booking';
export * from './Dashboard';
export * from './Auth';
export * from './Account';
