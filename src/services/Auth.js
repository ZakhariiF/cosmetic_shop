import axios from 'axios';
import config from 'constant/config';
import {client} from 'services';
import base64url from 'base64url'
import Url from 'url-parse'
import '../shim'
import crypto from 'crypto'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import {
  createConfig,
  signIn,
  signOut,
  getAccessToken,
  isAuthenticated,
  getUserFromIdToken,
  refreshTokens,
  getIdToken
} from '@okta/okta-react-native';

export const generateRandomString = (length = 44) => {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


export const getCodeChallange = (codeVerifier) => {
  console.log('Code verifier', codeVerifier, codeVerifier.length);
  const buffer = crypto.createHash('sha256').update(codeVerifier).digest();
  return base64url.encode(buffer)
}

export const signin = (data) => {
  return client
    .post(`/okta/create-user`, {
      profile: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        login: data.email,
        mobilePhone: data.phone,
      },
    })
    .then((response) => response.data);
};
export const _login = async (t, email, password) => {
  const {data} = await axios
    .post(`${config.issuer}/api/v1/authn`, {
      username: email,
      password,
      options: {
        multiOptionalFactorEnroll: false,
        warnBeforePasswordExpired: false,
      },
    })
  const nonce = 'n-0S6_WzA2Mj';
  const tokens = await refreshTokens();
  tokens['expires_in'] = 86400;
  tokens['scope'] = 'offline_access openid profile'
  tokens['token_type'] = "Bearer";
  console.log("tokens from refreshtoken function", tokens);
  const token = {
    token: tokens,
    nonce,
    time: new Date().getTime()
  }
  await AsyncStorage.setItem('token', JSON.stringify(token))
  return {
    ...data,
    token
  };
}
export const login = async (email, password) => {

  const {data} = await axios
    .post(`${config.issuer}/api/v1/authn`, {
      username: email,
      password,
      options: {
        multiOptionalFactorEnroll: false,
        warnBeforePasswordExpired: false,
      },
    })
    if (data.sessionToken) {

      try {
        const codeVerifier = generateRandomString()
        let res = await getAuthenticationCode(nonce, data.sessionToken, codeVerifier);
        if (res.status !== 302 || !res.headers.map.location) {
          throw new Error('Can not get the authorization code')
        }

        let redirectUrl = Url(res.headers.map.location, true)

        let code = redirectUrl.query.code
        let state = redirectUrl.query.state

        if (code && state) {
          const {data: tokenData} = await getToken(code, codeVerifier, state);
          const token = {
            token: tokenData,
            nonce,
            time: new Date().getTime()
          }
          console.log("token to saved asyc", token);
          await AsyncStorage.setItem('token', JSON.stringify(token))
          return {
            ...data,
            token
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    return data
};

export const getAuthenticationCode = (nonce, sessionToken, codeVerifier) => {
  const code_challenge = getCodeChallange(codeVerifier);
  console.log("Code Challenge Value", code_challenge, code_challenge.length);
  const uri = `${config.issuer}/oauth2/default/v1/authorize?client_id=${config.clientId}&response_type=code&scope=openid profile offline_access&redirect_uri=${config.redirectUri}&state=Af0ifjslDkj&nonce=${nonce}&code_challenge_method=S256&code_challenge=${code_challenge}&sessionToken=${sessionToken}`;
  console.log('URL to Authentication Code', uri);

  if (Platform.OS == 'ios') {
    return fetch(
      uri,
      {
        headers: new Headers({
          'content-type': 'application/json',
        })
      }
    )
  } else {
    return fetch(
      uri,
      {
        headers: new Headers({'content-type': 'application/json'})
      }
    )
  }
}

export const getToken = (code, codeVerifier, state) => {
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('client_id', config.clientId);
  params.append('code', code);
  params.append('redirect_uri', config.redirectUri);
  params.append('code_verifier', codeVerifier);
  params.append('state', state);

  console.log('Params:', params, `${config.issuer}/oauth2/v1/token`)

  console.log(`${config.issuer}/oauth2/default/v1/token`, {
    grant_type: 'authorization_code',
    client_id: config.clientId,
    code,
    redirect_uri: config.redirectUri,
    code_verifier: codeVerifier,
    state
  })

  return axios.post(
    `${config.issuer}/oauth2/default/v1/token`,
    params
  )
}

export const updateUser = (id, data) => {
  return axios
    .post(
      `${config.oktaBaseurl}/api/v1/users/${id}`,
      {
        profile: data,
      },
      {
        headers: {
          Authorization: `SSWS ${config.oktaToken}`,
        },
      },
    )
    .then((response) => response.data);
};

// export const recoverPassword = (email) => {
//   return axios
//     .post(`${config.oktaBaseurl}/api/v1/authn/recovery/password`, {
//       username: email,
//       factorType: 'EMAIL',
//     })
//     .then((response) => response.data);
// };

export const recoverPassword = (email) => {
  return client
    .post(`/okta/forgot-password`, {
      id: email,
    })
    .then((response) => response.data);
};

export const changePassword = (userId, data) => {
  console.log('useId,,,,', userId, data);
  return axios
    .post(
      `${config.oktaBaseurl}/api/v1/users/${userId}/credentials/change_password`,
      {
        oldPassword: {value: data.oldPassword},
        newPassword: {value: data.newPassword},
      },
      {
        headers: {
          Authorization: `SSWS ${config.oktaToken}`,
        },
      },
    )
    .then((response) => response.data);
};

export const getUser = (userId) => {
  return axios
    .get(`${config.oktaBaseurl}/api/v1/users/${userId}`, {
      headers: {
        Authorization: `SSWS ${config.oktaToken}`,
      },
    })
    .then((response) => response.data);
};

export const getCustomer = (id) => {
  return client
    .post('/booker/GetCustomer', {
      method: 'GET',
      urlParams: {
        customerId: id,
      },
      data: {
        includeFieldValues: true,
      },
    })
    .then((response) => response.data);
};

export const resendEmail = (email) => {
  return client
    .post('/okta/resend-activation-link', {
      id: email,
    })
    .then((response) => response.data);
};
