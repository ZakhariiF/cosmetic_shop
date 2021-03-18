import Radar from 'react-native-radar';

const requestRadarPermission = (background) => {
  Radar.requestPermissions(background);
};

export const getRadarPermission = () => {
  return new Promise((resolve, reject) => {
    Radar.getPermissionsStatus()
      .then((status) => {
        switch (status) {
          case 'GRANTED_FOREGROUND':
            requestRadarPermission(false);
            console.log('GRANTED_FOREGROUND Permission granted');
            break;
          case 'GRANTED_BACKGROUND':
            console.log('GRANTED_BACKGROUND Permission granted');
            requestRadarPermission(true);
            Radar.startTrackingResponsive();
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
        return resolve(status);
      })
      .catch((err) => reject(err));
  });
};

export const hasRadarPermission = async (customerId) => {
  setUser(customerId);
  let status = await Radar.requestPermissions(true);
  if (status === 'GRANTED_FOREGROUND') {
    status = await Radar.requestPermissions(true);
  }
  Radar.startTrackingResponsive();

  return status;
};
const setUser = (userId) => {
  console.log('Radar User Id', userId);
  Radar.setUserId(userId);
};

export const trackOnce = (resolve, reject) => {
  Radar.trackOnce()
    .then((result) => {
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
      mode: 'car',
      units: 'imperial',
    })
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
