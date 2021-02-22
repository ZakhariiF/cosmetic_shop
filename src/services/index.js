import axios from 'axios';
import config from 'constant/config';
import {
  refreshTokens,
  getUserFromIdToken,
  getIdToken,
} from '@okta/okta-react-native';
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
  if (requestConfig.url.includes('/booker/')) {
    let retries = 0;

    while (retries < 3) {
      try {
        const tokens = await refreshTokens();
        const userClams = await getUserFromIdToken();

        requestConfig.headers = {
          ...requestConfig.headers,
          Authorization: `Bearer ${tokens.id_token}`,
          clientId: config.clientId,
        };

        if (userClams.nonce) {
          requestConfig.headers.nonce = userClams.nonce;
        }
        break;
      } catch (e) {
        retries += 1;
        console.log('Adding Header Issue:', e);
      }
    }
  }

  return requestConfig;
});

client.interceptors.response.use(
  (response) => {
    console.log(55, response);
    return response;
  },
  (error) => {
    console.log('erro>>>>>', error, error.response);

    return Promise.reject(error);
  },
);

export {client};

export * from './Booking';
export * from './Dashboard';
export * from './Auth';
export * from './Account';
