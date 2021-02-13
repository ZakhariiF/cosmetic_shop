// commented are mine

// const okta_dev = 'dev-6150636';
const okta_dev = 'drybar';

export default {
  baseUrl: 'https://staging-middleware.drybarshops.com',
  // 'http://middleware--loadbalancer-411306138.us-west-1.elb.amazonaws.com',
  clientId: '0oa9smate4rAOKz1W1d6',
  // clientId: '0oa5n6ah7xAHfBE7R1d6',
  issuer: 'https://drybar.oktapreview.com',
  // clientId: '0oa3407rmWHXEuT5J5d6',
  redirectUri: `com.oktapreview.${okta_dev}:/callback`,
  endSessionRedirectUri: `com.oktapreview.${okta_dev}:/logoutCallback`,
  discoveryUri: `https://${okta_dev}.oktapreview.com/oauth2/default`,
  scopes: ['openid', 'profile', 'offline_access'],
  oktaBaseurl: `https://${okta_dev}-admin.oktapreview.com`,
  oktaToken: '00QdfF7HK7zoAt4IXHXg9CUXoCErtW7f1xUfeBZTkM',
  // oktaToken: '00OKhJPOpvM5Ug8Fp0xdUrz4y--mJ3qoFl-b_jdv4l',
  spaceId: '13n1l6os99jz',
  graphToken: 'BlDmgl7JtKeJ-tRqK8y-Nxt5Q7bjpRiJUb6aL2vHw8U',
  wufoo: {
    subDomain: 'drybar',
    apiKey: '2V0P-FHL0-E3OP-7HEW',
    genericPartyFormId: 'm639jay05gnt4z',
    contactFormId: 'z1srujeu0vb2dvk',
  },
  googleMapAPIKey: 'AIzaSyBBho2G8GQkEwIBPeS4ph4cxM5_Ullfnws'
};
