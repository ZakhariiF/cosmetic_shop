import Radar from 'react-native-radar';

export const trigerListener = () => {
    const stringify = obj => (
    JSON.stringify(obj, null, 2)
    );
    Radar.on('location', (result) => {
        console.log('location:', stringify(result));
    });
    
    Radar.on('error', (err) => {
        console.log('error:', stringify(err));
    });
    
    Radar.on('log', (result) => {
        console.log('log:', stringify(result));
    });
}
const requestRadarPermission = (bakcground) => {
    Radar.requestPermissions(bakcground);
};

export const hasRadarPermission = (customerId) => {
    setUser(customerId);
    Radar.getPermissionsStatus().then((status) => {
        switch (status) {
            case 'GRANTED_BACKGROUND':
            console.log('GRANTED_BACKGROUND Permission granted');
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
    console.log("Radar User Id", userId);
    Radar.setUserId(userId);
}

export const trackOnce = (resolve, reject) => {
    Radar.trackOnce().then((result) => {
        console.log("Radar Track Once Success", result);
        resolve(result.location);
    }).catch((err) => {
        console.log("Radar Track Once Error", err);
        reject(err);
    });
}

export const distance = (origin, destination) => {
    return new Promise((resolve, reject) => {
        Radar.getDistance({
            origin,
            destination,
            mode: [
                'foot'
            ],
            units: 'imperial'
        }).then(result => {
            console.log(result);
            resolve(result);
        }).catch(err => {
            console.log(err);
            reject(err);
        })
    })
}
