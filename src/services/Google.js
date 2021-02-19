import config from 'constant/config';
import axios from 'axios';

export const geolocateSearchLocation = (searchLocation) => {
  return axios
    .get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${searchLocation}&key=${config.googleMapAPIKey}`,
    )
    .then(({data}) => {
      console.log('GOOGLE API RESPONSE:', data.results);
      return data.results;
    })
    .catch((e) => {
      console.log('GOOGLE API ISSUE:', e);
      return [];
    });
};
