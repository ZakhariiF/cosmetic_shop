import {Alert, Linking, Platform} from 'react-native';
import {Images} from '../constant';
import {PERMISSIONS, RESULTS, request} from 'react-native-permissions';

import {trackOnce} from 'utils/RadarHelper';
import {get} from 'lodash';
import moment from 'moment';

export const renderTabImages = (index) => {
  switch (index) {
    case 0:
      return Images.home;
    case 1:
      return Images.myappts;
    case 2:
      return Images.book;
    default:
      return Images.account;
  }
};

export const monthName = (date) => {
  if (date) {
    return date.toLocaleString('default', {month: 'long'});
  } else {
    let date = new Date();
    return date.toLocaleString('default', {month: 'long'});
  }
};

export const updateRouteName = (name) => {
  switch (name) {
    case 'Coming':
      return 'HOW MANY';
    case 'Addons':
      return 'ADD-ONS';
    case 'DateTime':
      return 'DATE/TIME';

    case 'ApptHold':
      return 'HOLD';

    default:
      return name.toUpperCase();
  }
};

export const firstDayMonth = () => {
  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  return firstDay.toISOString();
};

export const lastDayMonth = () => {
  var date = new Date();
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return lastDay.toISOString();
};

export const getDaysInMonth = (month, year) => {
  console.log('month number ', month);
  return new Array(31)
    .fill('')
    .map((v, i) => new Date(year, month - 1, i + 1))
    .filter((v) => v.getMonth() === month - 1);
};

export const isValidEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // eslint-disable-line
  return re.test(email.toLowerCase());
};

export const isEmptyString = (string) => {
  return !/\S/.test(string);
};

export const openMaps = (name, lat, lng, address = null) => {
  const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
  const latLng = `${lat || 40.7229427},${lng || -111.8588563}`;
  const label = name || 'Drybar Huntington Beach in Pacific City';
  const url = Platform.select({
    // ios: `${scheme}${label}&address=${address}@${latLng}`,
    ios: `${scheme}${label}&address=${address}`,
    android: `${scheme}${latLng}(${label})`,
  });

  Linking.openURL(url);
};

export const requestUserLocationLocation = () => {
  return new Promise((resolve, reject) => {
    request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    )
      .then((response) => {
        console.log(response);
        if (response === RESULTS.GRANTED) {
          // Geolocation.getCurrentPosition(
          //   (position) => {
          //     resolve(position);
          //   },
          //   (error) => {
          //     console.log(error.code, error.message);
          //   },
          //   {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
          // );
          trackOnce(resolve, reject);
        } else if (response === RESULTS.UNAVAILABLE) {
          reject(response);
          // Alert.alert(
          //   'Error',
          //   'We cannot find any hardware to fetch location on your device.',
          // );
        } else {
          reject(response);
          // Alert.alert(
          //   'Error',
          //   'Please, change your settings to allow DryBar to access your location.',
          // );
        }
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

// export const oktaConfig = () => {
//   createConfig({
//     clientId: config.clientId,
//     redirectUri: config.redirectUri,
//     endSessionRedirectUri: config.endSessionRedirectUri,
//     discoveryUri: config.discoveryUri,
//     scopes: config.scopes,
//     requireHardwareBackedKeyStore: false,
//   });
// };

export const playVideo = (link) => {
  Linking.openURL(link).catch((error) => {
    console.log('link error', error);
  });
};

export const greetings = () => {
  var d = new Date();
  var time = d.getHours();

  let welcome = '';

  if (time < 12) {
    welcome = 'good morning!';
  } else if (time < 17) {
    welcome = 'good afternoon!';
  } else {
    welcome = 'good evening!';
  }

  return welcome;
};

export const call = (number) => {
  console.log('PHone Number: ', number);
  Linking.openURL(`tel:${number}`);
};

export function distance(lat1, lon1, lat2, lon2, unit) {
  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == 'K') {
      dist = dist * 1.609344;
    }
    if (unit == 'N') {
      dist = dist * 0.8684;
    }
    return dist;
  }
}

const MAX_DISTANCE = 100;

export const findStoresFromPointWithTitle = (
  locationData,
  geolocatedPoints,
  searchStr,
  defaultPoint = null,
) => {
  if (locationData.length === 0) {
    return {
      error: 'Can not get the stores from contentful',
    };
  }

  let center = [];

  let storesByTitle = [];
  let storesSlugsByTitle = [];

  if (searchStr && searchStr !== '') {
    storesByTitle = locationData
      .filter((location) => {
        return (
          location.settings.visible &&
          location.contact &&
          location.title.toLowerCase().includes(searchStr.toLowerCase())
        );
      })
      .sort((a, b) => {
        if (
          !a.title.toLowerCase().includes(searchStr) &&
          b.title.toLowerCase().includes(searchStr)
        ) {
          return 1;
        }
        return 0;
      });
    storesByTitle.forEach((s) => {
      storesSlugsByTitle.push(s.slug);
      center.push({
        lat: s.contact.coordinates[0],
        lng: s.contact.coordinates[1],
      });
    });
  }

  let storesByAddress = [];

  if (geolocatedPoints && geolocatedPoints.length) {
    storesByAddress = locationData.filter((location) => {
      if (!location.settings.visible) return false;
      if (!location.contact || storesSlugsByTitle.includes(location.slug)) {
        return false;
      }

      let matchedAddress = geolocatedPoints.find((point) => {
        if (point.formatted_address.includes(location.contact.postalCode)) {
          return true;
        }

        if (
          point.address_components.length <= 5 &&
          point.address_components.length >= 2
        ) {
          let searchedState =
            point.address_components[point.address_components.length - 2];
          if (
            searchedState.long_name.includes(location.contact.state) ||
            searchedState.short_name.includes(location.contact.region) ||
            location.contact.region.includes(searchedState.long_name)
          ) {
            if (point.address_components.length <= 3) {
              // search with state
              return true;
            } else if (point.address_components.length >= 4) {
              // search with city
              let searchedCity =
                point.address_components[point.address_components.length - 4];

              if (searchedCity.long_name.includes(location.contact.city)) {
                if (point.address_components.length === 5) {
                  let searchedStreet = point.address_components[0];
                  if (
                    location.contact.street1.includes(
                      searchedStreet.long_name,
                    ) ||
                    location.contact.street1.includes(searchedStreet.short_name)
                  ) {
                    return true;
                  } else {
                    return false;
                  }
                }
                return true;
              } else {
                return false;
              }
            }
          }
        }
        return false;
      });
      return !!matchedAddress;
    });
    storesByAddress.forEach((location) => {
      storesSlugsByTitle.push(location.slug);
      center.push({
        lat: location.contact.coordinates[0],
        lng: location.contact.coordinates[1],
      });
    });
  }

  center = center.concat(
    (geolocatedPoints || []).map((g) => g.geometry.location),
  );

  if (center.length === 0 && defaultPoint) {
    center = [defaultPoint];
  }

  if (center.length === 0) {
    return {
      error: 'Can not get the stores from contentful',
    };
  }

  const filteredLocationData = locationData
    .filter(
      (location) =>
        location.settings.visible &&
        !storesSlugsByTitle.includes(location.slug),
    )
    .map((location) => {
      const storeLat = parseFloat(location.contact.coordinates[0]);
      const storeLng = parseFloat(location.contact.coordinates[1]);

      const distanceFromCenter = center.reduce((d, curPoint) => {
        const curLat = parseFloat(curPoint.lat);
        const curLng = parseFloat(curPoint.lng);
        const dis = distance(curLat, curLng, storeLat, storeLng);
        if (d > dis) {
          d = dis;
        }
        return d;
      }, MAX_DISTANCE);

      return {
        ...location,
        distanceFromCenter: distanceFromCenter,
      };
    })
    .filter((location) => location.distanceFromCenter < MAX_DISTANCE)
    .sort((location1, location2) =>
      location1.distanceFromCenter < location2.distanceFromCenter ? -1 : 1,
    );

  return {
    data: storesByTitle.concat(storesByAddress.concat(filteredLocationData)),
  };
};

export const mapGraphqlToNavigator = {
  locator: 'FindLocation',
  home: 'Home',
  styles: 'Stylists',
  services: 'Services',
  addons: 'Addons',
  barfly: 'BarflyMembership',
  'my account': 'MyAccount',
  booking: 'Book',
};

export const checkExtension = (appointment, service) => {
  let extension = get(
    appointment,
    'appointment.AppointmentTreatments',
    [],
  ).find(
    (s) =>
      s.AppointmentID === service.AppointmentID &&
      s.TreatmentName === 'Extensions',
  );

  if (!extension) {
    return (
      get(
        appointment,
        `appointments.appoint_${service.AppointmentID}.Notes`,
        '',
      ) || ''
    ).includes('Extensions Added.');
  }

  return extension;
};

export const getAddons = (service, appointment, addons) => {
  const addOnsByService = [];

  const currentAppointment = get(
    appointment,
    `appointments.appoint_${service.AppointmentID}`,
    '',
  );

  if (currentAppointment.AddOnItems && currentAppointment.AddOnItems.length) {
    currentAppointment.AddOnItems.forEach((a) => {
      const addonData = addons.find((i) => i.ServiceID == a.ItemID);
      if (addonData) {
        addOnsByService.push(addonData);
      }
    });
  }

  return addOnsByService;
};

export const getServicesFromAppointment = (appointment) => {
  const services = get(
    appointment,
    'appointment.AppointmentTreatments',
    [],
  ).filter((service) => service.TreatmentName !== 'Extensions');
  return services;
};

export const getExtensionFromAppointment = (appointment) => {
  const extensionData = get(
    appointment,
    'appointment.AppointmentTreatments',
    [],
  ).find((service) => service.TreatmentName === 'Extensions');
  return extensionData;
};

export const convertAppointmentToState = (
  appointment,
  addons,
  isRebook = false,
) => {
  const services = getServicesFromAppointment(appointment);
  const extensionData = getExtensionFromAppointment(appointment);

  const tempArr = services.map((service, idx) => {
    const extension = checkExtension(appointment, service);
    const addonsData = getAddons(service, appointment, addons);

    return {
      userType: idx === 0 ? 'Me' : 'Guest ' + idx,
      addons: addonsData,
      date: isRebook
        ? null
        : {
            date: moment(get(service, 'StartDateTimeOffset')).format(
              'YYYY-MM-DDTHH:mm:ssZ',
            ),

            time: {
              startTime: get(service, 'StartDateTimeOffset'),
              endTime: get(service, 'EndDateTimeOffset'),
              timezone: moment()
                .utcOffset(get(service, 'StartDateTimeOffset'))
                .utcOffset(),
            },
          },

      rooms: get(service, 'RoomID'),
      employees: get(service, 'EmployeeID'),
      services: {
        Name: get(service, 'TreatmentName'),
        Price: {Amount: get(service, 'Treatment.Price.Amount')},
        ...service.Treatment,
      },
      customer: appointment.Customer,
      extension: extension
        ? {
            price: get(extensionData, 'TagPrice.Amount', 20),
            name: 'Yes',
            room: get(extensionData, 'RoomID'),
            employee: get(extensionData, 'EmployeeID'),
          }
        : undefined,
    };
  });

  return tempArr;
};

export const getCardFirstNumbersByType = (type) => {
  switch (type) {
    case 1:
      return '3700';
    case 2:
      return '4000';
    case 3:
      return '5000';
    case 4:
      return '6011';
    default:
      return '0000';
  }
};
