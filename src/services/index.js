import axios from 'axios';
import config from 'constant/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {refreshTokens} from '@okta/okta-react-native';
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
    let tokenData = await AsyncStorage.getItem('token');

    try {
      // tokenData = JSON.parse(tokenData)

      // const today = new Date().getTime()
      // const time = tokenData.time

      // console.log('Token Expires:', today, time, today - time, tokenData.token.expires_in * 1000)

      // if (today - time >= 3600 * 1000) {
      //   const params = new URLSearchParams();
      //   params.append('grant_type', 'refresh_token');
      //   params.append('redirect_uri', config.redirectUri);
      //   params.append('scope', 'openid profile offline_access');
      //   params.append('refresh_token', tokenData.token.refresh_token);
      //   // params.append('client_id', config.clientId);

      //   console.log('Refresh Token Params:', params)

      //   const {data: newToken} = await axios.post(`${config.issuer}/oauth2/default/v1/token`, params, {
      //     headers: {
      //       Authorization: `Basic ${tokenData.token.id_token}`,
      //     }
      //   })

      //   console.log('New Token:', newToken)

      //   tokenData = {
      //     token: newToken,
      //     nonce: tokenData.nonce,
      //     time: new Date().getTime()
      //   }

      //   AsyncStorage.setItem('token', JSON.stringify(tokenData))
      // }
      const tokens = await refreshTokens();

      tokens.expires_in = 86400;
      tokens.scope = 'offline_access openid profile';
      tokens.token_type = 'Bearer';
      tokenData = {
        token: tokens,
        time: new Date().getTime(),
      };
      await AsyncStorage.setItem('token', JSON.stringify(tokenData));

      if (tokenData.token && tokenData.token.id_token) {
        requestConfig.headers = {
          ...requestConfig.headers,
          Authorization: `Bearer ${tokenData.token.id_token}`,
          clientId: config.clientId,
        };
      }
    } catch (e) {
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
