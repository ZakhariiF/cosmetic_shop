import {Images} from '.';

export const screenOptions = [
  {name: 'My Appts \n', icon: Images.myappts, style: {height: 18, width: 16}},
  {
    name: 'Account \n Information',
    icon: Images.profile,
    style: {height: 20, width: 20},
  },
  {
    name: 'Barfly \n Membership',
    icon: Images.barflymember,
    style: {height: 50, width: 26},
  },
];

export const AccounData = [
  {
    title: 'Drybar Shops',
    data: [
      {name: 'Find a Location', route: 'FindLocation'},
      {name: 'Services', route: 'AccountService'},
      {name: 'The Styles', route: 'AccountStyle'},
      {name: 'Add-ons', route: 'AccountAddon'},
      {name: 'Contact Us', route: 'Contactus'},
      {name: 'Events', route: 'Events'},
    ],
    icon: Images.setting,
  },
  {
    title: 'Settings',
    data: [{name: 'Favorite', route: 'Favorites'}],
    icon: Images.setting,
  },
  {
    title: 'More',
    data: [
      {name: 'Accessibility Policy', route: 'AccessibilityPolicy'},
      {
        name: 'California Residents: Do not sell my information',
        route: 'CaliforniaResidents',
      },
      {name: 'Terms of Service', route: 'TermsOfServices'},
      {name: 'Privacy Policy', route: 'PrivacyPolicy'},
    ],
    icon: Images.more,
  },
];
