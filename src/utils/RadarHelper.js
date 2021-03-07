import Radar from 'react-native-radar';

const requestRadarPermission = (background) => {
  Radar.requestPermissions(background);
};

export const hasRadarPermission = (customerId) => {
  console.log('HasRadarPermission:', customerId);
  setUser(customerId);
  Radar.getPermissionsStatus().then((status) => {
    switch (status) {
      case 'GRANTED_BACKGROUND':
        Radar.startTrackingContinuous();
        console.log('RADAR PERMISSION GRANTED_BACKGROUND:');
        break;
      case 'GRANTED_FOREGROUND':
        console.log('GRANTED_FOREGROUND Permission granted');
        break;
      case 'DENIED':
        console.log('RADAR PERMISSION DENIED');
        requestRadarPermission(false);
        break;
      case 'UNKNOWN':
        console.log('RADAR PERMISSION UNKWOWN');
        requestRadarPermission(false);
        break;
      default:
        break;
    }
  });
};
const setUser = (userId) => {
  console.log('Radar User Id', userId);
  Radar.setUserId(userId);
};

export const trackOnce = (resolve, reject) => {
  Radar.trackOnce()
    .then((result) => {
      console.log('Radar Track Once Success', result);
      resolve(result.location);
    })
    .catch((err) => {
      console.log('Radar Track Once Error', err);
      reject(err);
    });
};

export const distance = (origin, destination) => {
  return new Promise((resolve, reject) => {
    Radar.getDistance({
      origin,
      destination,
      mode: ['car'],
      units: 'imperial',
    })
      .then((result) => {
        console.log(result);
        resolve(result);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};
